import App from '../App';
import NotFound from '../page/notFound'

const feed = () =>
    import('../page/feed/feed'),
    discover = () =>
    import('../page/discover/discover'),
    message = () =>
    import('../page/message/message'),
    profile = () =>
    import('../page/profile/profile');
const router = [{
    path: '/',
    component: App, //顶层路由，对应index.html
    children: [
        // 二级路由
        { path: '', redirect: '/feed/new' },
        { path: '/feed/:type', component: feed, meta: { keepAlive: true } },
        { path: '/discover', component: discover, meta: { title: '发现' } },
        { path: '/message/:type', component: message, meta: { keepAlive: true } },
        { path: '/profile', component: profile, meta: { title: '我' } },
        { path: '*', component: NotFound } // 404 页面
    ]
}];

export default router;