import Vue from "vue";
import Vuex from "vuex";
import LocalEvent from "store";
import actions from "./action";
import getters from "./getters";
import mutations from "./mutations";
import { detectOS } from "../util/";
import http from "../http";

import modules from "./module/";

Vue.use(Vuex);

const state = {
  CONFIG: LocalEvent.get("BOOTSTRAPPERS") || {},
  /* 终端信息 */
  BROWSER: detectOS(),
  /* 当前动态 type */
  FEEDTYPE: "",
  /* 用户标签 */
  USERTAGS: LocalEvent.get("USERTAGS") || [],
  /* 圈子分类 */
  GROUPTYPES: LocalEvent.get("GROUPTYPES") || [],
  /* 当前登录用户信息 */
  CURRENTUSER: LocalEvent.get("CURRENTUSER") || {},

  /* 搜索历史 */
  SEARCHHISTORY: LocalEvent.get("SEARCHHISTORY") || [],

  /* 当前定位 */
  LOCATION: LocalEvent.get("LOCATION") || {},
  /* 热门城市 */
  HOTCTIYS: LocalEvent.get("HOTCTIYS") || [],
  /* 当前选择的标签 临时数据 */
  CUR_SELECTED_TAGS: [],
  /* 当前圈子的位置信息 临时数据 */
  CUR_GROUP_LOCATION: {}
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules
});
