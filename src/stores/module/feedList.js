import { FEEDSLIST, UPDATEFEED, FOLLOWINGFEEDS, HOTFEEDS, NEWFEEDS, FOLLOWINGIDS, HOTIDS, NEWIDS, USERFEEDS, GETUSERFEEDS, COLLECTIONFEEDS, COLLECTIONIDS } from '../types';

const state = {
  feedList: {}
};

const mutations = {
  [FEEDSLIST] (state, feedlist) {
    state.feedList = { ...state.feedList, ...feedlist };
  },
  [UPDATEFEED] (state, feed) {
    state.feedList[feed.feed.feed_id] = { ...state.feedList[feed.feed.feed_id], ...feed };
  }
};

const actions = {
  [FEEDSLIST]: (context, cb) => {
    cb( feedlist => {
      context.commit(FEEDSLIST, feedlist);
    })
  },
  [UPDATEFEED]: (context, cb) => {
    cb (feed => {
      context.commit(UPDATEFEED, feed);
    })
  }
};

const getters = {
  [FEEDSLIST]: state => {
    return state.feedList;
  },
  [FOLLOWINGFEEDS]: (state, getters) => {
    let followingFeeds = [];
    let followingIds = getters[FOLLOWINGIDS];
    followingIds.forEach( id => {
      followingFeeds.push(state.feedList[id]);
    });
    return followingFeeds;
  },
  [HOTFEEDS]: (state, getters) => {
    let hotFeeds = [];
    let hotIds = getters[HOTIDS];
    hotIds.forEach( id => {
      hotFeeds.push(state.feedList[id]);
    });
    return hotFeeds;
  },
  [NEWFEEDS]: (state, getters) => {
    let newFeeds = [];
    let newIds = getters[NEWIDS];
    newIds.forEach( id => {
      newFeeds.push(state.feedList[id]);
    });
    return newFeeds;
  },
  [GETUSERFEEDS]: (state, getters) => {
    let userFeeds = [];
    let userIds = getters[USERFEEDS];
    userIds.forEach( id => {
      userFeeds.push(state.feedList[id]);
    });
    return userFeeds;
  },
  [COLLECTIONFEEDS]: (state, getters) => {
    let collectionFeeds = [];
    let collectionIds = getters[COLLECTIONIDS];
    collectionIds.forEach( id => {
      collectionFeeds.push(state.feedList[id]);
    });
    return collectionFeeds;
  }
};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;