import Api from "@/api/api.js";
import * as userApi from "@/api/user.js";

export default {
  async BOOTSTRAPPERS({ commit }) {
    const { data = {} } = await Api.get("/bootstrappers");
    commit("BOOTSTRAPPERS", data);
  },
  // 获取圈子分类数据
  GET_GROUP_TYPES({ commit }) {
    Api.get("/plus-group/categories").then(({ data = [] }) => {
      commit("SAVE_GROUP_TYPES", data);
    });
  },

  // 获取用户验证信息
  FETCH_USER_VERIFY({ commit }) {
    return userApi.getUserVerifyInfo().then(({ data = {} }) => {
      commit("SAVE_USER_VERIFY", data);
      return data;
    });
  },

  // 注销登录
  SIGN_OUT({ commit }) {
    try {
      Api.post(`/auth/logout`);
      commit("SIGN_OUT");
    } catch (e) {
      console.warn(e);
    }
  },
  async refreshCurUserData({ state, commit }) {
    const localUser = state.CURRENTUSER;
    if (localUser && localUser.token) {
      const {
        data: { access_token: token }
      } = await Api.post("/auth/refresh");
      localUser.token = token;
    }
    commit("SAVE_CURRENTUSER", localUser);
  }
};
