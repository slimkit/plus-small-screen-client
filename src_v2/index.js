import Vue from 'vue';
import App from 'App';
// import i_View from 'iview';
import router from './routers/';
import FastClick from 'fastclick'
import './util/rem';
// 引入 `iview` 样式
// import 'style/them/index.less';
// Vue.use(i_View);
import './style/index.less';

/** common components */
import svgIcons from './components/common/svgIcon'; /* Svg icons */
import vIcon from './components/common/vIcons'; /* Icons */
import badge from './components/common/badge'; /* Badge 徽标 */
import userAvatar from './components/common/userAvatar'; /* Avatar 用户头像组件 */
const components = [svgIcons, vIcon, badge, userAvatar];

components.forEach(component => {
    Vue.component(component.name, component);
});

Vue.config.productionTip = false;

if('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

new Vue({
    el: '#app',
    router,
    data: {
        show_modal: false
    },
    methods: {
        showModal() {
            this.show_modal = !this.show_modal;
        }
    }
}).$mount('#app');