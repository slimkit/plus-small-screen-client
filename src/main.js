// 当前构建版本号 每次 release tag 后将此版本推进
const version = "v4.0.0-rc.7";

import "./style/tsplus.less";
import "github-markdown-css";
import Vue from "vue";
import "./util/rem";

import Modal from "./plugins/modal/";
// import imgLazy from "./plugins/imgLazy";
import Message from "./plugins/message/";
import AsyncImage from "./components/FeedCard/v-async-image.js";

import imgCropper from "@/plugins/imgCropper";
// import Toast from "@/plugins/toast/index.js";
import lstore from "@/plugins/lstore/index.js";

import Ajax from "./http";
import mixin from "./mixin.js";
import * as filters from "./filters.js";
import components from "./components.js";

import store from "./stores/";
import router from "./routers/";
import App from "./App.vue";

import * as WebIM from "@/vendor/easemob";

Vue.mixin(mixin);
// 注入版本号
Vue.mixin({ data: () => ({ version }) });

components.forEach(component => {
  Vue.component(component.name, component);
});

Vue.config.productionTip = false;

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

/* eslint-disable no-new */
new Vue({
  store,
  router,
  created() {
    WebIM.openWebIM();
  },
  render: h => h(App)
}).$mount("#app");

// 版本号输出
// eslint-disable-next-line
console.info(
  `%cWelcome to ThinkSNS Plus! Release %c plus-component-h5 %c ${version} %c by zhiyicx.`,
  "color: #00A9E0;",
  "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
  "background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;",
  "color: #00A9E0;background: transparent;"
);
