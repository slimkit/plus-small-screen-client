import {
  FEEDSLIST,
  UPDATEFEED,
  FOLLOWINGFEEDS,
  HOTFEEDS,
  NEWFEEDS,
  FOLLOWINGIDS,
  HOTIDS,
  NEWIDS,
  USERFEEDS,
  GETUSERFEEDS,
  COLLECTIONFEEDS,
  COLLECTIONFEEDSIDS,
  DELETEFEED
} from '../types';

const state = {
  feedList: {}
};

const mutations = {
  [FEEDSLIST](state, feedlist) {
    state.feedList = {...state.feedList,
      ...feedlist
    };
  },
  [UPDATEFEED](state, feed) {
    state.feedList[feed.id] = {...state.feedList[feed.id],
      ...feed
    };
  }
};

const actions = {
  [FEEDSLIST]: (context, cb) => {
    cb(feedlist => {
      context.commit(FEEDSLIST, feedlist);
    })
  },
  [UPDATEFEED]: (context, cb) => {
    cb(feed => {
      context.commit(UPDATEFEED, feed);
    })
  }
};

const getters = {
  [FEEDSLIST]: state => {
    return state.feedList;
  },
  /** 关注的动态 */
  [FOLLOWINGFEEDS]: (state, getters) => {
    let followingFeeds = [];
    let followingIds = getters[FOLLOWINGIDS];
    followingIds.forEach(id => {
      followingFeeds.push(state.feedList[id]);
    });
    return followingFeeds;
  },
  /** 热门动态 */
  [HOTFEEDS]: (state, getters) => {
    let hotFeeds = [];
    let hotIds = getters[HOTIDS];
    hotIds.forEach(id => {
      hotFeeds.push(state.feedList[id]);
    });
    return hotFeeds;
  },
  /** 最新动态 */
  [NEWFEEDS]: (state, getters) => {
    let newFeeds = [];
    let newIds = getters[NEWIDS];
    newIds.forEach(id => {
      newFeeds.push(state.feedList[id]);
    });
    return newFeeds;
  },
  /** 收藏的动态 */
  [GETUSERFEEDS]: (state, getters) => {
    let userFeeds = [];
    let userIds = getters[USERFEEDS];
    userIds.forEach(id => {
      userFeeds.push(state.feedList[id]);
    });
    return userFeeds;
  },
  [COLLECTIONFEEDS]: (state, getters) => {
    let collectionFeeds = [];
    let collectionIds = getters[COLLECTIONFEEDSIDS];
    collectionIds.forEach(id => {
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