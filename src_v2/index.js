import Vue from 'vue';
import App from 'App';
// import i_View from 'iview';
import router from './routers/';
import FastClick from 'fastclick'
import './util/rem';
// 引入 `iview` 样式
// import 'style/them/index.less';
// Vue.use(i_View);

/** common components */
import svgIcons from './components/common/svgIcon'; /* svg icons */
import vIcon from './components/common/vIcons';
import badge from './components/common/badge'; /* badge 徽标 */
const components = [svgIcons, vIcon, badge];

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
        showModal(){
            this.show_modal = !this.show_modal;
        }
    }
}).$mount('#app');