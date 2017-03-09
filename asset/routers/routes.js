/* views */
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import FindPassword from '../views/FindPassword.vue';
import Feeds from '../views/Feeds.vue';
import Home from '../views/Home.vue';
import FeedFollowing from '../views/FeedFollowing';
import FeedAll from '../views/FeedAll';
import FeedNew from '../views/FeedNew';
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
        path: 'all',
        compoenet: FeedAll,
        meta: {
          title: '全部动态'
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
