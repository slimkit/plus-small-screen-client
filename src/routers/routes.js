import NotFound from "../page/notFound";
import baseRoutes from "./base.js";
import signRoutes from "./sign.js";
import feedRoutes from "./feed.js";
import newsRoutes from "./news.js";
import rankRoutes from "./rank.js";
import postRoutes from "./post.js";
import groupRoutes from "./group.js";
import messageRoutes from "./message.js";
import questionRoutes from "./question.js";
import profileRoutes from "./profile.js";

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

const router = [
  /* 基础入口 */
  { path: "/", redirect: "/signin" },
  ...baseRoutes,

  ...signRoutes,
  ...feedRoutes,
  ...postRoutes,
  ...newsRoutes,
  ...rankRoutes,
  ...groupRoutes,
  ...messageRoutes,
  ...questionRoutes,
  ...profileRoutes,

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
  // {
  //   path: "/post/fatie",
  //   name: "postGroupFeed",
  //   component: postGroupFeed,
  //   meta: {
  //     keepAlive: true,
  //     title: "发布帖子",
  //     requiresAuth: true
  //   }
  // },
  { path: "*", component: NotFound } /* 404 页面 */
];

export default router;
