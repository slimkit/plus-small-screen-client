import Vue from 'vue';
import { oneOf } from '@/util';
import localEvent from 'store';
import VueRouter from 'vue-router';
import Message from '@/plugins/message';

import routes from './routes';

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  mode: 'history',
  base: '/h5',
  // strict: process.env.NODE_ENV !== 'production',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      const { meta: { keepAlive = false, toTop = false } } = from;
      if (keepAlive && !toTop) {
        from.meta.savedPosition =
          document.body.scrollTop || document.documentElement.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition || 0 };
    }
  }
});

/**
 * 路由守卫 登录检测 islogin
 *
 * 需要登录的页面路由需要添加
 * meta.requiresAuth = true
 *
 * 登录后不可访问的路由需要添加
 * meta.forGuest = true
 *
 */
router.beforeEach((to, from, next) => {
  const isLogin = !!(localEvent.get('CURRENTUSER') || {}).token;
  const forGuest = to.matched.some(record => record.meta.forGuest);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const upgrade = [
    '/post/wenzi',
    '/post/pic',
    '/post/release',
    '/post/checkin',
    '/post/question'
  ];
  if (oneOf(to.path, upgrade)) {
    next({ path: '/upgrade' });
  }
  if (requiresAuth) {
    if (isLogin) {
      next();
    } else {
      Message.error('您还没有登录, 请先登录或注册');
      next({ path: '/signin', query: { redirect: to.fullPath } });
    }
  } else if (forGuest) {
    if (isLogin) {
      const redirect = from.query.redirect;
      next({ path: `${redirect || '/feed/new'}` });
    } else {
      next();
    }
  }
  next();
});

export default router;
