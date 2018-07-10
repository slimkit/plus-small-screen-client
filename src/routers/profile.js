import profileNews from "@/page/profile/children/profileNews";
import profileCollections from "@/page/profile/collection.vue";
import ProfileCollectionNews from "@/page/profile/collection/profileCollection.news.vue";
import ProfileCollectionFeeds from "@/page/profile/collection/profileCollection.feeds.vue";
import ProfileCollectionAnswers from "@/page/profile/collection/profileCollection.answers.vue";
import ProfileCollectionPosts from "@/page/profile/collection/profileCollection.posts.vue";
import ProfileCertificate from "@/page/profile/Certificate.vue";

export default [
  {
    path: "/profile/news/:type(released|auditing|rejected)",
    component: profileNews,
    meta: { title: "我的投稿", keepAlive: true }
  },
  {
    path: "/profile/collection",
    component: profileCollections,
    meta: { title: "我的收藏", keepAlive: true },
    redirect: "/profile/collection/feeds",
    children: [
      {
        path: "feeds",
        component: ProfileCollectionFeeds,
        meta: { title: "收藏的动态" }
      },
      {
        path: "news",
        component: ProfileCollectionNews,
        meta: { title: "收藏的资讯" }
      },
      {
        path: "answers",
        component: ProfileCollectionAnswers,
        meta: { title: "收藏的回答" }
      },
      {
        path: "posts",
        component: ProfileCollectionPosts,
        meta: { title: "收藏的帖子" }
      }
    ]
  },
  {
    path: "/profile/certificate",
    component: ProfileCertificate,
    meta: { title: "认证" }
  }
];
