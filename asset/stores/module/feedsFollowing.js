import { FEEDSFOLLOWING, FEEDSFOLLWOINGADD, FEEDFOLLOWINGUPDATE } from '../types';

const state = {
  feedsFollow: []
};

const mutations = {
  [FEEDSFOLLOWING] (state, feedFollow) {
    state.feedsFollow = feedFollow;
  },
  [FEEDSFOLLWOINGADD] (state, addFeed) {
    state.feedsFollow.push(addFeed);
  },
  [FEEDFOLLOWINGUPDATE] (state, info) {
    console.log(info);
    state.feedsFollow[info.index] = info.newFeed;
  }
};

const actions = {
  [FEEDSFOLLOWING]: (context, cb) => {
    cb( feedFollow => {
      context.commit(FEEDSFOLLOWING, feedFollow);
    });
  },
  [FEEDSFOLLWOINGADD]: (context, cb) => {
    cb( addFeed => {
      context.commit(FEEDSFOLLWOINGADD, addFeed);
    });
  },
  [FEEDFOLLOWINGUPDATE]: (context, cb) => {
    cb( info => {
      context.commit(FEEDFOLLOWINGUPDATE, info);
    });
  }
};

const getters = {
  [FEEDSFOLLOWING]: state => {
    return state.feedsFollow;
  }
};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;