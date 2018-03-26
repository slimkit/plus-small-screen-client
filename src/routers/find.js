/* 找人路由列表 */
const find = () => import(/* webpackChunkName: 'find' */ "@/page/find/find");
const findContent = () =>
  import(/* webpackChunkName: 'find' */ "@/page/find/children/findContent");
const findNearby = () =>
  import(/* webpackChunkName: 'find' */ "@/page/find/children/findNearby");

export default [
  {
    path: "/find",
    component: find,
    meta: {
      title: "找人",
      requiresAuth: true
    },
    redirect: "/find/pop",
    children: [
      {
        path: "new",
        component: findContent,
        meta: {
          type: "new",
          title: "最新",
          keepAlive: true
        }
      },
      {
        path: "pop",
        component: findContent,
        meta: {
          type: "pop",
          title: "热门",
          keepAlive: true
        }
      },
      {
        path: "rec",
        component: findContent,
        meta: {
          type: "rec",
          title: "推荐",
          keepAlive: true
        }
      },
      {
        path: "nearby",
        component: findNearby,
        meta: {
          title: "附近",
          keepAlive: true
        }
      }
    ]
  }
];
