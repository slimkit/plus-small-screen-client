const feed = () => import(/* webpackChunkName: 'feed' */ "../page/feed/feed");
const feedDetail = () =>
  import(/* webpackChunkName: 'feed' */ "../page/feed/feedDetail");
const likes = () =>
  import(/* webpackChunkName: 'feed' */ "@/page/article/ArticleLikes.vue");
const rewards = () =>
  import(/* webpackChunkName: 'feed' */ "@/page/article/ArticleRewards.vue");
export default [
  {
    name: "feeds",
    path: "/feeds",
    component: feed,
    meta: {
      title: "动态",
      keepAlive: true
    },
    beforeEnter(to, from, next) {
      const type = to.query.type;
      type
        ? next()
        : next({
            name: "feeds",
            query: { type: "new" }
          });
    }
  },
  {
    path: "/feeds/:feedID(\\d+)",
    component: feedDetail,
    meta: { title: "动态详情", keepAlive: true }
  },

  /**
   * 点赞列表 && 打赏列表 路由格式固定
   *
   * 帖子/资讯/问答 相关路由 统一使用 article 代替 id
   *
   * 通过传递 不同的 meta[type] 实现组件复用
   *
   * rewarders ???
   *
   */
  {
    path: "/feeds/:article(\\d+)/likers",
    component: likes,
    meta: {
      title: "点赞列表",
      type: "feed"
    }
  },
  {
    path: "/feeds/:article(\\d+)/rewarders",
    component: rewards,
    meta: {
      title: "打赏列表",
      type: "feed"
    }
  }
];
