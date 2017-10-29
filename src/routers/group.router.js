// 圈子
import Group from "../views/group/Group";
import GroupList from "../views/group/GroupList";
import GroupDetail from "../views/group/GroupDetail";
import GroupFeedDetail from "../views/group/GroupFeedDetail";
import { requestAuth, CanNotGetInWhenLogged } from '../utils/auth';

export default [{
    path: '/group',
    component: Group,
    name: 'group',
    meta: {
        title: '圈子',
        keywords: '圈子'
    },
    redirect: '/group/list/mine',
    children: [{
        path: 'list/:type',
        component: GroupList
    }],
    beforeEnter: (to, from, next) => {
        requestAuth(to, from, next);
    }
}, {
    path: '/group/:id',
    component: GroupDetail,
    name: 'group-detail',
    meta: {
        title: '圈子详情',
        keywords: '圈子详情'
    },
    children: []
}, {
    path: '/groups/:groupID/feed/:feedID',
    component: GroupFeedDetail
}];