const feed = () => import(/* webpackChunkName: 'feed' */ "../page/feed/feed");
const feedDetail = () =>
  import(/* webpackChunkName: 'feed' */ "../page/feed/feedDetail");
export default [
  {
    path: "/feeds/:type(new|hot|follow)",
    component: feed,
    meta: { title: "动态", keepAlive: true }
  },
  {
    path: "/feeds/:feedID(\\d+)",
    component: feedDetail,
    meta: { title: "动态详情", keepAlive: true }
  }
];
