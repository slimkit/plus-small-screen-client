import Vue from 'vue';
import store from './stores/store';
import router from './routers/index';
import VueLazyload from 'vue-lazyload';
import loading_img from './statics/images/image-loading.png';
import 'swiper/dist/css/swiper.css';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import UserAvatar from './components/user/UserAvatar';
// 统一message处理
import plusMessageBundle from 'plus-message-bundle';

Vue.use(VueAwesomeSwiper);

// 时区
import TimeAgo from 'vue-timeago';

// html title
import VueWechatTitle from 'vue-wechat-title';

// UI库
import 'mint-ui/lib/style.css';
import 'iview/dist/styles/iview.css';
import iView from 'iview';
import './styles/theme.less';
import { TabContainer, TabContainerItem, Loadmore, Popup, Picker } from 'mint-ui';

// 本地存储插件
import storeLocal from 'store';

// bus
import bus from './utils/bus';

import App from './App';

// bus
Vue.use(bus);

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

const components = [
  Popup,
  Picker,
  Loadmore,
  UserAvatar,
  TabContainer,
  TabContainerItem
];

components.map(component =>{
  Vue.component(component.name, component);
});

// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el) {
    // 聚焦元素
    el.focus();
  }
});

// 注册一个全局自定义指令 v-focus
Vue.directive('childfocus', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el) {
    // 聚焦元素
    el.firstChild.focus();
  }
});

// 定义 localStorage 组件
Vue.prototype.$storeLocal = storeLocal;
// 定义 plusMessageBundle组件
Vue.prototype.$MessageBundle = plusMessageBundle;

const app = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});

// iview 全局消息提示默认配置
app.$Message.config({top: 8, duration: 3});

export { app, router };
