import App from '../App';
import NotFound from '../page/notFound'

const feed = () =>
    import(/* webpackChunkName: 'feed' */ '../page/feed/feed'),
    discover = () =>
    import('../page/discover/discover'),
    message = () =>
    import(/* webpackChunkName: 'message' */'../page/message/message'),
    profile = () =>
    import(/* webpackChunkName: 'profile' */ '../page/profile/profile'),

    news = () =>
    import(/* webpackChunkName: 'news' */ '../page/news/news'),
    group = () =>
    import(/* webpackChunkName: 'group' */'../page/group/group'),
    question = () =>
    import(/* webpackChunkName: 'question' */'../page/question/question'),
    rank = () =>
    import(/* webpackChunkName: 'rank' */'../page/rank/rank'),
    find = () =>
    import(/* webpackChunkName: 'find' */'../page/find/find');

const router = [{
    path: '/',
    component: App, /* 顶层路由 */
    children: [

        /* 基础入口 */
        { path: '', redirect: '/feed/new' }, 
        { path: '/profile', component: profile, meta: { title: '我' } }, /* 个人中心 */
        { path: '/discover', component: discover, meta: { title: '发现' } }, /* 发现 */

        /* 功能页面 */
        { path: '/news', component: news, meta: { title: '资讯' } }, /* 资讯 */
        { path: '/find', component: find, meta: { title: '找人' } }, /* 找人 */
        { path: '/rank', component: rank, meta: { title: '排行' } }, /* 排行 */
        { path: '/group', component: group, meta: { title: '圈子' } }, /* 圈子 */
        { path: '/question', component: question, meta: { title: '问答' } }, /* 问答 */
        { path: '/feed/:type', component: feed, meta: { keepAlive: true } }, /* 动态 */
        { path: '/message/:type', component: message, meta: { keepAlive: true } }, /* 消息 */
        
        { path: '*', component: NotFound }, /* 404 页面 */
    ]
}];

export default router;