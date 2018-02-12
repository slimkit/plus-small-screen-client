import App from '../App';
import signin from '../page/signin';
import signup from '../page/signup';
import NotFound from '../page/notFound';
import upgrade from '../page/upgrade';
import forgot from '../page/forgot';
import about from '../page/about';
import setting from '../page/setting/setting';
import questionRoutes from './question';

/* eslint-disable one-var */
const feed = () => import(/* webpackChunkName: 'feed' */ '../page/feed/feed'),
  feedDetail = () =>
    import(/* webpackChunkName: 'feed' */ '../page/feed/components/feedDetail'),
  discover = () =>
    import(/* webpackChunkName: 'common' */ '../page/discover/discover'),
  profile = () =>
    import(/* webpackChunkName: 'profile' */ '../page/profile/profile'),
  // 我的圈子
  profileGroup = () =>
    import(/* webpackChunkName: 'profile' */ '../page/profile/children/profileGroup'),
  profileGroupGroup = () =>
    import(/* webpackChunkName: 'profile' */ '../page/profile/children/profileGroup.group'),
  profileGroupPosts = () =>
    import(/* webpackChunkName: 'profile' */ '../page/profile/children/profileGroup.posts'),
  news = () => import(/* webpackChunkName: 'news' */ '../page/news/news'),
  group = () => import(/* webpackChunkName: 'group' */ '../page/group/group'),
  // 添加圈子
  addGroup = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/addGroup'),
  chooseCategory = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/chooseCategory'),
  groupJoined = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/groupJoined'),
  groupSearch = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/groupSearch'),
  groupAll = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/groupAll'),
  groupDetail = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/groupDetail'),
  groupMember = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/groupMember'),
  groupPermissions = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/groupPermissions'),
  groupEdit = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/groupEdit'),
  groupFeedDetail = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/groupFeedDetail'),
  // question = () =>
  // import(/* webpackChunkName: 'question' */ '../page/question/question'),

  // 排行榜
  rank = () => import(/* webpackChunkName: 'rank' */ '../page/rank/rank'),
  rankUsers = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/children/rankUsers'),
  rankQuestions = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/children/rankQuestions'),
  rankFeeds = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/children/rankFeeds'),
  rankNews = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/children/rankNews'),
  rankFollowers = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/lists/fansList'),
  rankBalances = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/lists/balanceList'),
  rankIncome = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/lists/incomeList'),
  rankQuestionExports = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/lists/exportList'),
  rankQuestionLikes = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/lists/questionLikesList'),
  rankCheckinLikes = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/lists/checkinList'),
  rankQuestionList = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/lists/rankQuestionList'),
  rankFeedList = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/lists/rankFeedList'),
  rankNewsList = () =>
    import(/* webpackChunkName: 'rank' */ '../page/rank/lists/rankNewsList'),
  // 找人
  find = () => import(/* webpackChunkName: 'find' */ '../page/find/find'),
  findContent = () =>
    import(/* webpackChunkName: 'find' */ '../page/find/children/findContent'),
  findNearby = () =>
    import(/* webpackChunkName: 'find' */ '../page/find/children/findNearby'),
  /* 公共页面 */

  // 个人主页
  userHome = () =>
    import(/* webpackChunkName: 'common' */ '../page/common/userHome'),
  // 用户标签选择
  chooseTags = () =>
    import(/* webpackChunkName: 'common' */ '../page/common/chooseTags'),
  // 定位选择
  chooseLocation = () =>
    import(/* webpackChunkName: 'common' */ '../page/common/chooseLocation'),
  // 搜索用户
  searchUser = () =>
    import(/* webpackChunkName: 'common' */ '../page/common/searchUser'),
  postGroupFeed = () =>
    import(/* webpackChunkName: 'common' */ '../page/common/postGroupFeed/'),
  postWenzi = () =>
    import(/* webpackChunkName: 'common' */ '../page/common/postWenzi'),
  /**
   * 消息页面组件
   * @Author   Wayne
   * @DateTime 2018-01-29
   * @Email    qiaobin@zhiyicx.com
   * @return   {[type]}            [description]
   */
  MessageMain = () =>
    import(/* webpackChunkName: 'message' */ '@/page/message/message'),
  msg = () =>
    import(/* webpackChunkName: 'message' */ '@/page/message/children/msg'),
  notification = () =>
    import(/* webpackChunkName: 'message' */ '@/page/message/children/notification'),
  msgComments = () =>
    import(/* webpackChunkName: 'message' */ '@/page/message/list/comments'),
  msgLikes = () =>
    import(/* webpackChunkName: 'message' */ '@/page/message/list/likes'),
  msgAudits = () =>
    import(/* webpackChunkName: 'message' */ '@/page/message/list/audits'),
  feedCommentAudit = () =>
    import(/* webpackChunkName: 'message' */ '@/page/message/children/audits/feedCommentAudit'),
  newsCommentAudit = () =>
    import(/* webpackChunkName: 'message' */ '@/page/message/children/audits/newsCommentAudit'),
  groupPostAudit = () =>
    import(/* webpackChunkName: 'message' */ '@/page/message/children/audits/groupPostAudit'),
  groupCommentAudit = () =>
    import(/* webpackChunkName: 'message' */ '@/page/message/children/audits/groupCommentAudit'),
  groupJoinAudit = () =>
    import(/* webpackChunkName: 'message' */ '@/page/message/children/audits/groupJoinAudit');

/**
 * 钱包页面
 * @auth:  jsonleex <jsonleex@163.com>
 * @return {[type]}
 */
const wallet = () =>
  import(/* webpackChunkName: 'wallet' */ '@/page/wallet/wallet');
/**
 * 充值
 * @auth: jsonleex <jsonleex@163.com>
 */
const WalletRecharge = () =>
  import(/* webpackChunkName: 'wallet' */ '@/page/wallet/WalletRecharge');
/**
 * 提现
 * @auth: jsonleex <jsonleex@163.com>
 */
const WalletWithdraw = () =>
  import(/* webpackChunkName: 'wallet' */ '@/page/wallet/WalletWithdraw');
/**
 * 明细
 * @auth: jsonleex <jsonleex@163.com>
 */
const WalletDetail = () =>
  import(/* webpackChunkName: 'wallet' */ '@/page/wallet/WalletDetail');

const router = [
  {
    path: '/',
    component: App,
    /* 顶层路由 */
    children: [
      /* 基础入口 */
      { path: '', redirect: '/signin' },
      ...questionRoutes,
      {
        path: '/signin',
        component: signin,
        meta: { title: '登录', forGuest: true }
      } /* 登录 */,
      {
        path: '/signup',
        component: signup,
        meta: { title: '注册', forGuest: true }
      } /* 注册 */,
      {
        path: '/profile',
        component: profile,
        meta: { title: '我', requiresAuth: true }
      } /* 个人中心 */,

      {
        path: '/discover',
        component: discover,
        meta: { title: '发现' }
      } /* 发现 */,

      /* 功能页面 */
      { path: '/news', component: news, meta: { title: '资讯' } } /* 资讯 */,
      {
        path: '/find',
        component: find,
        meta: {
          title: '找人',
          requiresAuth: true
        },
        redirect: '/find/pop',
        children: [
          {
            path: 'new',
            component: findContent,
            meta: {
              type: 'new',
              title: '最新',
              keepAlive: true
            }
          },
          {
            path: 'pop',
            component: findContent,
            meta: {
              type: 'pop',
              title: '热门',
              keepAlive: true
            }
          },
          {
            path: 'rec',
            component: findContent,
            meta: {
              type: 'rec',
              title: '推荐',
              keepAlive: true
            }
          },
          {
            path: 'nearby',
            component: findNearby,
            meta: {
              title: '附近',
              keepAlive: true
            }
          }
        ]
      } /* 找人 */,
      {
        path: '/rank',
        component: rank,
        meta: { title: '排行' },
        redirect: '/rank/users',
        children: [
          {
            path: 'users',
            component: rankUsers,
            meta: {
              keepAlive: true
            }
          },
          {
            path: 'questions',
            component: rankQuestions,
            meta: {
              keepAlive: true
            }
          },
          {
            path: 'feeds',
            component: rankFeeds,
            meta: {
              keepAlive: true
            }
          },
          {
            path: 'news',
            component: rankNews,
            meta: {
              keepAlive: true
            }
          }
        ]
      } /* 排行 */,
      {
        path: '/rank/users/followers',
        component: rankFollowers,
        meta: {
          title: '全站粉丝排行榜',
          keepAlive: true
        }
      },
      {
        path: '/rank/users/balance',
        component: rankBalances,
        meta: {
          title: '财富达人排行榜',
          keepAlive: true
        }
      },
      {
        path: '/rank/users/income',
        component: rankIncome,
        meta: {
          title: '收入达人排行榜',
          keepAlive: true
        }
      },
      {
        path: '/rank/users/question-experts',
        component: rankQuestionExports,
        meta: {
          title: '社区专家排行榜',
          keepAlive: true
        }
      },
      {
        path: '/rank/users/question-likes',
        component: rankQuestionLikes,
        meta: {
          title: '问答达人排行榜',
          keepAlive: true
        }
      },
      {
        path: '/rank/users/checkin',
        component: rankCheckinLikes,
        meta: {
          title: '社区签到排行榜',
          keepAlive: true
        }
      },
      {
        path: '/rank/q/:time',
        component: rankQuestionList,
        meta: {
          // keepAlive: true,
          title: '问答排行榜'
        }
      },
      {
        path: '/rank/f/:time',
        component: rankFeedList,
        meta: {
          // keepAlive: true,
          title: '动态排行榜'
        }
      },
      {
        path: '/rank/n/:time',
        component: rankNewsList,
        meta: {
          // keepAlive: true,
          title: '资讯排行榜'
        }
      },
      /* 圈子 */
      {
        path: '/group',
        component: group,
        meta: { title: '圈子', keepAlive: true, requiresAuth: true }
      },
      {
        path: '/group/detail/:groupID',
        component: groupDetail,
        meta: { title: '圈子详情', keepAlive: true, requiresAuth: true }
      },
      {
        name: 'groupMember',
        path: '/group/:groupID/member',
        component: groupMember,
        meta: {
          title: '成员管理'
        }
      },
      {
        name: 'groupPermissions',
        path: '/group/:groupID/permissions',
        component: groupPermissions,
        meta: {
          title: '发帖权限'
        }
      },
      {
        name: 'groupEdit',
        path: '/group/:groupID/edit',
        component: groupEdit,
        meta: {
          title: '修改资料'
        }
      },
      {
        name: 'groupFeedDetail',
        path: '/group/:groupID/feed/:feedID',
        component: groupFeedDetail,
        meta: {
          title: '帖子详情'
        }
      },
      {
        path: '/group/all',
        component: groupAll,
        meta: { title: '全部圈子', keepAlive: true, requiresAuth: true }
      },
      {
        path: 'profile/group',
        component: profileGroup,
        meta: { title: '我的圈子', requiresAuth: true },
        redirect: 'profile/group/groups',
        children: [
          {
            path: 'groups',
            name: 'profileGroupGroups',
            component: profileGroupGroup,
            meta: { keepAlive: true }
          },
          {
            path: 'posts',
            name: 'profileGroupPosts',
            component: profileGroupPosts,
            meta: { keepAlive: true }
          }
        ]
      },

      /* 我加入的圈子 */
      {
        path: '/group/joined',
        component: groupJoined,
        meta: { title: '我的圈子', keepAlive: true, requiresAuth: true }
      } /* 创建圈子 */,
      {
        name: 'groupSearch',
        path: '/group/search',
        component: groupSearch,
        meta: { title: '我的圈子', keepAlive: true, requiresAuth: true }
      } /* 搜索圈子 */,
      {
        path: '/group/add',
        component: addGroup,
        meta: { title: '创建圈子', keepAlive: true, requiresAuth: true },
        children: [
          {
            path: 'category',
            component: chooseCategory,
            meta: { title: '选择分类', keepAlive: true }
          }
        ]
      },

      // { path: '/question', component: question, meta: { title: '问答' } }, /* 问答 */

      {
        path: '/feed/:type',
        component: feed,
        meta: { title: '动态', keepAlive: true }
      } /* 动态 */,

      { path: '/feed-detail/:feedID', component: feedDetail } /* 动态详情 */,

      /**
       * 消息页面路由
       */
      {
        path: '/message',
        component: MessageMain,
        redirect: '/message/msg',
        meta: {
          title: '消息',
          requiresAuth: true
        },
        children: [
          {
            path: 'msg',
            component: msg,
            meta: {
              title: '消息',
              requiresAuth: true
            }
          },
          {
            path: 'notification',
            component: notification,
            meta: {
              title: '通知',
              requiresAuth: true
            }
          }
        ]
      },
      {
        path: '/message/comments',
        component: msgComments,
        meta: {
          title: '评论我的',
          requiresAuth: true
        }
      },
      {
        path: '/message/likes',
        component: msgLikes,
        meta: {
          title: '赞过我的',
          requiresAuth: true
        }
      },
      {
        path: '/message/audits',
        component: msgAudits,
        meta: {
          title: '审核列表',
          requiresAuth: true
        }
      },
      {
        path: '/message/audits',
        component: msgAudits,
        redirect: '/message/audits/feedcomments',
        meta: {
          title: '审核列表',
          requiresAuth: true
        },
        children: [
          {
            path: 'feedcomments',
            component: feedCommentAudit,
            meta: {
              title: '动态评论置顶'
            }
          },
          {
            path: 'newscomments',
            component: newsCommentAudit,
            meta: {
              title: '文章评论置顶'
            }
          },
          {
            path: 'groupposts',
            component: groupPostAudit,
            meta: {
              title: '帖子评论置顶'
            }
          },
          {
            path: 'groupcomments',
            component: groupCommentAudit,
            meta: {
              title: '帖子置顶'
            }
          },
          {
            path: 'groupjoins',
            component: groupJoinAudit,
            meta: {
              title: '圈子加入申请'
            }
          }
        ]
      },
      /**
       * 消息页面路由结束
       */

      {
        path: '/wallet',
        component: wallet,
        meta: {
          title: '钱包',
          requiresAuth: true
        }
      },
      {
        path: '/wallet/recharge',
        component: WalletRecharge,
        meta: {
          title: '充值'
        }
      },
      {
        path: '/wallet/withdraw',
        component: WalletWithdraw,
        meta: {
          title: '提现'
        }
      },
      {
        path: '/wallet/detail',
        component: WalletDetail,
        meta: {
          title: '明细'
        }
      },

      /* 公共页面 */

      {
        path: '/user/:Uid',
        component: userHome,
        meta: { title: '个人主页', keepAlive: true }
      } /* 个人主页 */,
      {
        path: '/search_user/',
        component: searchUser,
        meta: { title: '搜索用户', keepAlive: true }
      } /* 搜索用户 */,
      {
        path: '/tags',
        component: chooseTags,
        meta: { title: '选择标签' }
      } /* 选择标签 */,
      {
        path: '/location',
        component: chooseLocation,
        meta: { title: '选择位置' }
      } /* 定位 */,

      {
        path: '/post/wenzi',
        component: postWenzi,
        meta: {
          keepAlive: true,
          title: '发布文字',
          requiresAuth: true
        }
      },
      {
        path: '/post/fatie',
        name: 'postGroupFeed',
        component: postGroupFeed,
        meta: {
          keepAlive: true,
          title: '发布帖子',
          requiresAuth: true
        }
      },
      {
        path: '/setting',
        component: setting,
        meta: {
          title: '设置',
          requiresAuth: true
        }
      },
      {
        path: '/forgot',
        component: forgot,
        meta: {
          title: '忘记密码'
        }
      },
      { path: '/upgrade', component: upgrade } /* 网站升级中 */,
      {
        path: '/about',
        component: about,
        meta: {
          title: '关于我们'
        }
      },
      { path: '*', component: NotFound } /* 404 页面 */
    ]
  }
];

export default router;
