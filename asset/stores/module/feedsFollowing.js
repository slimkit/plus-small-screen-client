import { FEEDSFOLLOWING, FEEDSFOLLWOINGADD, FEEDFOLLOWINGUPDATE, FEEDFOLLOWINGPREPEND } from '../types';

const state = {
  feedsFollow: []
};

const mutations = {
  [FEEDSFOLLOWING] (state, feedFollow) {
    state.feedsFollow = feedFollow;
  },
  [FEEDSFOLLWOINGADD] (state, addFeed) {
    state.feedsFollow = [...state.feedsFollow, addFeed];
  },
  [FEEDFOLLOWINGUPDATE] (state, info) {
    state.feedsFollow[info.index] = info.newFeed;
  },
  [FEEDFOLLOWINGPREPEND] (state, newfeed) {
    state.feedsFollow = [newfeed, ...state.feedsFollow];
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
  },
  [FEEDFOLLOWINGPREPEND]: (context, cb) => {
    cb( newfeed => {
      context.commit(FEEDFOLLOWINGPREPEND, newfeed);
    })
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