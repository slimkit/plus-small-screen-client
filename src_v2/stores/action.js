import http from '../http';
import getLocation from '../util/location';
import { _message } from '../plugins/messageToast';
export default {

    GET_FEED_TYPES({ commit }) {
        http.get('/plus-group/categories').then(({ data = [] }) => {
            commit('SAVE_GROUP_TYPES', data);
        })
    },

    GET_USER_TAGS({ commit }) {
        http.get('/tags', {
            validateStatus: status => status === 200,
        }).then(({ data = [] }) => {
            commit('SAVE_USER_TAGS', data);
        });
    },

    async GET_LOCATION({ commit }) {
        let location = await getLocation();
        const { addressComponent: { city, district, street = '' } = {} } = location;
        location.label = street.length > 5 ? `${street.slice(0, 2)}…${street.slice(-2)}` : street;

        commit("SAVE_LOCATION", location);
    }
}