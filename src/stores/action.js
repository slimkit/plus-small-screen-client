import http from "../http";
export default {
  async BOOTSTRAPPERS({ commit }) {
    const { data = {} } = await http.get("/bootstrappers");
    commit("BOOTSTRAPPERS", data);
  },
  // 获取圈子分类数据
  GET_GROUP_TYPES({ commit }) {
    http.get("/plus-group/categories").then(({ data = [] }) => {
      commit("SAVE_GROUP_TYPES", data);
    });
  },

  // 注销登录
  async SIGN_OUT({ commit }) {
    try {
      const { status } = await http.post("/auth/logout");
      if (status === 200) {
        commit("SIGN_OUT");
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
        "/auth/refresh"
      );
      localUser.token = token;
    }
    commit("SAVE_CURRENTUSER", localUser);
  }
};
