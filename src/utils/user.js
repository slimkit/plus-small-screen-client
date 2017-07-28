import localEvent from '../stores/localStorage';
import {
  createAPI,
  addAccessToken,
  createOldAPI
} from '../utils/request';
import {
  app
} from '../index';
import errorCodes from '../stores/errorCodes';
import getImage from './getImage';
import lodash from 'lodash';
import buildURL from 'axios/lib/helpers/buildURL';
import { NOTICE, USERS_APPEND } from '../stores/types';
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
    addAccessToken().put(
        createAPI(`user/followings/${user_id}`), {},
        {
          validate: status => status === 204
        }
      )
      .then(response => {
        window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.relationship, () => {
          window.TS_WEB.dataBase.relationship.where("[uid+uuid]").equals([window.TS_WEB.currentUserId, user_id]).modify({
            following: 1
          });
        });
        resolve(response.status === 204 ? true : false);
      })
      .catch(error => {
        if(error.response.status === 401) {
          app.$store.dispatch(NOTICE, cb => {
            cb({
              text: '请先登录',
              time: 1500,
              status: true
            });
          });
          setTimeout(() => {
            app.$router.push('/login');
          }, 1500);
          return;
        }

        resolve(false);
      })
  })
};

function unFollowingUser(user_id) {
  return new Promise((resolve, reject) => {
    addAccessToken().delete(
        createAPI(`user/followings/${user_id}`), {}, {
          validate: status => status === 204
        }
      )
      .then(response => {
        window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.relationship, () => {
          window.TS_WEB.dataBase.relationship.where("[uid+uuid]").equals([window.TS_WEB.currentUserId, user_id]).modify({
            following: 0
          });
        });
        resolve(response.status === 204 ? true : false);
      })
      .catch(error => {
        if(error.response.status === 401) {
          app.$store.dispatch(NOTICE, cb => {
            cb({
              text: '请先登录',
              time: 1500,
              status: true
            });
          });
          setTimeout(() => {
            app.$router.push('/login');
          }, 1500);
          return;
        }
        resolve(false);
      });
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
        user.user_id = user.id;
        
        localEvent.setLocalItem('user_' + user.id, user);

        delete user.id;
        delete user.created_at;
        delete user.updated_at;
        app.$store.dispatch(USERS_APPEND, cb =>{
          cb(user)
        });
        // 删除旧用户，写入新用户
        db.transaction('rw?', db.userbase, () => {
            db.userbase.where('user_id').equals(parseInt(user.user_id)).delete().then(() => {
              db.userbase.put(
                user
              );
            });
          })
          .then()
          .catch(err => {
            console.log(err.stack || err);
          });
        user.avatar = user.avatar ? user.avatar : avatar;
        resolve(user);
      })
  })
}

function getUserInfo(user_id) {
  const db = window.TS_WEB.dataBase;
  return new Promise((resolve, reject) => {
    addAccessToken().get(createAPI(`users/${user_id}?following=${user_id}&follower=${user_id}`), {}, {
        validate: status => status === 200
      })
      .then(response => {
        let user = response.data;
        if (user.id !== TS_WEB.currentUserId) {
          // 关注和相互关注状态
          db.transaction('rw?', db.relationship, () => {
              db.relationship.where('[uid+uuid]').equals([window.TS_WEB.currentUserId, user.id]).delete().then(item => {
                db.relationship.put({
                  uid: window.TS_WEB.currentUserId,
                  uuid: user.id,
                  follower: user.follower,
                  following: user.following
                })
              });
            })
            .catch(e => {
            });
        }
        user.user_id = user.id;
        localEvent.setLocalItem('user_' + user_id, user);
        delete user.id;
        delete user.created_at;
        delete user.updated_at;
        app.$store.dispatch(USERS_APPEND, cb =>{
          cb(user)
        });
        // 删除旧用户，写入新用户
        db.transaction('rw?', db.userbase, () => {
          db.userbase.where('user_id').equals(parseInt(user.user_id)).delete().then(() => {
            db.userbase.put(
              user
            )
          });
        })
        .then( () => {

        })
        .catch(err => {
          console.log(err);
        });
        user.avatar = user.avatar ? user.avatar : defaultAvatar;

        resolve(user);
      })
  })
};

function getUsersInfo(user_ids, cb) {
  return new Promise((resolve, reject) => {
    let user_ids_need_to_request = [];
    let users = {};

    if (user_ids_need_to_request.length) {
      let user_str = user_ids_need_to_request.join(',');
      addAccessToken().get(createAPI(`users?user=${user_str}`), {}, {
          validate: status => status === 200
        })
        .then(({ data = [] } = {}) => {
          let users_service = data;
          users_service.forEach(user => {
            // 组装数据
            users_service.map((user) => {
              let current_local_user = {
                ...user
              };
              delete current_local_user.follower;
              delete current_local_user.following;
              delete current_local_user.updated_at;
              delete current_local_user.created_at;
              delete current_local_user.id;

              current_local_user.avatar = current_local_user.avatar || defaultAvatar;

              localEvent.setLocalItem('user_' + current_local_user.user_id, current_local_user);

              let db = window.TS_WEB.dataBase;
              let dataForBase = current_local_user;

              users[user.id] = current_local_user;
            });
          });

          resolve(users);
        });
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