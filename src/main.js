import "./style/tsplus.less";
import "github-markdown-css";
import Vue from "vue";
import "./util/rem";

import Modal from "./plugins/modal/";
// import imgLazy from "./plugins/imgLazy";
import Message from "./plugins/message/";
import AsyncImage from "./components/FeedCard/v-async-image.js"; // 存在循环依赖

import imgCropper from "@/plugins/imgCropper";
// import Toast from "@/plugins/toast/index.js";
import lstore from "@/plugins/lstore/index.js";

import Ajax from "./http"; // 存在循环依赖
import mixin from "./mixin.js";
import * as filters from "./filters.js"; // 存在循环依赖
import components from "./components.js";

import store from "./stores/"; // 存在循环依赖
import router from "./routers/"; // 存在循环依赖
import App from "./App.vue"; // 存在循环依赖

import * as WebIM from "@/vendor/easemob"; // 存在循环依赖

Vue.mixin(mixin);

components.forEach(component => {
  Vue.component(component.name, component);
});

// Vue.config.productionTip = false;

Vue.prototype.$http = Ajax;
Vue.prototype.$Modal = Modal;
Vue.prototype.$Message = Message;
Vue.prototype.$MessageBundle = filters.plusMessageFirst;

// Vue.use(imgLazy);
Vue.use(AsyncImage);
Vue.use(imgCropper);
// Vue.use(Toast);
Vue.use(lstore);

for (const k in filters) {
  Vue.filter(k, filters[k]);
}
if (!window.initUrl) {
  window.initUrl = window.location.href.replace(/(\/$)/, "");
}
// for (const k in directives) {
//   Vue.directive(k, directives[k]);
// }

/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App),
  created() {
    WebIM.openWebIM();
  }
}).$mount("#app");
