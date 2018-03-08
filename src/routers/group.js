/* eslint-disable one-var */
const group = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/group'),
  MyGroup = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/MyGroup.vue'),
  MyGroups = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/MyGroup.group.vue'),
  MyPosts = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/MyGroup.posts.vue'),
  MyPosts1 = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/MyPosts.1.vue'),
  MyPosts2 = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/MyPosts.2.vue'),
  MyPosts3 = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/MyPosts.3.vue'),
  MyGroupsJoin = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/MyGroups.join.vue'),
  MyGroupsAudit = () =>
    import(/* webpackChunkName: 'group' */ '../page/group/MyGroups.audit.vue'),
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

export default [
  /* 圈子 */
  {
    path: '/group',
    component: group,
    meta: {
      title: '圈子',
      keepAlive: true,
      requiresAuth: true
    }
  },

  /**
   * 圈子详情
   */
  {
    path: '/group/:groupID(\\d+)',
    component: groupDetail,
    meta: {
      title: '圈子详情',
      keepAlive: true,
      requiresAuth: true
    }
  },

  /**
   * 成员管理
   */
  {
    path: '/group/:groupID(\\d+)/member',
    component: groupMember,
    meta: {
      title: '成员管理'
    }
  },

  /**
   * 权限管理
   */
  {
    path: '/group/:groupID(\\d+)/permissions',
    component: groupPermissions,
    meta: {
      title: '发帖权限'
    }
  },

  /**
   * 修改资料
   */
  {
    name: 'groupEdit',
    path: '/group/:groupID(\\d+)/info',
    component: groupEdit,
    meta: {
      title: '修改资料'
    }
  },

  /**
   * 圈子 - 帖子详情
   */
  {
    path: '/group/:groupID(\\d+)/feed/:feedID(\\d+)',
    component: groupFeedDetail,
    meta: {
      title: '帖子详情'
    }
  },

  /**
   * 全部圈子
   */
  {
    path: '/group/all',
    component: groupAll,
    meta: {
      title: '全部圈子',
      keepAlive: true,
      requiresAuth: true
    }
  },

  /**
   * 个人中心 - 我的圈子 (入口)
   */
  {
    component: MyGroup,
    path: '/own',
    meta: {
      title: '我的圈子',
      requiresAuth: true
    },
    children: [
      {
        path: 'groups',
        component: MyGroups,
        redirect: 'groups/joined',
        children: [
          {
            meta: {
              index: 1,
              head: false
            },
            path: 'joined',
            component: MyGroupsJoin
          },
          {
            meta: {
              index: 2
            },
            path: 'audit',
            component: MyGroupsAudit
          }
        ]
      },
      {
        path: 'posts',
        component: MyPosts,
        redirect: 'posts/1',
        children: [
          {
            meta: {
              index: 1,
              head: false
            },
            path: '1',
            component: MyPosts1
          },
          {
            meta: {
              index: 2,
              head: false
            },
            path: '2',
            component: MyPosts2
          },
          {
            meta: {
              index: 3,
              head: false
            },
            path: '3',
            component: MyPosts3
          }
        ]
      }
    ]
  },

  /**
   * 我加入的圈子
   */
  {
    path: '/group/joined',
    component: groupJoined,
    meta: {
      title: '我的圈子',
      keepAlive: true,
      requiresAuth: true
    }
  },

  /**
   * 搜索圈子
   */
  {
    name: 'groupSearch',
    path: '/group/search',
    component: groupSearch,
    meta: {
      title: '我的圈子',
      keepAlive: true,
      requiresAuth: true
    }
  },

  /**
   * 创建圈子
   */
  {
    path: '/group/add',
    component: addGroup,
    meta: {
      title: '创建圈子',
      keepAlive: true,
      requiresAuth: true
    },
    children: [
      {
        path: 'category',
        component: chooseCategory,
        meta: {
          title: '选择分类',
          keepAlive: true
        }
      }
    ]
  }
];
