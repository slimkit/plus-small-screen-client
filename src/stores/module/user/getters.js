import _ from 'lodash';
export default {
    getUserById: ({ users }) => (id) => {
        return _.filter(users, _.conforms({ id: (_id) => _id === id }));
    },
};