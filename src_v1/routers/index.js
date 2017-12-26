import Vue from 'vue';
import localEvent from 'store';
import VueRouter from 'vue-router';

import routes from './routes';

Vue.use(VueRouter);
const scrollBehavior = (to, from, savedPosition) => {
    if(savedPosition) {
        return savedPosition;
    } else {
        const position = {};
        if(to.hash) {
            position.selector = to.hash;
        }
        if(to.matched.some(m => m.meta.scrollToTop)) {
            position.x = 0;
            position.y = 0;
        }
        return position;
    }
};
const router = new VueRouter({
    mode: 'history',
    base: '/h5',
    scrollBehavior,
    routes
});

/**
 * 路由守卫 登录检测 islogin
 *
 * 需要登录的页面路由需要添加 
 * meta.requiresAuth = true
 *
 * 登录后不可访问的路由需要添加
 * meta.canEnterOrNot = true
 * 
 */
router.beforeEach((to, from, next) => {
    const isLogin = !!((localEvent.get('mine') || {}).token),
        meta = to.matched.some(record => record.meta) || {};
    if(meta.requiresAuth) {
        isLogin ? next() : next({ path: '/login', query: { redirect: to.fullPath } });
    } else if(meta.canEnterOrNot) {
        isLogin ? next({ path: '/feed' }) : next();
    } else {
        next();
    }
});

export default router;