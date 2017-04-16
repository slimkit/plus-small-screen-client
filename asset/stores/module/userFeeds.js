import { USERFEEDS, APPENDUSERFEED, CLEANUSERFEEDS, DATES } from '../types';

const state = {
  userFeeds: []
};

const mutations = {
  // 根据日期分组的动态列
  [USERFEEDS] (state, feeds) {
    state.userFeeds = feeds;
  },
  [APPENDUSERFEED] (state, addedFeed) {
    state.userFeeds.push(addedFeed);
  },
  [CLEANUSERFEEDS] (state) {
    state.userFeeds = state.dates = {};
  }
};

const actions = {
  [USERFEEDS]: (context, cb) => {
    cb( (feeds) => {
      context.commit(USERFEEDS, feeds);
    });
  },
  [APPENDUSERFEED]: (context, cb) => {
    cb( (addedFeed) => {
      context.commit(APPENDUSERFEEDS, addedFeed);
    });
  },
  [CLEANUSERFEEDS]: (context, cb) => {
    cb(() => {
      context.commit(CLEANUSERFEEDS);
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