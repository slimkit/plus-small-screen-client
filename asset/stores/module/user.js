/** 
  store for user list;

*/
import { USERS, USERS_APPEND, USERS_ITEM_UPDATE } from '../types';

const state = {
  users: {}
};

const mutations = {
  // 增加单个用户
  [USERS_APPEND] (state, user) {
    const users = { ...state.users, [user.user_id]: user };
    state.users = users;
  },
  // 修改单个用户信息
  [USERS_ITEM_UPDATE] (state, user) {
    let { [user.user_id]: oldUser = {} } = state.users;
    state.users[user.user_id] = { ...oldUser, ...user };
  },
  // 批量增加用户信息
  [USERS] (state, users) {
    const new_users = { ...state.users, ...users };
    state.users = new_users;
  }
};

const actions = {
  // 异步增加单个用户
  [USERS_APPEND]: (context, cb) => {
    cb( (user) => {
      context.commit(USERS_APPEND, user);
    });
  },
  // 批量异步增加用户
  [USERS]: (context, cb) => {
    cb( users => {
      context.commit(USERS, users);
    })
  }
};

const getters = {
  // 返回所有用户
  [USERS]: (state) => state.users
};

const store = {
  state,
  mutations,
  actions,
  getters
}

export default store;