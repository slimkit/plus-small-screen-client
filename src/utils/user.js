import localEvent from '../stores/localStorage';
import {
  createAPI,
  addAccessToken,
  createOldAPI
} from '../utils/request';
import errorCodes from '../stores/errorCodes';
import getImage from './getImage';
import lodash from 'lodash';
import buildURL from 'axios/lib/helpers/buildURL';
import {
  resolveImage
} from './resource';
const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));

function getLocalDbUser(user_id) {
  return window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.userbase, () => {
    return window.TS_WEB.dataBase.userbase.where('user_id').equals(parseInt(user_id)).toArray().then(array => {
      return array.pop();
    });
  })
};

function followingUser(user_id, cb) {
  return new Promise((resolve, reject) => {
    addAccessToken().post(
        createOldAPI('users/follow'), {
          user_id
        }, {
          validate: status => status === 201
        }
      )
      .then(response => {
        window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.relationship, () => {
          window.TS_WEB.dataBase.relationship.where("[uid+uuid]").equals([window.TS_WEB.currentUserId, user_id]).modify({
            following: 1
          });
        });
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      })
  })
};

function unFollowingUser(user_id) {
  return new Promise((resolve, reject) => {
    addAccessToken().delete(
        createOldAPI(`users/unFollow?user_id=${user_id}`), {}, {
          validate: status => status === 204
        }
      )
      .then(response => {
        window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.relationship, () => {
          window.TS_WEB.dataBase.relationship.where("[uid+uuid]").equals([window.TS_WEB.currentUserId, user_id]).modify({
            following: 0
          });
        });
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      })
  });
};

// 获取当前登录用户信息
function getLoggedUserInfo() {
  const db = window.TS_WEB.dataBase;
  return new Promise((resolve, reject) => {
    addAccessToken().get(createAPI('user'), {}, {
        validateStatus: status => status == 200
      })
      .then(response => {
        let user = response.data;
        let userLocal = {
          user_id: 0,
          name: '',
          phone: '',
          following: 0,
          follower: 0,
          avatar: '',
          bg: '',
          bio: '',
          email: '',
          extra: '',
          location: '',
          sex: '',
          wallet: {}
        };
        userLocal.user_id = user.id;
        userLocal.name = user.name;
        userLocal.phone = user.phone;
        userLocal.following = user.following ? 1 : 0;
        userLocal.follower = user.follower ? 1 : 0;
        userLocal.avatar = user.avatar;
        userLocal.sex = user.sex;
        userLocal.bg = user.bg;
        userLocal.bio = user.bio;
        userLocal.email = user.email;
        userLocal.extra = user.extra;
        userLocal.location = user.location;
        userLocal.wallet = user.wallet;
        if (user.id !== TS_WEB.currentUserId) {
          // 关注和相互关注状态
          db.transaction('rw?', db.relationship, () => {
              db.relationship.where('[uid+uuid]').equals([window.TS_WEB.currentUserId, user.id]).delete().then(item => {
                db.relationship.put({
                  uid: window.TS_WEB.currentUserId,
                  uuid: user.id,
                  followed: user.follower ? 1 : 0,
                  following: user.following ? 1 : 0
                })
              });
            })
            .catch(e => {
              // console.log(TS_WEB.currentUserId, user.id);
              // console.log(e);
            });
        }

        // let newData = {};
        // user.datas.forEach(data => {
        //   newData[data.profile] = {
        //     display: data.profile_name,
        //     value: data.pivot.user_profile_setting_data,
        //     type: data.type,
        //     options: data.default_options,
        //     updated_at: data.updated_at
        //   };
        // });
        // userLocal.datas = newData;

        let dataForBase = {};

        let avatar = defaultAvatar;

        // if (newData.avatar && !userLocal.avatar) {
        //   avatar = buildURL(createAPI(`files/${newData.avatar.value}`), {
        //     w: 200,
        //     h: 200
        //   });
        // }

        if (!userLocal.avatar) {
          avatar = buildURL(createAPI(`files/${newData.avatar.value}`), {
            w: 200,
            h: 200
          });
        }

        userLocal.avatar = userLocal.avatar ? userLocal.avatar : avatar;

        dataForBase = {
          ...userLocal
        };
        localEvent.setLocalItem('user_' + userLocal.user_id, userLocal);

        // 删除旧用户，写入新用户
        db.transaction('rw?', db.userbase, () => {
            db.userbase.where('user_id').equals(parseInt(dataForBase.user_id)).delete().then(() => {
              db.userbase.put(
                dataForBase
              )
            });
          })
          .then()
          .catch(err => {
            console.log(err.stack || err);
          });
        resolve(userLocal);
      })
  })
}

function getUserInfo(user_id) {
  const db = window.TS_WEB.dataBase;
  return new Promise((resolve, reject) => {
    // addAccessToken().get(createAPI('user'), {
    addAccessToken().get(createAPI(`users/${user_id}?following=${user_id}&follower=${user_id}`), {}, {
        validate: status => status === 200
      })
      .then(response => {
        let user = response.data;
        let userLocal = {
          user_id: 0,
          name: '',
          phone: '',
          counts: {},
          datas: {},
          following: 0,
          follower: 0,
          avatar: ''
        };
        userLocal.user_id = user.id;
        userLocal.name = user.name;
        userLocal.phone = user.phone;
        userLocal.follower = user.follower ? 1 : 0;
        userLocal.following = user.following ? 1 : 0;
        userLocal.avatar = user.avatar;
        if (user.id !== TS_WEB.currentUserId) {
          // 关注和相互关注状态
          db.transaction('rw?', db.relationship, () => {
              db.relationship.where('[uid+uuid]').equals([window.TS_WEB.currentUserId, user.id]).delete().then(item => {
                db.relationship.put({
                  uid: window.TS_WEB.currentUserId,
                  uuid: user.id,
                  followed: user.follower ? 1 : 0,
                  following: user.following ? 1 : 0,
                })
              });
            })
            .catch(e => {
              // console.log(TS_WEB.currentUserId, user.id);
              // console.log(e);
            });
        }
        
        let dataForBase = {};

        let avatar = defaultAvatar;

        // if (newData.avatar && !userLocal.avatar) {
        //   userLocal.avatar = buildURL(createAPI(`files/${newData.avatar.value}`), {
        //     w: 200,
        //     h: 200
        //   });
        // }

        userLocal.avatar = userLocal.avatar ? userLocal.avatar : avatar;
        dataForBase = {
          ...userLocal
        };
        localEvent.setLocalItem('user_' + user_id, userLocal);

        // 删除旧用户，写入新用户
        db.transaction('rw?', db.userbase, () => {
            db.userbase.where('user_id').equals(parseInt(dataForBase.user_id)).delete().then(() => {
              db.userbase.put(
                dataForBase
              )
            });
          })
          .then()
          .catch(err => {
            console.log(err.stack || err);
          });
        resolve(userLocal);
      })
  })
};

function getUsersInfo(user_ids, cb) {
  return new Promise((resolve, reject) => {
    let user_ids_need_to_request = [];
    let users = {};

    // 检查已有的本地用户
    user_ids.map((user_id) => {
      let oldUserLocal = localEvent.getLocalItem(`user_${user_id}`);
      if (!lodash.keys(oldUserLocal).length) {
        user_ids_need_to_request.push(user_id);
      }
      users[user_id] = oldUserLocal;
    });
    if (user_ids_need_to_request.length) {
      let user_str = user_ids_need_to_request.join(',');
      addAccessToken().get(createAPI(`users?user=${user_str}`), {}, {
          validate: status => status === 200
        })
        .then(({
          data = []
        } = {}) => {
          let users_service = data;
          users_service.forEach(user => {
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
              let current_local_user = {...userLocal
              };
              current_local_user.user_id = user.id;
              current_local_user.name = user.name;
              current_local_user.phone = user.phone;
              current_local_user.following = user.following ? 1 : 0;
              current_local_user.follower = user.follower ? 1 : 0;
              current_local_user.avatar = user.avatar;
              if (user.counts.length) {
                user.counts.map((count) => {
                  let keyName = count.key;
                  let value = count.value;
                  current_local_user.counts = {...current_local_user.counts,
                    ... {
                      [keyName]: value
                    }
                  };
                });
              }
              if (user.datas.length) {
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

                let avatar = defaultAvatar;

                if (newData.avatar && !current_local_user.avatar) {
                  avatar = buildURL(createAPI(`files/${newData.avatar.value}`), {
                    w: 200,
                    h: 200
                  });
                }
                current_local_user.avatar = current_local_user.avatar ? current_local_user.avatar : avatar;
              }
              localEvent.setLocalItem('user_' + current_local_user.user_id, current_local_user);
              let db = window.TS_WEB.dataBase;
              let dataForBase = current_local_user;
              delete dataForBase.follower;
              delete dataForBase.following;
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
          })

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
  unFollowingUser,
  followingUser,
  getLocalDbUser,
  getLoggedUserInfo
};