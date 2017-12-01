import Vue from 'vue';
import localEvent from 'store';
import VueRouter from 'vue-router';

import routes from './routes';

Vue.use(VueRouter);
const router = new VueRouter({
    routes,
    mode: 'history',
    base: '/h5',
    strict: process.env.NODE_ENV !== 'production',
    scrollBehavior(to, from, savedPosition) {
        if(savedPosition) {
            return savedPosition
        } else {
            if(from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop || document.documentElement.scrollTop;
            }
            return { x: 0, y: to.meta.savedPosition || 0 }
        }
    },
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
    const isLogin = !!((localEvent.get('CURRENTUSER') || {}).token),
        meta = to.matched.some(record => record.meta) || {};
    if(meta.requiresAuth) {
        isLogin ? next() : next({ path: '/signin', query: { redirect: to.fullPath } });
    } else if(meta.canEnterOrNot) {
        isLogin ? next({ path: '/feed/new' }) : next();
    } else {
        next();
    }
});

export default router;