const feed = () => import(/* webpackChunkName: 'feed' */ "../page/feed/feed");
const feedDetail = () =>
  import(/* webpackChunkName: 'feed' */ "../page/feed/feedDetail");
const likes = () =>
  import(/* webpackChunkName: 'feed' */ "@/page/article/ArticleLikes.vue");
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
  {
    path: "/feeds/:article(\\d+)/likers",
    component: likes,
    meta: {
      title: "点赞列表",
      type: "feed"
    }
  }
];
