/**
 * dynamic import
 */
const QuestionBase = () =>
  import(/*webpackChunkName:'question' */ "@/page/question/QuestionBase.vue");
const QuestionList = () =>
  import(/*webpackChunkName:'question' */ "@/page/question/QuestionList.vue");
const TopicList = () =>
  import(/*webpackChunkName:'question' */ "@/page/question/TopicList.vue");
const QuestionDetail = () =>
  import(/*webpackChunkName:'question' */ "@/page/question/QuestionDetail.vue");
const TopicDetail = () =>
  import(/*webpackChunkName:'question' */ "@/page/question/TopicDetail.vue");
const AnswerDetail = () =>
  import(/*webpackChunkName:'question' */ "@/page/question/AnswerDetail.vue");
const QuestionSearch = () =>
  import(/*webpackChunkName:'question' */ "@/page/question/QuestionSearch.vue");
const ArticleLikes = () =>
  import(/*webpackChunkName:'question' */ "@/page/article/ArticleLikes.vue");
const ArticleRewards = () =>
  import(/*webpackChunkName:'question' */ "@/page/article/ArticleRewards.vue");

export default [
  {
    path: "/question",
    component: QuestionBase,
    meta: {
      requiresAuth: true,
      keepAlive: true
    },
    children: [
      {
        name: "question",
        path: "",
        component: QuestionList,
        meta: { keepAlive: true }
      },
      {
        path: "topics",
        component: TopicList
      }
    ]
  },
  {
    path: "/questions/:id",
    component: QuestionDetail,
    meta: { requiresAuth: true }
  },
  {
    path: "/question-topics/:id",
    component: TopicDetail,
    meta: { requiresAuth: true }
  },
  {
    path: "/questions/:questionId/answers/:answerId",
    component: AnswerDetail,
    meta: {
      title: "问题详情"
    }
  },
  {
    path: "/question/search",
    component: QuestionSearch,
    meta: {
      title: "搜索",
      keepAlive: true
    }
  },
  /**
   * 点赞列表 && 打赏列表 路由格式固定
   * 帖子/资讯/问答 相关路由 统一使用 article 代替 id
   * 通过传递 不同的 meta[type] 实现组件复用
   * copy from @/routers/feed.js
   */
  {
    path: "/questions/:questionId/answers/:article/likers",
    component: ArticleLikes,
    meta: {
      title: "点赞列表",
      type: "answer"
    }
  },
  {
    path: "/questions/:questionId/answers/:article/rewarders",
    component: ArticleRewards,
    meta: {
      title: "打赏列表",
      type: "answer"
    }
  }
];
