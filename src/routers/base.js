import lstore from "store";
import about from "@/page/about";
import signup from "@/page/signup";
import forgot from "@/page/forgot";
import signin from "@/page/signin.vue";

/* TODO */
import profile from "@/page/profile/profile.vue";
/* TODO END */

import discover from "@/page/discover.vue";
import wechatSignin from "@/page/wechat/wechat";
import wechatSignup from "@/page/wechat/wechatSignup.vue";
import wechatBindUser from "@/page/wechat/wechatBindUser.vue";

export default [
  {
    path: "/signin",
    component: signin,
    meta: {
      title: "登录",
      forGuest: true
    }
  },
  {
    path: "/signup",
    component: signup,
    meta: {
      title: "注册",
      forGuest: true
    }
  },
  {
    path: "/forgot",
    component: forgot,
    meta: {
      title: "忘记密码"
    }
  },
  {
    path: "/discover",
    component: discover,
    meta: {
      title: "发现"
    }
  },
  {
    path: "/profile",
    component: profile,
    meta: { title: "我", requiresAuth: true }
  },
  {
    path: "/setting",
    component: setting,
    meta: {
      title: "设置",
      requiresAuth: true
    }
  },
  {
    path: "/about",
    component: about,
    meta: {
      title: "关于我们"
    }
  },
  {
    path: "/wechat",
    component: wechatSignin,
    meta: {
      title: "登录中...",
      forGuest: true
    },
    beforeEnter(to, from, next) {
      navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1
        ? to.query.code ? next() : next("/signin")
        : next("/signin");
    }
  },
  {
    path: "/wechat/signup",
    component: wechatSignup,
    meta: {
      title: "完善资料",
      forGuest: true
    },
    beforeEnter(to, from, next) {
      const accessToken = lstore.get("H5_WECHAT_MP_ASTOKEN");
      const nickname = lstore.get("H5_WECHAT_NICKNAME");
      accessToken && nickname ? next() : next("/wechat");
    }
  },
  {
    path: "/wechat/bind",
    component: wechatBindUser,
    meta: {
      title: "绑定已有账号",
      forGuest: true
    },
    beforeEnter(to, from, next) {
      const accessToken = lstore.get("H5_WECHAT_MP_ASTOKEN");
      accessToken ? next() : next("/wechat");
    }
  }
];
