import _ from 'lodash'

export default (users) => {
  let placeholder = ''
  let time = ''
  users = _.take(users, 3)
  users.map(user => {
    placeholder += `${user.user.name}、`
  })
  placeholder = _.trimEnd(placeholder, '、') + ' '
  time = users[0].time
  return {
    placeholder,
    time
  }
}
