import { HOTIDS, ADDHOTIDS } from '../types';

const state = {
  hotIds: []
};

const mutations = {
  [HOTIDS] (state, ids) {
    state.hotIds = Array.from(new Set([ ...state.hotIds, ...ids ]));
  },
  [ADDHOTIDS] (state, ids) {
    state.hotIds = Array.from(new Set([ ...ids, ...state.hotIds ]));
  }
};

const actions = {
  [HOTIDS]: (context, cb) => {
    cb( ids => {
      context.commit(HOTIDS, ids);
    })
  },
  [ADDHOTIDS]: (context, cb) => {
    cb( ids => {
      context.commit(ADDHOTIDS, ids);
    })
  }
};

const getters = {
  [HOTIDS]: state => {
    return state.hotIds
  }
}

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;