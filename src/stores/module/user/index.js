import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";
import lstore from "@/plugins/lstore/";

const state = {
  users: lstore.getData("H5_USERS") || {}
};

export default {
  state,
  getters,
  actions,
  mutations
};
