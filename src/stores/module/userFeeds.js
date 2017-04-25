import { USERFEEDS, APPENDUSERFEED, CLEANUSERFEEDS, DATES, PREPENDUSERFEED } from '../types';

const state = {
  userFeeds: []
};

const mutations = {
  // 根据日期分组的动态列
  [USERFEEDS] (state, ids) {
    state.userFeeds = [ ...state.userFeeds, ...ids ];
  },
  [APPENDUSERFEED] (state, id) {
    state.userFeeds = [ ...state.userFeeds, id ];
  },
  [CLEANUSERFEEDS] (state) {
    state.userFeeds = [];
  },
  [PREPENDUSERFEED] (state, id) {
    state.userFeeds = [ feed, ...state.userFeeds ];
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