import localEvent from '../stores/localStorage';
import {
  getUserInfo
} from './user';
import lodash from 'lodash';
import {
  resolveImage
} from '../utils/resource';

const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));

export default function(commentsSource) {
  let newComment = [];
  let max_id = 0;
  commentsSource.forEach((comment, index) => {
    comment.user = {};
    comment.replyToUser = {};
    // 评论用户
    getUserInfo(comment.user_id).then(localUser => {
      comment.user = localUser;
    });
    // 被回复的用户
    if(comment.reply_user) {
      getUserInfo(comment.reply_user).then(localUser => {
        comment.replyToUser = localUser;
      });
    }
    newComment.push(comment);
    max_id = comment.id;
  });
  return {
    comments: newComment,
    max_id: max_id
  }
};