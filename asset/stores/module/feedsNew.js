import { FEEDSNEW, FEEDSNEWADD, FEEDNEWUPDATE, FEEDNEWPREPEND } from '../types';

const state = {
  feedsNew: []
};

const mutations = {
  [FEEDSNEW] (state, feedNew) {
    state.feedsNew = feedNew;
  },
  [FEEDSNEWADD] (state, addFeed) {
    state.feedsNew = [...state.feedsNew, addFeed];
  },
  [FEEDNEWUPDATE] (state, info) {
    state.feedsNew[info.index] = info.newFeed;
  },
  [FEEDNEWPREPEND] (state, newfeed) {
    state.feedsNew = [newfeed, ...state.feedsNew];
  }
};

const actions = {
  [FEEDSNEW]: (context, cb) => {
    cb( feedNew => {
      context.commit(FEEDSNEW, feedNew);
    });
  },
  [FEEDSNEWADD]: (context, cb) => {
    cb( addFeed => {
      context.commit(FEEDSNEWADD, addFeed);
    });
  },
  [FEEDNEWUPDATE]: (context, cb) => {
    cb( info => {
      context.commit(FEEDNEWUPDATE, info);
    });
  },
  [FEEDNEWPREPEND]: (context, cb) => {
    cb( newfeed => {
      context.commit(FEEDNEWPREPEND, newfeed);
    })
  }
};

const getters = {
  [FEEDSNEW]: state => {
    return state.feedsNew;
  }
};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;