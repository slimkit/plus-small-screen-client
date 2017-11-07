/**
 * User Actions
 * @author leex <JsonLeex@163.com>
 */
import _ from 'lodash';
import localEvent from 'store';
import { addAccessToken, createAPI } from '../../../utils/request';
export default {
    UPDATE_USER_INFO({ commit, dispatch, getters, state }, user) {
        commit('ADD_USER_TO_VUEX', user);
    },
    UPDATE_INFO_OF_MINE({ commit, dispatch, getters, state }, mine) {
        const old = state.mine;
        try {
            const id = mine.id;
            if(_.isEmpty(old) || _.isEmpty(mine) || id === old.id) {
                state.mine = Object.assign({}, old, mine);
                localEvent.set('mine', state.mine);
            }
            commit('ADD_USER_TO_VUEX', [mine]);
        } catch(e) {
            state.mine = old;
        }
    },
    LOGOUT({ commit, dispatch, getters, state }) {
        dispatch('UPDATE_INFO_OF_MINE', {});
    },
    async GET_USER_BY_ID({ commit, dispatch, getters, state }, ids) {
        if(_.isArray(ids)) {
            let _ids = [],
                users2 = [],
                users1 = ids.map(id => {
                    if(+id) {
                        let u = getters.getUserById(id);
                        if(u.length === 0) {
                            _ids = Array.from(new Set([..._ids, id]));
                        };
                        return u;

                    }
                });
            if(_ids.length > 0) {
                users2 = await addAccessToken().get(createAPI(`users?id=${_ids.join(',')}`), {
                    validateStatus: s => s === 200
                }).then(({ data = [] }) => {
                    commit('ADD_USER_TO_VUEX', data);
                    return data;
                }).catch(err => {
                    throw new Error('catch error at request `user?id=xxxx`');
                });
            }

            return [...users1, ...users2];
        } else if(+ids) {
            let u = getters.getUserById(ids);
            if(u.length === 0) {
                u = await addAccessToken().get(createAPI(`users?id=${+ids}`), {
                    validateStatus: s => s === 200
                }).then(({ data = [] }) => {
                    commit('ADD_USER_TO_VUEX', data);
                    return data;
                }).catch(err => {
                    throw new Error('catch error at request `user?id=xxxx`');
                });
            }
            return u;
        }
    }
};