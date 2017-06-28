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
import imMessage from './module/imMessage';
import imStatus from './module/imStatus';
import messageCount from './module/messageNotice';
import commentInput from './module/commentInput';

/**
 * news about
 */
import newsAbout from './module/newsAbout';
import collectionNews from './module/collectionNews';

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
  collectionIds,
  imMessage,
  imStatus,
  messageCount,
  newsAbout,
  collectionNews
}

const store = new Vuex.Store({
  modules
});

export default store;
