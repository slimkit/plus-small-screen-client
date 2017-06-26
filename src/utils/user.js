import localEvent from '../stores/localStorage';
import { createAPI, addAccessToken } from '../utils/request';
import errorCodes from '../stores/errorCodes';
import getImage from './getImage';
import defaultAvatar from '../statics/images/defaultAvatarx2.png';
import lodash from 'lodash';

// async function getLocalDbUser(user_id) {
//   return await window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.userbase, async () => {
//     return await window.TS_WEB.dataBase.userbase.where('user_id').equals(parseInt(user_id)).toArray(); 
//   })
// };
function getLocalDbUser( user_id ) {
  return window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.userbase, () => {
    return window.TS_WEB.dataBase.userbase.where('user_id').equals(parseInt(user_id)).toArray().then( array => {
      return array.pop();
    }); 
  })
};

function followingUser(user_id, cb) {
  return new Promise( (resolve, reject ) => {
    addAccessToken().post(
      createAPI('users/follow'),
      {
        user_id
      },
      {
        validate: status => status === 201
      }
    )
    .then(response => {
      window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.relationship, () => {
        window.TS_WEB.dataBase.relationship.where("[uid+uuid]").equals([window.TS_WEB.currentUserId, user_id]).modify({following: 1});
      });
      resolve(response.data);
    })
    .catch( error => {
      reject(error);
    })
  })
};

function unFollowingUser(user_id) {
  return new Promise( (resolve, reject) => {
    addAccessToken().delete(
      createAPI(`users/unFollow?user_id=${user_id}`),
      {},
      {
        validate: status => status === 204
      }
    )
    .then(response => {
      window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.relationship, () => {
        window.TS_WEB.dataBase.relationship.where("[uid+uuid]").equals([window.TS_WEB.currentUserId, user_id]).modify({following: 0});
      });
      resolve(response.data);
    })
    .catch(error => {
      reject(error);
    })
  });
};

function getAvatar (userInfo, process, cb) {
  // 已有本地用户
  userInfo.avatar = {};
  if(userInfo.hasOwnProperty('datas')) { // 有datas属性
    if(userInfo.datas.hasOwnProperty('avatar')) { // 有avatar属性
      if(userInfo.datas.avatar.hasOwnProperty('value')) { // 有上传过avatar
        if(userInfo.datas.avatar.hasOwnProperty('urls')) { // 没有本地图片
          if(!userInfo.datas.avatar.urls.hasOwnProperty(process)) {
            userInfo.datas.avatar.urls[process] = userInfo.avatar[process] = getImage(userInfo.datas.avatar.value, 20);
          }
        } else {
          userInfo.datas.avatar.urls = {};
          userInfo.datas.avatar.urls[process] = userInfo.avatar[process] = getImage(userInfo.datas.avatar.value, 20);
        }
      } else {
        userInfo.datas.avatar.urls = {};
        userInfo.datas.avatar.urls[process] = userInfo.avatar[process] = defaultAvatar;
      }
    } else {
      userInfo.datas.avatar = {};
      userInfo.datas.avatar.urls = {};
      userInfo.datas.avatar.urls[process] = userInfo.avatar[process] = defaultAvatar;
    }
  } else { // 没有本地用户
    userInfo.datas.avatar = {};
    userInfo.datas.avatar.urls = {};
    userInfo.datas.avatar.urls[process] = userInfo.avatar[process] = defaultAvatar;
  }
  cb(userInfo);
};

function getUserInfo (user_id, process = 30) {
  const db = window.TS_WEB.dataBase;
  return new Promise( (resolve, reject) => {
    addAccessToken().post(createAPI('users'), {
        user_ids: [ user_id ]
      },
      {
        validate: status => status === 200
      }
    )
    .then(response => {
      let user = response.data.data.pop();
      let userLocal = {
        user_id: 0,
        name: '',
        phone: '',
        counts: {},
        datas: {},
        is_following: 0,
        is_followed: 0
      };
      userLocal.user_id = user.id;
      userLocal.name = user.name;
      userLocal.phone = user.phone;
      userLocal.is_followed = user.is_followed ? 1 : 0;
      userLocal.is_following = user.is_following ? 1 : 0;
      if(user.id !== TS_WEB.currentUserId) {
        // 关注和相互关注状态
        db.transaction('rw?', db.relationship, () => {
          db.relationship.where('[uid+uuid]').equals([window.TS_WEB.currentUserId, user.id]).delete().then( item => {
            db.relationship.put({
              uid: window.TS_WEB.currentUserId,
              uuid: user.id,
              followed: user.is_followed ? 1 : 0,
              following: user.is_following ? 1 : 0
            })
          });
        })
        .catch( e => {
          // console.log(TS_WEB.currentUserId, user.id);
          // console.log(e);
        });
      }
      user.counts.map(function (count, index) {
        let keyName = count.key;
        let value = parseInt(count.value);
        userLocal.counts = { ...userLocal.counts, [keyName]:  value };
      });
      let newData = {};
      user.datas.forEach(data => {
        newData[data.profile] = {
          display: data.profile_name,
          value: data.pivot.user_profile_setting_data,
          type: data.type,
          options: data.default_options,
          updated_at: data.updated_at
        };
      });
      userLocal.datas = newData;
      let dataForBase = {};
      getAvatar(userLocal, process, newUserLocal => {
        userLocal = newUserLocal;
        dataForBase = newUserLocal;
      });
      localEvent.setLocalItem('user_' + user_id, userLocal);

      // 删除旧用户，写入新用户
      db.transaction('rw?', db.userbase, () => {
        db.userbase.where('user_id').equals(parseInt(dataForBase.user_id)).delete().then( () => {
          db.userbase.put(
            dataForBase
          )
        });
      })
      .then()
      .catch( err => {
        console.log(err.stack || err);
      });
      resolve(userLocal);
    })
  })
};

function getUsersInfo (user_ids, cb) {
  return new Promise( (resolve, reject) => {
    let user_ids_need_to_request = [];
    let users = {};

    // 检查已有的本地用户
    user_ids.map((user_id) => {
      let oldUserLocal = localEvent.getLocalItem(`user_${user_id}`);
      if(!lodash.keys(oldUserLocal).length) {
        user_ids_need_to_request.push(user_id);
      }
      users[user_id] = oldUserLocal;
    });
    if(user_ids_need_to_request.length) {
      addAccessToken().post(createAPI('users'), {
          user_ids: user_ids_need_to_request
        },
        {
          validate: status => status === 200
        }
      )
      .then(response => {
        let users_service = response.data.data;
        let userLocal = {
          user_id: 0,
          name: '',
          phone: '',
          counts: {},
          datas: {},
          avatar: ''
        };
        // 组装数据
        users_service.map((user) => {
          let current_local_user = { ...userLocal };
          current_local_user.user_id = user.id;
          current_local_user.name = user.name;
          current_local_user.phone = user.phone;
          current_local_user.is_following = user.is_following ? 1 : 0;
          current_local_user.is_followed = user.is_followed ? 1 : 0;
          if(user.counts.length) {
            user.counts.map((count) => {
              let keyName = count.key;
              let value = count.value;
              current_local_user.counts = { ...current_local_user.counts, ...{ [keyName]:  value } };
            });
          }
          if(user.datas.length) {
            let newData = {};
            user.datas.forEach(data => {
              newData[data.profile] = {
                display: data.profile_name,
                value: data.pivot.user_profile_setting_data,
                type: data.type,
                options: data.default_options,
                updated_at: data.updated_at
              };
            });
            current_local_user.datas = newData;
          }
          getAvatar(current_local_user, 30, newUserLocal => {
            current_local_user = newUserLocal;
          });
          localEvent.setLocalItem('user_' + current_local_user.user_id, current_local_user);
          let db = window.TS_WEB.dataBase;
          let dataForBase = current_local_user;
          delete dataForBase.is_followed;
          delete dataForBase.is_following;
          // 删除旧用户，写入新用户
          // db.transaction('rw?', db.userbase, () => {
          //   db.userbase.where('user_id').equals(dataForBase.user_id).delete().then(user => {
          //     db.userbase.add(
          //       dataForBase
          //     )
          //   })
          //   .then()
          //   .catch( err => {
          //     console.log(err.stack || err);
          //   });
          // });
          users[user.id] = current_local_user;
        });
        resolve(users);
      })
    } else {
      // 返回本地数据
      resolve(users);
    }
  });
};

export {
  getUserInfo,
  getUsersInfo,
  getAvatar,
  unFollowingUser,
  followingUser,
  getLocalDbUser
};