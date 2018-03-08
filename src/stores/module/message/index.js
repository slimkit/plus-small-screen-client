import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const state = {
  UNREAD_COUNT: {
    msg: {
      comments: {
        count: 0,
        placeholder: '',
        lastUsers: [],
        time: ''
      },
      diggs: {
        count: 0,
        placeholder: '',
        lastUsers: [],
        time: ''
      },
      audits: {
        placeholder: '暂无未审核的申请',
        newsCommentCount: 0,
        feedCommentCount: 0,
        groupPostCommentCount: 0,
        groupJoinCount: 0,
        groupPostCount: 0
      }
    },
    notification: false
  },
  MY_COMMENTED: [],
  MY_LIKED: [],
  MY_COMMENT_AUDIT: [],
  MY_POST_AUDIT: [],
  MY_POST_COMMENT_AUDIT: [],
  MY_NEWS_COMMENT_AUDIT: [],
  MY_GROUP_JOIN_AUDIT: []
};

export default {
  getters,
  actions,
  mutations,
  state
};
