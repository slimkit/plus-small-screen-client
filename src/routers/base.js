import about from "@/page/about.vue";

import forgot from "@/page/forgot";
import signup from "@/page/signup.vue";
import signin from "@/page/signin.vue";

import upgrade from "@/page/upgrade.vue";

/* TODO */
import setting from "@/page/setting.vue";

import info from "@/page/info.vue";
import profile from "@/page/profile.vue";
import userHome from "@/page/UserHome.vue";
import userFans from "@/page/UserFans.vue";
/* TODO END */

import discover from "@/page/discover.vue";

import findIndex from "@/page/find/find.vue";
import findPop from "@/page/find/FindPop.vue";
import findRec from "@/page/find/FindRec.vue";
import findNew from "@/page/find/FindNew.vue";
import findNer from "@/page/find/FindNer.vue";

import wechatSignin from "@/page/wechat/wechat";
import wechatSignup from "@/page/wechat/wechatSignup.vue";
import wechatBindUser from "@/page/wechat/wechatBindUser.vue";

import location from "@/page/location.vue";
import searchUser from "@/page/find/FindSearch.vue";

import $lstore from "@/plugins/lstore";

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
    name: "find",
    path: "/find",
    redirect: "/find/pop",
    component: findIndex,
    meta: {
      title: "找人",
      requiresAuth: true
    },
    children: [
      {
        path: "pop",
        component: findPop,
        meta: {
          keepAlive: true
        }
      },
      {
        path: "new",
        component: findNew,
        meta: {
          keepAlive: true
        }
      },
      {
        path: "rec",
        component: findRec,
        meta: {
          keepAlive: true
        }
      },
      {
        path: "ner",
        component: findNer,
        meta: {
          keepAlive: true
        },
        beforeEnter(to, from, next) {
          to,
            from,
            $lstore.hasData("H5_CURRENT_POSITION") ? next() : next("/location");
        }
      }
    ]
  },
  {
    path: "/search/user",
    component: searchUser,
    meta: {
      title: "找人",
      keepAlive: true
    }
  },
  {
    path: "/location",
    component: location
  },
  {
    path: "/profile",
    component: profile,
    meta: {
      title: "我",
      requiresAuth: true
    }
  },
  {
    path: "/users/:userID(\\d+)",
    component: userHome,
    meta: {
      title: "个人主页",
      keepAlive: true
    }
  },
  {
    name: "userfans",
    component: userFans,
    path: "/users/:userID(\\d+)/:type(followers|followings)",
    meta: {
      title: "粉丝",
      keepAlive: true,
      requiresAuth: true
    }
  },
  {
    path: "/info",
    component: info,
    meta: {
      title: "个人资料",
      requiresAuth: true
    }
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
      const accessToken = window.$lstore.getData("H5_WECHAT_MP_ASTOKEN");
      const nickname = window.$lstore.getData("H5_WECHAT_NICKNAME");
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
      const accessToken = window.$lstore.getData("H5_WECHAT_MP_ASTOKEN");
      accessToken ? next() : next("/wechat");
    }
  },
  {
    path: "/upgrade",
    component: upgrade,
    meta: {
      title: "功能开发中..."
    }
  }
];
