import { NEWIDS, ADDNEWIDS } from '../types';

const sort = function(a, b) {
  return b - a;
}

const state = {
  newIds: []
};

const mutations = {
  [NEWIDS] (state, ids) {
    state.newIds = Array.from(new Set([ ...state.newIds, ...ids ]));
  },
  [ADDNEWIDS] (state, ids) {
    state.newIds = Array.from(new Set([ ...ids, ...state.newIds ])).sort(sort);
  }
};

const actions = {
  [NEWIDS]: (context, cb) => {
    cb( ids => {
      context.commit(NEWIDS, ids);
    })
  },
  [ADDNEWIDS]: (context, cb) => {
    cb( ids => {
      context.commit(ADDNEWIDS, ids);
    })
  }
};

const getters = {
  [NEWIDS]: state => {
    return state.newIds
  }
}

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;