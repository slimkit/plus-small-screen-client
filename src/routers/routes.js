import App from '../App'
import signin from '../page/signin'
import signup from '../page/signup'
import NotFound from '../page/notFound'
import upgrade from '../page/upgrade'

/* eslint-disable one-var */
const
  feed = () =>
  import(/* webpackChunkName: 'feed' */ '../page/feed/feed'),
  feedDetail = () =>
  import(/* webpackChunkName: 'feed' */ '../page/feed/components/feedDetail'),
  discover = () =>
  import(/* webpackChunkName: 'common' */ '../page/discover/discover'),
  message = () =>
  import(/* webpackChunkName: 'message' */ '../page/message/message'),
  profile = () =>
  import(/* webpackChunkName: 'profile' */ '../page/profile/profile'),

  // 我的圈子
  profileGroup = () =>
  import(/* webpackChunkName: 'profile' */ '../page/profile/children/profileGroup'),
  profileGroupGroup = () =>
  import(/* webpackChunkName: 'profile' */ '../page/profile/children/profileGroup.group'),
  profileGroupPosts = () =>
  import(/* webpackChunkName: 'profile' */ '../page/profile/children/profileGroup.posts'),

  news = () =>
  import(/* webpackChunkName: 'news' */ '../page/news/news'),

  group = () =>
  import(/* webpackChunkName: 'group' */ '../page/group/group'),

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


  question = () =>
  import(/* webpackChunkName: 'question' */ '../page/question/question'),

  // 排行榜
  rank = () =>
  import(/* webpackChunkName: 'rank' */ '../page/rank/rank'),
  rankUsers = () =>
  import(/* webpackChunkName: 'rank' */ '../page/rank/children/users'),
  rankQuestions = () =>
  import(/* webpackChunkName: 'rank' */ '../page/rank/children/questions'),
  rankFeeds = () =>
  import(/* webpackChunkName: 'rank' */ '../page/rank/children/feeds'),
  rankNews = () =>
  import(/* webpackChunkName: 'rank' */ '../page/rank/children/news'),

  // 找人
  find = () =>
  import(/* webpackChunkName: 'find' */ '../page/find/find'),
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
  import(/* webpackChunkName: 'common' */ '../page/common/postWenzi')

const router = [{
  path: '/',
  component: App,
  /* 顶层路由 */
  children: [

    /* 基础入口 */
    { path: '', redirect: '/signin' },
    { path: '/signin', component: signin, meta: { title: '登录', forGuest: true } }, /* 登录 */
    { path: '/signup', component: signup, meta: { title: '注册', forGuest: true } }, /* 注册 */
    { path: '/profile', component: profile, meta: { title: '我', requiresAuth: true } }, /* 个人中心 */

    { path: '/discover', component: discover, meta: { title: '发现' } }, /* 发现 */

    /* 功能页面 */
    { path: '/news', component: news, meta: { title: '资讯' } }, /* 资讯 */
    {
      path: '/find',
      component: find,
      meta: {
        title: '找人',
        requiresAuth: true
      },
      redirect: '/find/pop',
      children: [{
        path: 'new',
        component: findContent,
        meta: {
          type: 'new',
          title: '最新',
          keepAlive: true
        }
      }, {
        path: 'pop',
        component: findContent,
        meta: {
          type: 'pop',
          title: '热门',
          keepAlive: true
        }
      }, {
        path: 'rec',
        component: findContent,
        meta: {
          type: 'rec',
          title: '推荐',
          keepAlive: true
        }
      }, {
        path: 'nearby',
        component: findNearby,
        meta: {
          title: '附近',
          keepAlive: true
        }
      }]
    }, /* 找人 */
    {
      path: '/rank',
      component: rank,
      meta: { title: '排行' },
      redirect: '/rank/users',
      children: [{
        path: 'users',
        component: rankUsers,
        meta: {
          keepAlive: true
        }
      }, {
        path: 'questions',
        component: rankQuestions,
        meta: {
          keepAlive: true
        }
      }, {
        path: 'feeds',
        component: rankFeeds,
        meta: {
          keepAlive: true
        }
      }, {
        path: 'news',
        component: rankNews,
        meta: {
          keepAlive: true
        }
      }]
    }, /* 排行 */

    /* 圈子 */
    {
      path: '/group',
      component: group,
      meta: { title: '圈子', keepAlive: true, requiresAuth: true }
    }, {
      path: '/group/detail/:groupID',
      component: groupDetail,
      meta: { title: '圈子详情', keepAlive: true, requiresAuth: true }
    }, {
      path: '/group/all',
      component: groupAll,
      meta: { title: '全部圈子', keepAlive: true, requiresAuth: true }
    }, {
      path: 'profile/group',
      component: profileGroup,
      meta: { title: '我的圈子', requiresAuth: true },
      redirect: 'profile/group/groups',
      children: [{
        path: 'groups',
        name: 'profileGroupGroups',
        component: profileGroupGroup,
        meta: { keepAlive: true }
      }, {
        path: 'posts',
        name: 'profileGroupPosts',
        component: profileGroupPosts,
        meta: { keepAlive: true }
      }]
    },

    /* 我加入的圈子 */
    { path: '/group/joined', component: groupJoined, meta: { title: '我的圈子', keepAlive: true, requiresAuth: true } }, /* 创建圈子 */
    { name: 'groupSearch', path: '/group/search', component: groupSearch, meta: { title: '我的圈子', keepAlive: true, requiresAuth: true } }, /* 搜索圈子 */
    {
      path: '/group/add',
      component: addGroup,
      meta: { title: '创建圈子', keepAlive: true, requiresAuth: true },
      children: [{
        path: 'category',
        component: chooseCategory,
        meta: { title: '选择分类', keepAlive: true }
      }]
    },

    { path: '/question', component: question, meta: { title: '问答' } }, /* 问答 */

    { path: '/feed/:type', component: feed, meta: { title: '动态', keepAlive: true } }, /* 动态 */

    { path: '/feed-detail/:feedID', component: feedDetail }, /* 动态详情 */

    { path: '/message/:type', component: message, meta: { title: '消息', keepAlive: true, requiresAuth: true } }, /* 消息 */

    /* 公共页面 */

    { path: '/user/:Uid', component: userHome, meta: { title: '个人主页', keepAlive: true } }, /* 个人主页 */
    { path: '/search_user/', component: searchUser, meta: { title: '搜索用户', keepAlive: true } }, /* 搜索用户 */
    { path: '/tags', component: chooseTags, meta: { title: '选择标签' } }, /* 选择标签 */
    { path: '/location', component: chooseLocation, meta: { title: '选择位置' } }, /* 定位 */

    {
      path: '/post/wenzi',
      component: postWenzi,
      meta: {
        keepAlive: true,
        title: '发布文字',
        requiresAuth: true
      }
    }, {
      path: '/post/fatie',
      name: 'postGroupFeed',
      component: postGroupFeed,
      meta: {
        keepAlive: true,
        title: '发布帖子',
        requiresAuth: true
      }
    },

    { path: '/upgrade', component: upgrade }, /* 网站升级中 */

    { path: '*', component: NotFound } /* 404 页面 */

  ]
}]

export default router
