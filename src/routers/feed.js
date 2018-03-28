const feed = () => import(/* webpackChunkName: 'feed' */ "../page/feed/feed");
const feedDetail = () =>
  import(/* webpackChunkName: 'feed' */ "../page/feed/feedDetail");
const postImage = () =>
  import(/* webpackChunkName: 'feed' */ "@/page/post/PostImage.vue");
const postText = () =>
  import(/* webpackChunkName: 'feed' */ "@/page/post/PostText.vue");

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
  },
  {
    path: "/post/text",
    component: postText,
    meta: {
      title: "发布动态",
      requiresAuth: true
    }
  },
  {
    path: "/post/pic",
    component: postImage,
    meta: {
      title: "发布图片",
      requiresAuth: true
    }
  }
];
