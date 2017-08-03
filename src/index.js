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
import { TabContainer, TabContainerItem, Loadmore, Popup, Picker } from 'mint-ui';
import storeLocal from 'store';

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
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);

// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

// 注册一个全局自定义指令 v-focus
Vue.directive('childfocus', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el) {
    // 聚焦元素
    el.firstChild.focus()
  }
})
Vue.prototype.$storeLocal = storeLocal;
const app = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});

export { app, router };
