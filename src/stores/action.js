import http from '../http';
import getLocation from '../util/location';
export default {
  // 获取圈子分类数据
  GET_GROUP_TYPES({ commit }) {
    http.get('/plus-group/categories').then(({ data = [] }) => {
      commit('SAVE_GROUP_TYPES', data);
    });
  },

  GET_USER_TAGS({ commit }) {
    http
      .get('/tags', {
        validateStatus: status => status === 200
      })
      .then(({ data = [] }) => {
        commit('SAVE_USER_TAGS', data);
      });
  },

  async GET_LOCATION({ commit }) {
    let location = await getLocation();
    const {
      addressComponent: { city = '', district = '', street = '' } = {},
      position: { lng = 0, lat = 0 }
    } = location;

    commit('SAVE_LOCATION', {
      label: street || district || city,
      lng,
      lat
    });
  },

  UPDATE_LOCATION({ commit, dispatch }) {
    commit('SAVE_LOCATION', {});
    dispatch('GET_LOCATION');
  },

  GET_HOT_CITYS({ commit }) {
    http.get('/locations/hots').then(({ data = [] }) => {
      commit('SAVE_HOT_CITYS', data);
    });
  },
  // 注销登录
  async SIGN_OUT({ state, commit }) {
    try {
      const { status } = await http.post('/auth/logout');
      if (status === 200) {
        commit('SIGN_OUT');
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async refreshCurUserData({ state, commit }) {
    const localUser = state.CURRENTUSER;
    if (localUser && localUser.token) {
      const { data: { access_token: token } } = await http.post(
        '/auth/refresh'
      );
      localUser.token = token;
    }
    commit('SAVE_CURRENTUSER', localUser);
  }
};
