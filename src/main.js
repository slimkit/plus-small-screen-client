import { version } from "../package.json";
export { version };

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
  `%cWelcome to Plus(ThinkSNS+)!\n\n Release %c ${version} %c \n Development by SlimKit Group 👉 https://github.com/slimkit\nApache-2.0 Licensed | Copyright © ${(new Date).getFullYear()} Chengdu ZhiYiChuangXiang Technology Co., Ltd. All rights reserved.`,
  "color: #00A9E0;",
  "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
  "color: #00A9E0;background: transparent;"
);
