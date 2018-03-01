const news = () => import(/* webpackChunkName: 'news' */ '../page/news/news');
const newsSearch = () =>
  import(/* webpackChunkName: 'news' */ '../page/news/newsSearch');
const newsDetail = () =>
  import(/* webpackChunkName: 'news' */ '../page/news/newsDetail');
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
    path: '/news/:newsID(\\d+)',
    component: newsDetail,
    meta: {
      title: '资讯详情',
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
