import localEvent from '../stores/localStorage';
import { getUserInfo } from './user';
import lodash from 'lodash';
import { resolveImage } from '../utils/resource';

const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));

export default function (commentsSource) {
  let newComment = [];
  let max_id = 0;
  commentsSource.forEach((comment, index) => {
    comment.user = {};
    comment.replyToUser = {};
    // 评论用户
    comment.user = localEvent.getLocalItem(`user_${comment.user_id}`);
    if(!lodash.keys(comment.user).length) {
      getUserInfo(comment.user_id, 30).then( localUser => {
        comment.user = localUser;
      });
    }
    // 被回复的用户
    if(comment.reply_to_user_id) {
      comment.replyToUser = localEvent.getLocalItem(`user_${comment.reply_to_user_id}`);
      if(!lodash.keys(comment.replyToUser).length) {
        getUserInfo(comment.reply_to_user_id, 30).then( localUser => {
          comment.replyToUser = localUser;
        });
      }
    }
    newComment.push(comment);
    max_id = comment.id;
  });
  return {
    comments: newComment,
    max_id: max_id
  }
};
