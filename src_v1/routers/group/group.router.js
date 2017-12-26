// 圈子
const Group = () =>
    import( /* webpackChunkName: "group" */ "../../views/group/Group");
const GroupList = () =>
    import( /* webpackChunkName: "group" */ "../../views/group/GroupList");
const GroupDetail = () =>
    import( /* webpackChunkName: "group" */ "../../views/group/GroupDetail");
const GroupFeedDetail = () =>
    import( /* webpackChunkName: "group" */ "../../views/group/GroupFeedDetail");

export default [{
    path: '/group',
    component: Group,
    name: 'group',
    meta: {
        title: '圈子',
        keywords: '圈子',
        requiresAuth: true,
        scrollToTop: true,
    },
    redirect: '/group/list/mine',
    children: [{
        path: 'list/:type',
        component: GroupList
    }]
}, {
    path: '/group/:id',
    component: GroupDetail,
    name: 'group-detail',
    meta: {
        title: '圈子详情',
        keywords: '圈子详情',
        requiresAuth: true,
        scrollToTop: true,
    }
}, {
    path: '/groups/:groupID/feed/:feedID',
    component: GroupFeedDetail
}];