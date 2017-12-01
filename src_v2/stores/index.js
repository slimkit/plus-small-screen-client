import Vue from 'vue';
import Vuex from 'vuex';
import LocalEvent from 'store';
import actions from './action';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);
let BROWSER = {
    versions: (() => {
        const u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            /* IE内核 */
            trident: u.indexOf('Trident') > -1,
            /* opera内核 */
            presto: u.indexOf('Presto') > -1,
            /* 苹果、谷歌内核 */
            webKit: u.indexOf('AppleWebKit') > -1,
            /* 火狐内核 */
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
            /* 是否为移动终端 */
            mobile: !!u.match(/AppleWebKit.*Mobile.*/),
            /* ios终端 */
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            /* android终端或uc浏览器 */
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            /* 是否为iPhone或者QQHD浏览器 */
            iPhone: u.indexOf('iPhone') > -1,
            /* 是否iPad */
            iPad: u.indexOf('iPad') > -1,
            /* 是否web应该程序，没有头部与底部 */
            webApp: u.indexOf('Safari') == -1
        };
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
const state = {
    BROWSER,
    FEEDTYPE: '',
    /* 当前动态 type */
    CURRENTUSER: LocalEvent.get('CURRENTUSER') || {} /* 当前登录用户信息 */
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
})