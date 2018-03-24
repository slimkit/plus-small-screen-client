import signin from "@/page/signin.vue";
import wechatLogin from "@/page/wechat/wechat";

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
    path: "/signin/wechat",
    component: wechatLogin,
    meta: {
      title: "登录中...",
      forGuest: true
    }
  }
];
