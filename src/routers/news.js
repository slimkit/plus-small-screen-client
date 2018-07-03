const news = () => import(/* webpackChunkName: 'news' */ "../page/news/news");
const newsSearch = () =>
  import(/* webpackChunkName: 'news' */ "../page/news/newsSearch");
const newsDetail = () =>
  import(/* webpackChunkName: 'news' */ "../page/news/newsDetail");
const likes = () =>
  import(/* webpackChunkName: 'news' */ "@/page/article/ArticleLikes.vue");
const rewards = () =>
  import(/* webpackChunkName: 'news' */ "@/page/article/ArticleRewards.vue");

export default [
  {
    path: "/news",
    component: news,
    meta: {
      title: "资讯",
      keepAlive: true
    }
  },
  {
    path: "/news/:newsID(\\d+)",
    component: newsDetail,
    meta: {
      title: "资讯详情",
      keepAlive: true
    }
  },
  {
    path: "/news/search",
    component: newsSearch,
    meta: {
      title: "搜索",
      keepAlive: true
    }
  },
  /**
   * 点赞列表 && 打赏列表 路由格式固定
   *
   * 帖子/资讯/问答 相关路由 统一使用 article 代替 id
   *
   * 通过传递 不同的 meta[type] 实现组件复用
   *
   * copy by @/routers/feed.js
   *
   */
  {
    path: "/news/:article(\\d+)/likers",
    component: likes,
    meta: {
      title: "点赞列表",
      type: "news"
    }
  },
  {
    path: "/news/:article(\\d+)/rewarders",
    component: rewards,
    meta: {
      title: "打赏列表",
      type: "news"
    }
  }
];
