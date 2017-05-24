import { COLLECTIONIDS, ADDCOLLECTIONIDS, UNCOLLECTIONID } from '../types';

const state = {
  collectionIds: []
};

const mutations = {
  [COLLECTIONIDS] (state, ids) {
    state.collectionIds = Array.from(new Set([ ...state.collectionIds, ...ids ]));
  },
  [ADDCOLLECTIONIDS] (state, ids) {
    state.collectionIds = Array.from(new Set([ ...ids, ...state.collectionIds ]));
  },
  [UNCOLLECTIONID] (state, id) {
    let collectionIds = state.collectionIds;
    collectionIds.splice(collectionIds.indexOf(id), 1);
    state.collectionIds = Array.from(new Set(collectionIds));
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
  },
  [UNCOLLECTIONID]: (context, cb) => {
    cb ( id => {
      context.commit(UNCOLLECTIONID, id);
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