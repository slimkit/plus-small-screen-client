import Vue from "vue";
import Vuex from "vuex";
import actions from "./action";
import getters from "./getters";
import mutations from "./mutations";

import { detectOS } from "@/util/";
import lstore from "@/plugins/lstore/";

import modules from "./module/";

Vue.use(Vuex);

const state = {
  CONFIG: lstore.getData("BOOTSTRAPPERS") || {},
  /* 终端信息 */
  BROWSER: detectOS(),
  /* 用户标签 */
  USERTAGS: lstore.getData("USERTAGS") || [],
  /* 圈子分类 */
  GROUPTYPES: lstore.getData("GROUPTYPES") || [],
  /* 当前登录用户信息 */
  CURRENTUSER: lstore.getData("CURRENTUSER") || {},
  /* 搜索历史 */
  SEARCHHISTORY: lstore.getData("SEARCHHISTORY") || [],
  /* 当前选择的标签 临时数据 */
  CUR_SELECTED_TAGS: [],
  /* 当前圈子的位置信息 临时数据 */
  CUR_GROUP_LOCATION: {},

  //定位信息
  POSITION: lstore.getData("H5_CURRENT_POSITION") || {},

  /**
   * 用户信息
   */
  USERS: lstore.getData("H5_USERS") || {}
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules
});
