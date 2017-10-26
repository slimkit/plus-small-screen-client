import { SHOWPREPOST } from '../types';

const state = {
  prePost: {
    show: false
  }
};

const mutations = {
  [SHOWPREPOST] (state, show) {
    state.prePost = { ...state.prePost, ...{ show } };
  }
};

const actions = {
  [SHOWPREPOST] (context, cb) {
    cb ( show => {
      context.commit(SHOWPREPOST, show);
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