import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// modules
import user from './module/user';
import notice from './module/noticeText';
import imageSwiper from './module/imageSwiper';
import showPost from './module/showPost';
import feedDiggsList from './module/feedDiggsList';
import userFeeds from './module/userFeeds';
import confirm from './module/confirm';
/**
 * new feeds source 
 */
import feedList from './module/feedList';
import followingIds from './module/followingIds';
import hotIds from './module/hotIds';
import newIds from './module/newIds';
import collectionIds from './module/collectionIds';

import commentInput from './module/commentInput';

const modules = {
  user,
  notice,
  imageSwiper,
  showPost,
  feedDiggsList,
  userFeeds,
  commentInput,
  confirm,
  feedList,
  followingIds,
  newIds,
  hotIds,
  collectionIds
}

const store = new Vuex.Store({
  modules
});

export default store;
