import Vue from 'vue';
import store from './stores/';
import router from './routers/';
// import FastClick from 'fastclick'
import TimeAgo from 'vue-timeago';

import modal from './plugins/modal';
import imgLazy from './plugins/imgLazy';
import messageToast from './plugins/messageToast';

import './util/rem';
import './style/index.less';

// Filters
import * as filters from './filters';

/** Ajax */
import Ajax from './http';

/** common components */
import vIcon from './components/common/vIcons'; /* Icons */
import badge from './components/common/badge'; /* Badge 徽标 */
import userAvatar from './components/common/userAvatar'; /* Avatar 用户头像组件 */
import loadMore from './components/loadMore/loadMore';

const components = [vIcon, badge, userAvatar, loadMore];

components.forEach(component => {
    Vue.component(component.name, component);
});

Vue.config.productionTip = false;

Vue.use(Ajax);
Vue.use(modal);
Vue.use(imgLazy);
Vue.use(messageToast);

for (const k in filters) {
  Vue.filter(k, filters[k]);
}

Vue.use(TimeAgo, {
    name: 'timeago',
    locale: 'zh-CN',
    locales: {
        'zh-CN': require('vue-timeago/locales/zh-CN.json')
    }
});

/* 此处留一坑 */
// if('addEventListener' in document) {
//     document.addEventListener('DOMContentLoaded', function() {
//         FastClick.attach(document.body);
//     }, false);
// }

new Vue({
    store,
    router,
    data: {
        show_modal: false
    },
    directives: {},
    methods: {
        showModal() {
            this.show_modal = !this.show_modal;
        }
    }
}).$mount('#app');