/**
 * Questions page
 *
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
const Questions = () =>
  import(/* webpackChunkName: 'question' */ "../components/pages/Questions");

/**
 * Questions page module.
 *
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
const QuestionsModule = () =>
  import(/* webpackChunkName: 'question' */ "../components/modules/question/Questions");

/**
 * Quesrion Tags module.
 *
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
const QuestionTopicsModule = () =>
  import(/* webpackChunkName: 'question' */ "../components/modules/question/Topics");

/**
 * The a question page.
 *
 * @return {Promise} [description]
 * @author Seven Du <shiweidu@outlook.com>
 */
const Question = () =>
  import(/* webpackChunkName: 'question' */ "../components/pages/Question");

/**
 * The a topic page.
 *
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
const Topic = () =>
  import(/* webpackChunkName: 'question' */ "../components/pages/Topic");

const AnswerDetail = () =>
  import(/* webpackChunkName: 'question' */ "@/page/question/AnswerDetail.vue");

import likes from "@/page/article/ArticleLikes.vue";
import rewards from "@/page/article/ArticleRewards.vue";

export default [
  /**
   * Questions page entry.
   */
  {
    path: "/question",
    component: Questions,
    meta: {
      requiresAuth: true,
      keepAlive: true
    },
    children: [
      {
        name: "question",
        path: "",
        component: QuestionsModule,
        meta: { keepAlive: true }
      },
      {
        path: "topics",
        component: QuestionTopicsModule
      }
    ]
  },
  /**
   * Question page.
   */
  {
    path: "/questions/:id",
    component: Question,
    meta: { requiresAuth: true }
  },
  {
    path: "/question-topics/:id",
    component: Topic,
    meta: { requiresAuth: true }
  },
  {
    path: "/questions/:questionId/answers/:answerId",
    component: AnswerDetail,
    meta: {
      title: "问题详情"
    }
  },
  /**
   * 点赞列表 && 打赏列表 路由格式固定
   *
   * 帖子/资讯/问答 相关路由 统一使用 article 代替 id
   *
   * 通过传递 不同的 meta[type] 实现组件复用
   *
   * copy by @/routers/feed.js
   *
   */
  {
    path: "/questions/:questionId/answers/:article/likers",
    component: likes,
    meta: {
      title: "点赞列表",
      type: "answer"
    }
  },
  {
    path: "/questions/:questionId/answers/:article/rewarders",
    component: rewards,
    meta: {
      title: "打赏列表",
      type: "answer"
    }
  }
];
