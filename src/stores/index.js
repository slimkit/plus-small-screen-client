import Vue from "vue";
import Vuex from "vuex";
import actions from "./action";
import getters from "./getters";
import mutations from "./mutations";

import { detectOS } from "@/util/";
import lstore from "@/plugins/lstore/";

import modules from "./module/";
// import EASEMOB from "./easemob/index.js";

Vue.use(Vuex);

const state = {
  loginStatus: lstore.hasData("H5_ACCESS_TOKEN"),

  CONFIG: lstore.getData("BOOTSTRAPPERS") || {},

  /* 终端信息 */
  BROWSER: detectOS(),

  /* 圈子分类 */
  GROUPTYPES: lstore.getData("GROUPTYPES") || [],

  /* 当前登录用户信息 */
  CURRENTUSER: lstore.getData("CURRENTUSER") || {},

  /* 当前选择的标签 临时数据 */
  CUR_SELECTED_TAGS: [],

  /* 当前圈子的位置信息 临时数据 */
  CUR_GROUP_LOCATION: {},

  //定位信息
  POSITION: lstore.getData("H5_CURRENT_POSITION") || {},

  /**
   * 用户信息
   */
  USERS: lstore.getData("H5_USERS") || {},

  GROUP_CATES: lstore.getData("H5_GROUP_CATES") || []
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules
  // modules: {
  //   ...modules,
  //   EASEMOB
  // }
});
