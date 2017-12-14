import LocalEvent from 'store';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
const state = {
    users: LocalEvent.get('USERS') || {}
}

export default {
    state,
    getters,
    actions,
    mutations,
}