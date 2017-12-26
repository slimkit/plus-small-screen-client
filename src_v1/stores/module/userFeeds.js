import { USERFEEDS, APPENDUSERFEED, CLEANUSERFEEDS, PREPENDUSERFEED } from '../types';

const sort = function(a, b) {
  return b - a;
}

const state = {
  userFeeds: []
};

const mutations = {
  // 根据日期分组的动态列
  [USERFEEDS] (state, ids) {
    state.userFeeds = Array.from(new Set([ ...state.userFeeds, ...ids ]));
  },
  [APPENDUSERFEED] (state, id) {
    let userFeeds = [ ...state.userFeeds, id ]
    state.userFeeds = Array.from(new Set(userFeeds.sort(sort)));
  },
  [CLEANUSERFEEDS] (state) {
    state.userFeeds = [];
  },
  [PREPENDUSERFEED] (state, id) {
    state.userFeeds = Array.from(new Set([ feed, ...state.userFeeds ]));
  }
};

const actions = {
  [USERFEEDS]: (context, cb) => {
    cb( (ids) => {
      context.commit(USERFEEDS, ids);
    });
  },
  [APPENDUSERFEED]: (context, cb) => {
    cb( (id) => {
      context.commit(APPENDUSERFEED, id);
    });
  },
  [CLEANUSERFEEDS]: (context) => {
    context.commit(CLEANUSERFEEDS);
  },
  [PREPENDUSERFEED] : (context, cb) => {
    cb( id => {
      context.commit(PREPENDUSERFEED, id);
    })
  }
};

const getters = {
  [USERFEEDS]: state => {
    return state.userFeeds;
  }
};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;