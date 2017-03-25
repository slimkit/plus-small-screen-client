import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// modules
import user from './module/user';
import notice from './module/noticeText';
import imageSwiper from './module/imageSwiper';

const modules = {
  user,
  notice,
  imageSwiper
}

const store = new Vuex.Store({
  modules
});

export default store;
