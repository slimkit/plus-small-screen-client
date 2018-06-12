import Api from "@/api/api.js";
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

  // 注销登录
  SIGN_OUT({ commit }) {
    try {
      Api.post(`/auth/logout`);
      commit("SIGN_OUT");
    } catch (e) {
      console.log(e);
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
