import http from '@/http'
export default {
  GET_USER_DATA({ commit }, {
    type,
    limit = 15,
    offset = 0
  }) {
    let uri

    switch (type) {
      case 'pop':
        uri = '/user/populars'
        break
      case 'new':
        uri = '/user/latests'
        break
      case 'rec':
        uri = '/user/find-by-tags'
        break
    }
    return new Promise((resolve, reject) => {
      let res = {
        noMore: false,
        data: []
      }
      http.get(`${uri}?limit=${limit}&offset=${offset}`).then(({ data = [] }) => {
        if (data.length > 0) {
          res.data = data
          res.noMore = data.length < limit
          commit('SAVE_USER', data)
        }
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  FOLLOW_USER({ commit }, { id, status }) {
    // PUT /user/followings/:user
    // DELETE /user/followings/:user
    let method

    switch (status) {
      case 'unFollow':
        method = 'PUT'
        break
      case 'eachFollow':
        method = 'DELETE'
        break
      case 'follow':
        method = 'DELETE'
        break
    }

    if (!method) return false

    let url = `/user/followings/${id}`

    const res = {
      status: true,
      follower: method === 'PUT'
    }

    return new Promise((resolve, reject) => {
      http({
        method,
        url,
        validateStatus: s => s === 204
      }).then(() => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
