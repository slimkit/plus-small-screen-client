/**
 * 格式化后的 router
 */

// base
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import FindPassword from '../views/FindPassword.vue';

// 动态
import feed from './feed/feed.router';
// 我
import mine from './mine/mine.router';
// 圈子
import group from './group/group.router';

import other from './other/other.router';

const base = [
    { path: '*', redirect: '/feed/new', meta: { title: 'ThinkSNS+' } },
    {
        path: '/login',
        component: Login,
        name: 'login',
        meta: {
            title: '登录',
            canEnterOrNot: true
        }
    }, {
        path: '/register',
        component: Register,
        name: 'register',
        meta: {
            title: '注册',
            canEnterOrNot: true
        }
    }, {
        name: 'forgot',
        path: '/forgot',
        component: FindPassword,
        meta: {
            title: '找回密码',
            canEnterOrNot: true
        }
    }
];

const routes = [
    ...base,
    ...feed,
    ...group,
    ...mine,
    ...other
];

export default routes;