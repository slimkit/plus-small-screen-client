/* eslint-disable one-var */
const // 我的圈子
  profileGroup = () =>
    import(/* webpackChunkName: 'profile' */ '../page/profile/children/profileGroup'),
  profileGroupGroup = () =>
    import(/* webpackChunkName: 'profile' */ '../page/profile/children/profileGroup.group'),
  profileGroupPosts = () =>
    import(/* webpackChunkName: 'profile' */ '../page/profile/children/profileGroup.posts'),
  group = () => import(/* webpackChunkName: 'group' */ '../page/group/group'),
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
  groupMember = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/groupMember'),
  groupPermissions = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/groupPermissions'),
  groupEdit = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/groupEdit'),
  groupFeedDetail = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/children/groupFeedDetail');
// question = () =>
// import(/* webpackChunkName: 'question' */ '../page/question/question'),

export default [
  /* 圈子 */
  {
    path: '/group',
    component: group,
    meta: { title: '圈子', keepAlive: true, requiresAuth: true }
  },
  {
    path: '/group/detail/:groupID',
    component: groupDetail,
    meta: { title: '圈子详情', keepAlive: true, requiresAuth: true }
  },
  {
    name: 'groupMember',
    path: '/group/:groupID/member',
    component: groupMember,
    meta: {
      title: '成员管理'
    }
  },
  {
    name: 'groupPermissions',
    path: '/group/:groupID/permissions',
    component: groupPermissions,
    meta: {
      title: '发帖权限'
    }
  },
  {
    name: 'groupEdit',
    path: '/group/:groupID/edit',
    component: groupEdit,
    meta: {
      title: '修改资料'
    }
  },
  {
    name: 'groupFeedDetail',
    path: '/group/:groupID/feed/:feedID',
    component: groupFeedDetail,
    meta: {
      title: '帖子详情'
    }
  },
  {
    path: '/group/all',
    component: groupAll,
    meta: { title: '全部圈子', keepAlive: true, requiresAuth: true }
  },
  {
    path: 'profile/group',
    component: profileGroup,
    meta: { title: '我的圈子', requiresAuth: true },
    redirect: 'profile/group/groups',
    children: [
      {
        path: 'groups',
        name: 'profileGroupGroups',
        component: profileGroupGroup,
        meta: { keepAlive: true }
      },
      {
        path: 'posts',
        name: 'profileGroupPosts',
        component: profileGroupPosts,
        meta: { keepAlive: true }
      }
    ]
  },

  /* 我加入的圈子 */
  {
    path: '/group/joined',
    component: groupJoined,
    meta: { title: '我的圈子', keepAlive: true, requiresAuth: true }
  } /* 创建圈子 */,
  {
    name: 'groupSearch',
    path: '/group/search',
    component: groupSearch,
    meta: { title: '我的圈子', keepAlive: true, requiresAuth: true }
  } /* 搜索圈子 */,
  {
    path: '/group/add',
    component: addGroup,
    meta: { title: '创建圈子', keepAlive: true, requiresAuth: true },
    children: [
      {
        path: 'category',
        component: chooseCategory,
        meta: { title: '选择分类', keepAlive: true }
      }
    ]
  }
];
