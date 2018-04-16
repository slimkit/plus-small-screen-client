export default {
  getUserById: ({ users }) => id => {
    let user = users[`user_${id}`] || {};
    return user;
  }
};
