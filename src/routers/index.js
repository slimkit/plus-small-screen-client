import Vue from "vue";
import localEvent from "store";
import VueRouter from "vue-router";
import isWechat from "../util/wechat";
import Message from "@/plugins/message";
import getRedirect from "../util/getRedirectUrl";

import routes from "./routes";

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  mode: process.env.VUE_APP_ROUTER_MODE || "hash",
  base: process.env.BASE_URL,
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
 *ß
 * 需要登录的页面路由需要添加
 * 登录后不可访问的路由需要添加
 * meta.forGuest = true
 *
 */
router.beforeEach((to, from, next) => {
  const isLogin = !!(localEvent.get("CURRENTUSER") || {}).token;
  const forGuest = to.matched.some(record => record.meta.forGuest);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth) {
    if (isLogin) {
      next();
    } else {
      // 跳转到微信登录
      if (isWechat()) {
        getRedirect(to.fullPath);
        return;
      } else {
        Message.error("您还没有登录, 请先登录或注册");
        next({ path: "/signin", query: { redirect: to.fullPath } });
      }
    }
  } else if (forGuest) {
    if (isLogin) {
      const redirect = from.query.redirect;
      next({ path: `${redirect || "/feed/new"}` });
    } else {
      next();
    }
  }
  next();
});

export default router;
