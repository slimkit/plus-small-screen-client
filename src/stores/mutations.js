import lstore from "@/plugins/lstore/lstore.js";
export default {
  BOOTSTRAPPERS(state, config) {
    state.CONFIG = config;
    lstore.setData("BOOTSTRAPPERS", config);
  },

  SAVE_H5_POSITION(state, position) {
    state.POSITION = position;
    lstore.setData("H5_CURRENT_POSITION");
  },

  SAVE_FEED_TYPE(state, type) {
    state.FEEDTYPE = type;
  },
  // 保存当前登录用户信息
  SAVE_CURRENTUSER(state, info) {
    state.CURRENTUSER = info;
    lstore.setData("CURRENTUSER", state.CURRENTUSER);
  },

  // 保存圈子分类信息
  SAVE_GROUP_TYPES(state, list) {
    state.GROUPTYPES = list;
    lstore.setData("GROUPTYPES", state.GROUPTYPES);
  },

  // 保存用户标签数据
  SAVE_USER_TAGS(state, list) {
    state.USERTAGS = list;
    lstore.setData("USERTAGS", state.USERTAGS);
  },

  // 保存创建圈子时选择的位置 临时数据
  SAVE_GROUP_LOCATION(state, location) {
    state.CUR_GROUP_LOCATION = location;
  },

  // 保存用户搜索历史
  ADD_SEARCH_HISTORY(state, list) {
    const old = state.SEARCHHISTORY;
    state.SEARCHHISTORY = Array.from(new Set([list, ...old]));
    lstore.setData("SEARCHHISTORY", state.SEARCHHISTORY);
  },

  // 清空搜索历史
  CLEAN_SEARCH_HISTORY(state, data) {
    const index = state.SEARCHHISTORY.indexOf(data);
    if (data && index >= 0) {
      state.SEARCHHISTORY.splice(index, 1);
    } else {
      state.SEARCHHISTORY = [];
      lstore.removeData("SEARCHHISTORY");
    }
  },

  // 注销登录
  SIGN_OUT(state) {
    try {
      lstore.clearData();
      state.CURRENTUSER = null;
    } catch (e) {
      console.log(e);
    }
  }
};
