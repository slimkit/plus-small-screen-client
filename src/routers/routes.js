/* views */
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import FindPassword from '../views/FindPassword.vue';

// 动态
import Home from '../views/Home.vue';
import Feeds from '../views/Feeds.vue';
import FeedHot from '../views/FeedHot';
import FeedNew from '../views/FeedNew';
import FeedDetail from '../views/FeedDetail';
import FeedDiggList from '../views/FeedDiggList';
import FeedFollowing from '../views/FeedFollowing';

// 我
import Diggs from '../views/Diggs';
import Ranking from '../views/Ranking';
import Profile from '../views/Profile';
import Comments from '../views/Comments';
import UserFeeds from '../views/UserFeeds';
import UserSetting from '../views/UserSetting';
import Collections from '../views/Collections';
import Relationship from '../views/Relationship';

// 设置
import AboutUs from '../views/AboutUs';
import FeedBack from '../views/FeedBack';
import SystemSetting from '../views/SystemSetting';
import ChangePassword from '../views/ChangePassword';

// 发现
import Discover from '../views/Discover';

// 频道
import ChannelIndex from '../views/channel/ChannelIndex';
import ChannelFeeds from '../views/channel/ChannelFeeds';

// 资讯
import NewsIndex from '../views/news/NewsIndex';
import NewsDetail from '../views/news/NewsDetail';
import NewsSearch from '../views/news/NewsSearch';

// 消息
import Message from '../views/Message';
import ImMessage from '../views/ImMessage';

// 找人相关
import FindSomeOne from '../views/findsomeone/FindSomeOne';
import FindContent from '../views/findsomeone/FindContent';
import FindNear from '../views/findsomeone/FindNear';

import { requestAuth, CanNotGetInWhenLogged } from '../utils/auth';

const routes = [
  {
    path: '/',
    redirect: '/login',
    meta: {
      title: 'ThinkSNS+'
    }
  },
  {
    path: '/login',
    component: Login,
    name: 'login',
    meta: {
      title: '登录'
    },
    beforeEnter: (to, from, next) => {
      CanNotGetInWhenLogged(to, from, next)
    }
  },
  {
    path: '/register',
    component: Register,
    name: 'register',
    meta: {
      title: '注册'
    },
    beforeEnter: (to, from, next) => {
      CanNotGetInWhenLogged(to, from, next)
    }
  },
  {
    path: '/findpassword',
    component: FindPassword,
    name: 'findPassword',
    meta: {
      title: '找回密码'
    },
    beforeEnter: (to, from, next) => {
      CanNotGetInWhenLogged(to, from, next)
    }
  },
  {
    path: '/feeds',
    component: Feeds,
    name: 'feedsList',
    meta: {
      title: '动态'
    },
    redirect: '/feeds/new',
    children: [
      {
        path: 'following',
        component: FeedFollowing,
        name: 'followingFeeds',
        meta: {
          title: '关注的动态'
        },
        beforeEnter: (to, from, next) => {
          requestAuth(to, from, next)
        }
      },
      {
        path: 'hot',
        component: FeedHot,
        name: 'hotFeeds',
        meta: {
          title: '热门动态'
        }
      },
      {
        path: 'new',
        component: FeedNew,
        name: 'newFeeds',
        meta: {
          title: '最新动态'
        }
      }
    ]
  },
  {
    path: '/feed/:feed_id',
    component: FeedDetail,
    name: 'feedDetail',
    meta: {
      title: '动态详情'
    }
  },
  {
    path: '/feed/:feed_id/diggs',
    component: FeedDiggList,
    name: 'feedDiggs',
    meta: {
      title: '点赞列表'
    }
  },
  {
    path: '/users/feeds/:user_id',
    component: UserFeeds,
    name: 'userSpace',
    meta: {
      title: '个人主页'
    }
  },
  {
    path: '/discover',
    component: Discover,
    meta: {
      title: '发现'
    }
  },
  {
    path: '/news',
    component: NewsIndex,
    name: 'newsIndex',
    meta: {
      title: '资讯'
    }
  },
  {
    path:'/news/:news_id/detail',
    component: NewsDetail,
    name: 'newsDetail',
    meta: {
      title: '资讯详情'
    }
  },
  {
    path: '/news/search',
    component: NewsSearch,
    name: 'newsSearch',
    meta: {
      title: '资讯搜索'
    }
  },
  {
    path: '/channel',
    component: ChannelIndex,
    name: 'channelIndex',
    meta: {
      title: '频道'
    }
  },
  {
    path: '/channel/:id',
    component: ChannelFeeds,
    name: 'channelDetail',
    meta: {
      title: '频道列表'
    }
  },
  {
    path: '/users/message',
    component: Message,
    name: 'myMessage',
    meta: {
      title: '消息'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  {
    path: '/users/message/:user_id/:cid',
    component: ImMessage,
    name: 'imMessage',
    meta: {
      title: 'Chat'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  {
    path: '/users/diggs',
    component: Diggs,
    name: 'myDiggs',
    meta: {
      title: '赞'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  {
    path: '/users/ranking',
    component: Ranking,
    name: 'diggRanking',
    meta: {
      title: '排行榜'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  {
    path: '/users/relationship/:user_id/:status',
    component: Relationship,
    name: 'relationship',
    meta: {
      title: '粉丝/关注'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  {
    path: '/users/mycomments',
    component: Comments,
    name: 'myComments',
    meta: {
      title: '评论'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  {
    path: '/users/collections',
    component: Collections,
    name: 'myCollections',
    meta: {
      title: '收藏'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  {
    path: '/users/profile',
    component: Profile,
    name: 'myProfile',
    meta: {
      title: '我'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  {
    path: '/users/systemSetting',
    component: SystemSetting,
    name: 'systemSetting',
    meta: {
      title: '设置'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  {
    path: '/users/password',
    component: ChangePassword,
    name: 'changePassword',
    meta: {
      title: '修改密码'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next);
    }
  },
  {
    path: '/users/setting',
    component: UserSetting,
    name: 'mySetting',
    meta: {
      title: '个人资料',
      keywords: '个人资料'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next);
    }
  },{
    path: '/users/feedback',
    component: FeedBack,
    name: 'feedBack',
    meta: {
      title: '意见反馈',
      keywords: '意见反馈'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next);
    }
  },{
    path: '/about',
    component: AboutUs,
    name: 'aboutUs',
    meta: {
      title: '关于我们',
      keywords: '关于我们'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next);
    }
  },
  {
    path: '/findsomeone',
    component: FindSomeOne,
    meta: {
      title: '找人'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next);
    },
    redirect: '/findsomeone/list/populars',
    children: [{
      path: 'list/:type',
      component: FindContent,
      meta: {
        title: '找人'
      }
    },
    {
      name:"near",
      path: 'near',
      component: FindNear,
      meta: {
        title: '找人'
      }
    }]
  },
  { path: '*', redirect: '/' }
];

export default routes;
