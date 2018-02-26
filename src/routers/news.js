const news = () => import(/* webpackChunkName: 'news' */ '../page/news/news');
export default [
  {
    path: '/news',
    component: news,
    meta: {
      title: '资讯',
      keepAlive: true,
      requiresAuth: true
    }
  }
];
