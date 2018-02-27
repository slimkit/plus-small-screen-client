const news = () => import(/* webpackChunkName: 'news' */ '../page/news/news');
const newsSearch = () =>
  import(/* webpackChunkName: 'news' */ '../page/news/newsSearch');
export default [
  {
    path: '/news',
    component: news,
    meta: {
      title: '资讯',
      keepAlive: true,
      requiresAuth: true
    }
  },
  {
    path: '/news/search',
    component: newsSearch,
    meta: {
      title: '搜索',
      keepAlive: true,
      requiresAuth: true
    }
  }
];
