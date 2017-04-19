/* views */
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import FindPassword from '../views/FindPassword.vue';
import Feeds from '../views/Feeds.vue';
import Home from '../views/Home.vue';
import FeedFollowing from '../views/FeedFollowing';
import FeedHot from '../views/FeedHot';
import FeedNew from '../views/FeedNew';
import FeedDetail from '../views/FeedDetail';
import Profile from '../views/Profile';
import SystemSetting from '../views/SystemSetting';
import ChangePassword from '../views/ChangePassword';
import UserSetting from '../views/UserSetting';
import UserFeeds from '../views/UserFeeds';
import Message from '../views/Message';
import { requestAuth, CanNotGetInWhenLogged } from '../utils/auth';

const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      title: '主页'
    }
  },
  {
    path: '/login',
    component: Login,
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
    meta: {
      title: '注册'
    },
    beforeEnter: (to, from, next) => {
      CanNotGetInWhenLogged(to, from, next)
    }
  },
  {
    path: '/users/message',
    component: Message,
    meta: {
      title: '消息'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }

  },
  {
    path: '/findpassword',
    component: FindPassword,
    meta: {
      title: '找回密码'
    },
    beforeEnter: (to, from, next) => {
      CanNotGetInWhenLogged(to, from, next)
    }
  },
  {
    path: '/feed/:feed_id',
    component: FeedDetail,
    meta: {
      title: '动态详情'
    }
  },
  {
    path: '/users/profile',
    component: Profile,
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
    meta: {
      title: '个人资料',
      keywords: '个人资料'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next);
    }
  },
  {
    path: '/users/feeds/:user_id',
    component: UserFeeds,
    meta: {
      title: '个人主页'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next);
    }
  },
  {
    path: '/feeds',
    component: Feeds,
    meta: {
      title: '动态'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    },
    redirect: '/feeds/following',
    children: [
      {
        path: 'following',
        component: FeedFollowing,
        meta: {
          title: '关注的动态'
        }
      },
      {
        path: 'hot',
        component: FeedHot,
        meta: {
          title: '热门动态'
        }
      },
      {
        path: 'new',
        component: FeedNew,
        meta: {
          title: '最新动态'
        }
      }
    ]
  }
];

export default routes;
