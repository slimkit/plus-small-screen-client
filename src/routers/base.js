import lstore from "store";
import signin from "@/page/signin.vue";
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
