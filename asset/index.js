// jQuery and Bootstrap-SASS
// -------------------------
// Questions: Why use CommonJS require?
// Answer: Because es6 module export lead to jquery plug-in can not run.
// -------------------------
// window.$ = window.jQuery = require('jquery');
// require('bootstrap-sass');

import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import VueWechatTitle from 'vue-wechat-title';
// import VueRouter from 'vue-router';
// import routers;
import router from './routers/index';
import App from './App.vue';

Vue.use(ElementUI);
Vue.use(VueWechatTitle);
const app = new Vue({
  router,
  el: '#app',
  render: h => h(App)
});

export { app, router };
