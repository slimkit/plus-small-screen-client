/** 
 * store for user list;
 */

import _ from 'lodash';
import { addAccessToken, createAPI } from '../../utils/request';
import { USERS, USERS_APPEND, USERS_ITEM_UPDATE, GET_USER_BY_ID, GET_SINGLE_USER } from '../types';

const state = {
    users: {}
};

const mutations = {
    // 增加单个用户
    [USERS_APPEND](state, user) {
        const users = { ...state.users, [`user_${user.id}`]: user };
        state.users = users;
    },
    // 修改单个用户信息
    [USERS_ITEM_UPDATE](state, user) {
        let {
            [user.id]: oldUser = {}
        } = state.users;
        state.users[`user_${user.id}`] = { ...oldUser, ...user };
    },
    // 批量增加用户信息
    [USERS](state, users) {
        const new_users = { ...state.users, ...users };
        state.users = new_users;
    },
};

const actions = {
    // 异步增加单个用户
    [USERS_APPEND]: (context, cb) => {
        cb((user) => {
            context.commit(USERS_APPEND, user);
        });
    },
    // 批量异步增加用户
    [USERS]: (context, cb) => {
        cb(users => {
            context.commit(USERS, users);
        })
    },

    async [GET_SINGLE_USER]({ dispatch, commit, state }, id) {
        let user = _.filter(state.users, (u) => u.id === id);
        if(user.length === 0) {
            let user = await addAccessToken().get(createAPI(`users/${id}`)).then(({data}) => {
                commit(USERS_APPEND, data);
                return data;
            }).catch(err => {
                console.log(err);
            });

            return user;
        }
        return user;
    },

    async [GET_USER_BY_ID]({ dispatch, commit, state }, id) {
        if(_.isNumber(id)) {
            const cache = await dispatch(GET_SINGLE_USER, id);
            return cache;
        } else if(_.isArray(id)) {
            console.log('批量获取用户');
        }
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