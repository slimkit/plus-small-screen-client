// jQuery and Bootstrap-SASS
// -------------------------
// Questions: Why use CommonJS require?
// Answer: Because es6 module export lead to jquery plug-in can not run.
// -------------------------
// window.$ = window.jQuery = require('jquery');
// require('bootstrap-sass');

import Vue from 'vue';
import VueWechatTitle from 'vue-wechat-title';
import TimeAgo from 'vue-timeago';
import router from './routers/index';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
// import VueLazyloadImg from 'vue-lazyload-img';
import store from './stores/store';
import App from './App';

Vue.use(iView);
Vue.use(VueWechatTitle);
// Vue.use(VueLazyloadImg, {
//   fade: true,
//   nohori: true,
//   speed: 20
// });
Vue.use(TimeAgo, {
  name: 'timeago',
  locale: 'zh-CN',
  locales: {
    'zh-CN': require('vue-timeago/locales/zh-CN.json')
  }
})
const app = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});

export { app, router };
