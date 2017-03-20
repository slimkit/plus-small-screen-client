import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// modules
import user from './module/user';
import notice from './module/noticeText';
const modules = {
  user,
  notice
}

const store = new Vuex.Store({
  modules
});

export default store;
