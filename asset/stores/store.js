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
import feedsFollowing from './module/feedsFollowing';
import commentInput from './module/commentInput';

const modules = {
  user,
  notice,
  imageSwiper,
  showPost,
  feedDiggsList,
  userFeeds,
  feedsFollowing,
  commentInput
}

const store = new Vuex.Store({
  modules
});

export default store;
