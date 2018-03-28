const feed = () => import(/* webpackChunkName: 'feed' */ "../page/feed/feed");
const feedDetail = () =>
  import(/* webpackChunkName: 'feed' */ "../page/feed/feedDetail");
export default [
  {
    path: "/feed/:feedID(\\d+)",
    component: feedDetail,
    meta: { title: "动态详情", keepAlive: true }
  },
  {
    path: "/feed/:type",
    component: feed,
    meta: { title: "动态", keepAlive: true }
  }
];
