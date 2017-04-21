import { NEWIDS, ADDNEWIDS } from '../types';

const state = {
  newIds: []
};

const mutations = {
  [NEWIDS] (state, ids) {
    state.newIds = [ ...state.newIds, ...ids ];
  },
  [ADDNEWIDS] (state, ids) {
    state.newIds = [ ...ids, ...state.newIds ];
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