import NotFound from "../page/notFound";
import upgrade from "../page/upgrade";

import UserHome from "@/page/UserHome.vue";

import baseRoutes from "./base.js";
import feedRoutes from "./feed.js";
import newsRoutes from "./news.js";
import findRoutes from "./find.js";
import rankRoutes from "./rank.js";
import groupRoutes from "./group.js";
import messageRoutes from "./message.js";
import questionRoutes from "./question.js";

import postImgFeed from "../page/post/PostFeed.vue";
import postTextFeed from "../page/feed/children/postText";

/* eslint-disable one-var */
const /* 公共页面 */

  // 用户标签选择
  chooseTags = () =>
    import(/* webpackChunkName: 'common' */ "../page/common/chooseTags"),
  // 定位选择
  chooseLocation = () =>
    import(/* webpackChunkName: 'common' */ "../page/common/chooseLocation"),
  // 搜索用户
  searchUser = () =>
    import(/* webpackChunkName: 'common' */ "../page/common/searchUser"),
  postGroupFeed = () =>
    import(/* webpackChunkName: 'common' */ "../page/common/postGroupFeed/");

/**
 * 钱包页面
 * @auth:  jsonleex <jsonleex@163.com>
 * @return {[type]}
 */
const wallet = () =>
  import(/* webpackChunkName: 'wallet' */ "@/page/wallet/wallet");
/**
 * 充值
 * @auth: jsonleex <jsonleex@163.com>
 */
const WalletRecharge = () =>
  import(/* webpackChunkName: 'wallet' */ "@/page/wallet/WalletRecharge");
/**
 * 提现
 * @auth: jsonleex <jsonleex@163.com>
 */
const WalletWithdraw = () =>
  import(/* webpackChunkName: 'wallet' */ "@/page/wallet/WalletWithdraw");
/**
 * 明细
 * @auth: jsonleex <jsonleex@163.com>
 */
const WalletDetail = () =>
  import(/* webpackChunkName: 'wallet' */ "@/page/wallet/WalletDetail");

const UserFans = () =>
  import(/* webpackChunkName: 'user' */ "@/page/user/UserFans");

const router = [
  /* 基础入口 */
  { path: "/", redirect: "/signin" },
  ...baseRoutes,

  ...feedRoutes,
  ...newsRoutes,
  ...findRoutes,
  ...rankRoutes,
  ...groupRoutes,
  ...messageRoutes,
  ...questionRoutes,

  {
    path: "/post/text",
    component: postTextFeed,
    meta: {
      title: "发布动态",
      requiresAuth: true
    }
  },
  {
    path: "/post/pic",
    component: postImgFeed,
    meta: {
      title: "发布图片",
      requiresAuth: true
    }
  },
  /**
   * 消息页面路由
   */
  /**
   * 消息页面路由结束
   */

  {
    path: "/wallet",
    component: wallet,
    meta: {
      title: "钱包",
      requiresAuth: true
    }
  },
  {
    path: "/wallet/recharge",
    component: WalletRecharge,
    meta: {
      title: "充值"
    }
  },
  {
    path: "/wallet/withdraw",
    component: WalletWithdraw,
    meta: {
      title: "提现"
    }
  },
  {
    path: "/wallet/detail",
    component: WalletDetail,
    meta: {
      title: "明细"
    }
  },

  /* 公共页面 */

  {
    path: "/user/:userID(\\d+)",
    component: UserHome,
    meta: {
      title: "个人主页",
      keepAlive: true
    }
  } /* 个人主页 */,
  {
    path: "/user/:userID(\\d+)/fans",
    component: UserFans,
    meta: {
      title: "粉丝",
      keepAlive: true,
      requiresAuth: true
    }
  },
  {
    path: "/search_user/",
    component: searchUser,
    meta: { title: "搜索用户", keepAlive: true }
  } /* 搜索用户 */,
  {
    path: "/tags",
    component: chooseTags,
    meta: { title: "选择标签" }
  } /* 选择标签 */,
  {
    path: "/location",
    component: chooseLocation,
    meta: { title: "选择位置" }
  } /* 定位 */,

  {
    path: "/post/fatie",
    name: "postGroupFeed",
    component: postGroupFeed,
    meta: {
      keepAlive: true,
      title: "发布帖子",
      requiresAuth: true
    }
  },
  { path: "/upgrade", component: upgrade } /* 网站升级中 */,
  { path: "*", component: NotFound } /* 404 页面 */
];

export default router;
