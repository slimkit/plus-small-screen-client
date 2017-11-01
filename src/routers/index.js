import Vue from 'vue';
import storeLocal from 'store';
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
 * 路由守卫 登录检测
 *
 * 需要登录的页面路由需要添加 
 * meta.requiresAuth = true
 * 
 * @param  {[type]} to, from, next
 * @return {[type]}
 */
router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        let UserLoginInfo = storeLocal.get('UserLoginInfo') || {};
        if(!UserLoginInfo.token) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        next();
    }
});


export default router;