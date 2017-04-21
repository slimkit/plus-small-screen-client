import { FOLLOWINGIDS, ADDFOLLOWINGIDS } from '../types';

const state = {
  followingIds: []
};

const mutations = {
  [FOLLOWINGIDS] (state, ids) {
    state.followingIds = [ ...state.followingIds, ...ids ];
  },
  [ADDFOLLOWINGIDS] (state, ids) {
    state.followingIds = [ ...ids, ...state.followingIds ];
  }
};

const actions = {
  [FOLLOWINGIDS]: (context, cb) => {
    cb( ids => {
      context.commit(FOLLOWINGIDS, ids);
    })
  },
  [ADDFOLLOWINGIDS]: (context, cb) => {
    cb( ids => {
      context.commit(ADDFOLLOWINGIDS, ids);
    })
  }
};

const getters = {
  [FOLLOWINGIDS]: state => {
    return state.followingIds
  }
}

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;