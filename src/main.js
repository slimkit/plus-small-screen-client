import "./style/tsplus.less";
import "github-markdown-css";
import "./util/rem";
import Vue from "vue";

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
import App from "./App";

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

// for (const k in directives) {
//   Vue.directive(k, directives[k]);
// }

window.vuex = store;
/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App),
  created() {
    WebIM.openWebIM();
  }
}).$mount("#app");
