import Vue from 'vue';
import VueWechatTitle from 'vue-wechat-title';
import TimeAgo from 'vue-timeago';
import router from './routers/index';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VueLazyload from 'vue-lazyload';
import store from './stores/store';
import App from './App';
import 'mint-ui/lib/style.css'
import loading_img from './statics/images/image-loading.png';
import { Loadmore } from 'mint-ui';
import { Popup } from 'mint-ui';
import { Picker } from 'mint-ui';

// iview ui
Vue.use(iView);

// html title
Vue.use(VueWechatTitle);

// lazyload for images
Vue.use(VueLazyload, {
  loading: loading_img,
  try: 3
});

// timeago component
Vue.use(TimeAgo, {
  name: 'timeago',
  locale: 'zh-CN',
  locales: {
    'zh-CN': require('vue-timeago/locales/zh-CN.json')
  }
});
// mint ui组件的3个块
Vue.component(Loadmore.name, Loadmore);
Vue.component(Popup.name, Popup);
Vue.component(Picker.name, Picker);

const app = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});

export { app, router };
