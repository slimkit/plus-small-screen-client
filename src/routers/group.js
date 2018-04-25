/**
 * 圈子路由模块
 */
import group from "@/page/group/group.vue";
import Groups from "@/page/group/Groups.vue";
import GroupsForUser from "@/page/group/GroupsForUser.vue";
export default [
  {
    path: "/group",
    component: group,
    meta: {
      title: "圈子",
      keepAlive: true
    }
  },
  {
    name: "groups",
    path: "/groups",
    component: Groups,
    meta: {
      title: "全部圈子",
      keepAlive: true
    }
  },
  {
    path: "/users/:userID(\\d+)/group",
    component: GroupsForUser,
    meta: {
      title: "TA的圈子",
      keepAlive: true
    }
  }
];
