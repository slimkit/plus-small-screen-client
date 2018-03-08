/**
 * User mutations
 * @author leex <JsonLeex@163.com>
 */

import _ from 'lodash';
import localEvent from 'store';

export default {
    ADD_USER_TO_VUEX(state, user) {
        const old = state.users;
        try {
            if(!_.isEmpty(user)) {
                let _new = {};
                if(_.isArrayLikeObject(user)) {
                    _new = _.keyBy(user, (u) => (`user_${u.id}`));
                } else if(_.isPlainObject(user)) {
                    _new[`user_${user.id}`] = user;
                }
                state.users = Object.assign({}, old, _new);
                localEvent.set('users', state.users);
            }
        } catch(e) {
            state.users = old;
        }
    },
};