import Vue from 'vue';
import store from './stores/';
import router from './routers/';
import directives from './directives/';
import Modal from './plugins/modal/';
import imgLazy from './plugins/imgLazy';
import Message from './plugins/message/';
import imgCropper from './plugins/imgCropper';
import _ from 'lodash';
import './util/rem';
import 'github-markdown-css';

/* h5 调试 */
import './style/index.less';
// Filters
import * as filters from './filters';
/** Ajax */
import Ajax from './http';

/** common components */
import vIcon from './components/common/vIcons'; /* Icons */
import btnSwitch from './components/common/btnSwitch'; /* btnSwitch 按钮 */
import badge from './components/common/badge'; /* Badge 徽标 */
import fullSpin from './components/FullSpin'; /* 全屏加载动画 */
import userAvatar from './components/VAvatar'; /* Avatar 用户头像组件 */
import loadMore from './components/loadMore';
import HeadTop from './components/HeadTop';
import FootGuide from './components/FootGuide';
import DiySelect from './components/DiySelect';

const components = [
  vIcon,
  btnSwitch,
  badge,
  userAvatar,
  loadMore,
  fullSpin,
  HeadTop,
  FootGuide,
  DiySelect
];

components.forEach(component => {
  Vue.component(component.name, component);
});

Vue.config.productionTip = false;

Vue.prototype.$http = Ajax; /* Ajax */
Vue.prototype.$Modal = Modal;
Vue.prototype.$Message = Message;
Vue.prototype.$MessageBundle = filters.plusMessageFirst;

Vue.use(imgLazy); /* 图片懒加载 */
Vue.use(imgCropper); /* 图片裁剪 */
Vue.config.productionTip = false;

for (const k in filters) {
  Vue.filter(k, filters[k]);
}
// 自定义指令
for (const k in directives) {
  Vue.directive(k, directives[k]);
}

Vue.mixin({
  methods: {
    uniqById(target = [], source = []) {
      return _.unionBy([...target, ...source], 'id');
    }
  }
});

/* eslint-disable no-new */
new Vue({
  store,
  router
}).$mount('#app');
