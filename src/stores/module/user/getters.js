import { getUserByApi } from '../../../utils/user2';
export default {
    getUserById: (state) => (id) => {
        let rs = state.users[`user_${id}`];
        return rs;
    },
};