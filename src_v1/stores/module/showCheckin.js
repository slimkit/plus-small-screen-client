import { SHOWCHECKIN } from '../types';

const state ={
  showCheckin: {
    show: false,
  }
};

const mutations = {
  [SHOWCHECKIN] (state, show) {
    state.showCheckin = { ...state.showCheckin, ...{ show }};
  }
};

const actions = {
  [SHOWCHECKIN] (context, cb) {
    cb ( (show) => {
      context.commit(SHOWCHECKIN, show);
    })
  }
};

const getters = {

};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;