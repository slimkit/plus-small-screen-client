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
  }
];
