import "./style/tsplus.less";
import "github-markdown-css";
import Vue from "vue";
import store from "./stores/";
import router from "./routers/";
import directives from "./directives/";
import App from "./App";

import "./util/rem";
import _ from "lodash";

import Modal from "./plugins/modal/";
import imgLazy from "./plugins/imgLazy";
import Message from "./plugins/message/";
import imgCropper from "./plugins/imgCropper";

// Filters
import * as filters from "./filters";
/** Ajax */
import Ajax from "./http";

import components from "./components.js";

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
      return _.unionBy([...target, ...source], "id");
    },
    goBack(num = -1) {
      window.history.length <= 1
        ? this.$router.push("/")
        : this.$router.back(num);
    }
  }
});
/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
