/**
 * 消息页面组件
 * @Author   Wayne
 * @DateTime 2018-01-29
 * @Email    qiaobin@zhiyicx.com
 * @return   {[type]}            [description]
 */
const MessageMain = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/message");
const msg = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/children/msg");
const notification = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/children/notification");
const msgComments = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/list/comments");
const msgLikes = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/list/likes");
const msgAudits = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/list/audits");
const feedCommentAudit = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/children/audits/feedCommentAudit");
const newsCommentAudit = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/children/audits/newsCommentAudit");
const groupPostAudit = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/children/audits/groupPostAudit");
const groupCommentAudit = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/children/audits/groupCommentAudit");
const groupJoinAudit = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/children/audits/groupJoinAudit");
const chats = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/chats");
const chatRoom = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message/chat/chatRoom");

const MessageIndex = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message2/index.vue");
const info = () =>
  import(/* webpackChunkName: 'message' */ "@/page/message2/info/index.vue");

export default [
  {
    path: "/message",
    component: MessageIndex,
    redirect: "/message/info",
    meta: {
      title: "消息",
      requiresAuth: true
    },
    children: [
      {
        path: "msg",
        component: msg,
        meta: {
          title: "消息",
          requiresAuth: true
        }
      },
      {
        path: "info",
        component: info,
        meta: {
          title: "消息",
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: "/chats",
    component: chats,
    meta: {
      title: "聊天",
      requiresAuth: true
    }
  },
  {
    path: "/chats/:uid(\\d+)",
    component: chatRoom,
    meta: {
      title: "对话",
      requiresAuth: true
    }
  },
  {
    path: "/message/notification",
    component: notification,
    meta: {
      title: "通知",
      requiresAuth: true
    }
  },
  {
    path: "/message/comments",
    component: msgComments,
    meta: {
      title: "评论我的",
      requiresAuth: true
    }
  },
  {
    path: "/message/likes",
    component: msgLikes,
    meta: {
      title: "赞过我的",
      requiresAuth: true
    }
  },
  {
    path: "/message/audits",
    component: msgAudits,
    meta: {
      title: "审核列表",
      requiresAuth: true
    }
  },
  {
    path: "/message/audits",
    component: msgAudits,
    redirect: "/message/audits/feedcomments",
    meta: {
      title: "审核列表",
      requiresAuth: true
    },
    children: [
      {
        path: "feedcomments",
        component: feedCommentAudit,
        meta: {
          title: "动态评论置顶"
        }
      },
      {
        path: "newscomments",
        component: newsCommentAudit,
        meta: {
          title: "文章评论置顶"
        }
      },
      {
        path: "groupposts",
        component: groupPostAudit,
        meta: {
          title: "帖子评论置顶"
        }
      },
      {
        path: "groupcomments",
        component: groupCommentAudit,
        meta: {
          title: "帖子置顶"
        }
      },
      {
        path: "groupjoins",
        component: groupJoinAudit,
        meta: {
          title: "圈子加入申请"
        }
      }
    ]
  }
];
