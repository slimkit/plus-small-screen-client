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
import { NOTICE, USERS_APPEND, USERS } from '../stores/types';
import {
  resolveImage
} from './resource';
const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));

function followingUser(user_id, cb) {
  return new Promise((resolve, reject) => {
    addAccessToken().put(
        createAPI(`user/followings/${user_id}`), {},
        {
          validate: status => status === 204
        }
      )
      .then(response => {
        resolve(true);
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
        resolve(true);
      })
      .catch(error => {
        if(error.response.status === 401) {
          app.$store.dispatch(NOTICE, cb => {
            cb({
              text: '请先登录',
              time: 1500,
              status: false
            });
          });
          setTimeout(() => {
            app.$router.push('/login');
          }, 1500);
          return;
        } else {
          app.$store.dispatch(NOTICE, cb => {
            cb({
              text: '操作失败',
              time: 1500,
              status: false
            });
          });
        }
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

        delete user.follower;
        delete user.following;

        app.$storeLocal.set(`user_${user.user_id}`, user);

        user.avatar = user.avatar ? user.avatar : defaultAvatar;
        app.$store.dispatch(USERS_APPEND, cb =>{
          cb(user)
        });

        resolve(user);
      })
  })
}

function getUserInfo(user_id) {
  return new Promise((resolve, reject) => {
    const currentUserId = TS_WEB.currentUserId;
    addAccessToken().get(createAPI(`users/${user_id}?following=${currentUserId}&follower=${currentUserId}`), {}, {
        validate: status => status === 200
      })
      .then(response => {
        let user = response.data;

        user.user_id = user.id;
          
        app.$storeLocal.set(`user_${user.user_id}`, user);

        user.avatar = user.avatar || defaultAvatar;
        app.$store.dispatch(USERS_APPEND, cb =>{
          cb(user)
        });

        resolve(user);
      })
  })
};

function getUsersInfo(user_ids) {
  return new Promise((resolve, reject) => {
    let user_ids_need_to_request = [...user_ids];
    let users = {};

    if (user_ids_need_to_request.length) {
      let user_str = user_ids_need_to_request.join(',');
      addAccessToken().get(createAPI(`users?id=${user_str}`), {}, {
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
              current_local_user.user_id = user.id;

              delete current_local_user.follower;
              delete current_local_user.following;
              
              app.$storeLocal.set(`user_${current_local_user.user_id}`, current_local_user);

              user.avatar = user.avatar || defaultAvatar;
              users[user.id] = user;

            });
          });
          app.$store.dispatch(USERS, cb => {
            cb(users);
          })
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
  getLoggedUserInfo
};