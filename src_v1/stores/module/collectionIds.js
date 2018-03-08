import { COLLECTIONFEEDSIDS, ADDCOLLECTIONFEEDSIDS, UNCOLLECTIONFEEDSID } from '../types';

const state = {
  collectionFeedsIds: []
};

const mutations = {
  [COLLECTIONFEEDSIDS] (state, ids) {
    state.collectionFeedsIds = Array.from(new Set([ ...state.collectionFeedsIds, ...ids ]));
  },
  [ADDCOLLECTIONFEEDSIDS] (state, ids) {
    state.collectionFeedsIds = Array.from(new Set([ ...ids, ...state.collectionFeedsIds ]));
  },
  [UNCOLLECTIONFEEDSID] (state, id) {
    let collectionFeedsIds = state.collectionFeedsIds;
    collectionFeedsIds.splice(collectionFeedsIds.indexOf(id), 1);
    state.collectionFeedsIds = Array.from(new Set(collectionFeedsIds));
  }
};

const actions = {
  [COLLECTIONFEEDSIDS]: (context, cb) => {
    cb( ids => {
      context.commit(COLLECTIONFEEDSIDS, ids);
    })
  },
  [ADDCOLLECTIONFEEDSIDS]: (context, cb) => {
    cb( ids => {
      context.commit(ADDCOLLECTIONFEEDSIDS, ids);
    })
  },
  [UNCOLLECTIONFEEDSID]: (context, cb) => {
    cb ( id => {
      context.commit(UNCOLLECTIONFEEDSID, id);
    })
  }
};

const getters = {
  [COLLECTIONFEEDSIDS]: state => {
    return state.collectionFeedsIds
  }
}

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;