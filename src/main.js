import "./style/tsplus.less";
import "github-markdown-css";
import "./util/rem";
import Vue from "vue";
import store from "./stores/";
import router from "./routers/";

import App from "./App";

import Modal from "./plugins/modal/";
import Message from "./plugins/message/";
import imgCropper from "./plugins/imgCropper";

import Ajax from "./http";
import mixin from "./mixin.js";
// import directives from "./directives/";
import * as filters from "./filters.js";
import components from "./components.js";

Vue.mixin(mixin);

components.forEach(component => {
  Vue.component(component.name, component);
});

Vue.config.productionTip = false;

Vue.prototype.$http = Ajax;
Vue.prototype.$Modal = Modal;
Vue.prototype.$Message = Message;
Vue.prototype.$MessageBundle = filters.plusMessageFirst;

Vue.use(imgCropper);

for (const k in filters) {
  Vue.filter(k, filters[k]);
}

// for (const k in directives) {
//   Vue.directive(k, directives[k]);
// }

/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
