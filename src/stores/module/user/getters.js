// import _ from 'lodash'
// import http from '@/http'
export default {
  getUserById: ({ users }) => (id) => {
    let user = users[`user_${id}`] || {}
    // 将关注状态重置
    // 避免多个账号之间数据交叉
    user.follower = false
    user.following = false

    return user
  }
}
