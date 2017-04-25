import { COLLECTIONIDS, ADDCOLLECTIONIDS } from '../types';

const state = {
  collectionIds: []
};

const mutations = {
  [COLLECTIONIDS] (state, ids) {
    state.collectionIds = [ ...state.collectionIds, ...ids ];
  },
  [ADDCOLLECTIONIDS] (state, ids) {
    state.collectionIds = [ ...ids, ...state.collectionIds ];
  }
};

const actions = {
  [COLLECTIONIDS]: (context, cb) => {
    cb( ids => {
      context.commit(COLLECTIONIDS, ids);
    })
  },
  [ADDCOLLECTIONIDS]: (context, cb) => {
    cb( ids => {
      context.commit(ADDCOLLECTIONIDS, ids);
    })
  }
};

const getters = {
  [COLLECTIONIDS]: state => {
    return state.collectionIds
  }
}

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;