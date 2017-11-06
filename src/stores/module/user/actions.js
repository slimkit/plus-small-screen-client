/**
 * User Actions
 * @author leex <JsonLeex@163.com>
 */
import _ from 'lodash';
import localEvent from 'store';
import { getUserByApi } from '../../../utils/user2';
export default {
    UPDATE_USER_INFO({ commit, dispatch, getters, state }, user) {
        commit('ADD_USER_TO_VUEX', user);
    },
    UPDATE_INFO_OF_MINE({ commit, dispatch, getters, state }, mine) {
        const old = state.mine;
        try {
            if(_.isEmpty(old)) {
                localEvent.set('mine', mine);
            } else {
                const id = mine.id;
                if(id === old.id) {
                    state.mine = Object.assign({}, old, mine);
                    localEvent.set('mine', state.mine);
                }
            }
            commit('ADD_USER_TO_VUEX', [mine]);
        } catch(e) {
            state.mine = old;
        }
    },
    LOGOUT({ commit, dispatch, getters, state }) {
        dispatch('UPDATE_INFO_OF_MINE', {});
    },
    GET_USER_BY_ID({ commit, dispatch, getters, state }, id) {
        let rs = state.users[`user_${id}`];
        if(!rs) {
            return dispatch('GET_USER_BY_API', id);
        }
        return rs;
    },
    GET_USER_BY_API({ commit, dispatch, getters, state }, id) {
        getUserByApi(id, (data) => {
            commit('ADD_USER_TO_VUEX', data);
            // dispatch('GET_USER_BY_ID', id);
        }, (err) => {
            console.log(err);
        });
    },
};