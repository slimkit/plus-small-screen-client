import { FEEDSHOT, FEEDSHOTADD, FEEDHOTUPDATE, FEEDHOTPREPEND } from '../types';

const state = {
  feedsHot: []
};

const mutations = {
  [FEEDSHOT] (state, feedHot) {
    state.feedsHot = feedHot;
  },
  [FEEDSHOTADD] (state, addFeed) {
    state.feedHot = [...state.feedHot, addFeed];
  },
  [FEEDHOTUPDATE] (state, info) {
    state.feedsHot[info.index] = info.newFeed;
  },
  [FEEDHOTPREPEND] (state, newfeed) {
    state.feedHot = [newfeed, ...state.feedHot];
  }
};

const actions = {
  [FEEDSHOT]: (context, cb) => {
    cb( feedHot => {
      context.commit(FEEDSHOT, feedHot);
    });
  },
  [FEEDSHOTADD]: (context, cb) => {
    cb( addFeed => {
      context.commit(FEEDSHOTADD, addFeed);
    });
  },
  [FEEDHOTUPDATE]: (context, cb) => {
    cb( info => {
      context.commit(FEEDHOTUPDATE, info);
    });
  },
  [FEEDHOTPREPEND]: (context, cb) => {
    cb( newfeed => {
      context.commit(FEEDHOTPREPEND, newfeed);
    })
  }
};

const getters = {
  [FEEDSHOT]: state => {
    return state.feedsHot;
  }
};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;