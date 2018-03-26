/* 排行榜 */
const rank = () => import(/* webpackChunkName: 'rank' */ "../page/rank/rank");
const rankUsers = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/children/rankUsers");
const rankQuestions = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/children/rankQuestions");
const rankFeeds = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/children/rankFeeds");
const rankNews = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/children/rankNews");
const rankFollowers = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/lists/fansList");
const rankBalances = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/lists/balanceList");
const rankIncome = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/lists/incomeList");
const rankQuestionExports = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/lists/exportList");
const rankQuestionLikes = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/lists/questionLikesList");
const rankCheckinLikes = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/lists/checkinList");
const rankQuestionList = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/lists/rankQuestionList");
const rankFeedList = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/lists/rankFeedList");
const rankNewsList = () =>
  import(/* webpackChunkName: 'rank' */ "../page/rank/lists/rankNewsList");
export default [
  {
    path: "/rank",
    component: rank,
    meta: { title: "排行" },
    redirect: "/rank/users",
    children: [
      {
        path: "users",
        component: rankUsers,
        meta: {
          keepAlive: true
        }
      },
      {
        path: "questions",
        component: rankQuestions,
        meta: {
          keepAlive: true
        }
      },
      {
        path: "feeds",
        component: rankFeeds,
        meta: {
          keepAlive: true
        }
      },
      {
        path: "news",
        component: rankNews,
        meta: {
          keepAlive: true
        }
      }
    ]
  } /* 排行 */,
  {
    path: "/rank/users/followers",
    component: rankFollowers,
    meta: {
      title: "全站粉丝排行榜",
      keepAlive: true
    }
  },
  {
    path: "/rank/users/balance",
    component: rankBalances,
    meta: {
      title: "财富达人排行榜",
      keepAlive: true
    }
  },
  {
    path: "/rank/users/income",
    component: rankIncome,
    meta: {
      title: "收入达人排行榜",
      keepAlive: true
    }
  },
  {
    path: "/rank/users/question-experts",
    component: rankQuestionExports,
    meta: {
      title: "社区专家排行榜",
      keepAlive: true
    }
  },
  {
    path: "/rank/users/question-likes",
    component: rankQuestionLikes,
    meta: {
      title: "问答达人排行榜",
      keepAlive: true
    }
  },
  {
    path: "/rank/users/checkin",
    component: rankCheckinLikes,
    meta: {
      title: "社区签到排行榜",
      keepAlive: true
    }
  },
  {
    path: "/rank/q/:time",
    component: rankQuestionList,
    meta: {
      // keepAlive: true,
      title: "问答排行榜"
    }
  },
  {
    path: "/rank/f/:time",
    component: rankFeedList,
    meta: {
      // keepAlive: true,
      title: "动态排行榜"
    }
  },
  {
    path: "/rank/n/:time",
    component: rankNewsList,
    meta: {
      // keepAlive: true,
      title: "资讯排行榜"
    }
  }
];
