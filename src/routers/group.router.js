// 圈子
import Group from "../views/group/Group";
import GroupList from "../views/group/GroupList";
import GroupDetail from "../views/group/GroupDetail";
import GroupFeedDetail from "../views/group/GroupFeedDetail";

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