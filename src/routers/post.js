const postNews = () =>
  import(/* webpackChunkName: 'post' */ "@/page/post/PostNews.vue");
const postImage = () =>
  import(/* webpackChunkName: 'post' */ "@/page/post/PostImage.vue");
const postText = () =>
  import(/* webpackChunkName: 'post' */ "@/page/post/PostText.vue");
const postQuestion = () =>
  import(/* webpackChunkName: 'post' */ "@/page/post/PostQuestion.vue");

export default [
  {
    path: "/post/release",
    component: postNews,
    meta: {
      title: "登录",
      requiresAuth: true
    }
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
  },
  {
    path: "/post/question",
    component: postQuestion,
    meta: {
      title: "发布问题",
      requiresAuth: true
    }
  }
];
