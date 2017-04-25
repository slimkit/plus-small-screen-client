import localEvent from '../stores/localStorage';
import { getUserInfo } from './user';
import lodash from 'lodash';

export default function (commentsSource) {
  let newComment = [];
  let max_id = 0;
  commentsSource.forEach((comment, index) => {
    comment.user = {};
    comment.replyToUser = {};
    // 评论用户
    comment.user = localEvent.getLocalItem(`user_${comment.user_id}`);
    if(!lodash.keys(comment.user).length > 0) {
      getUserInfo(comment.user_id, 30, localUser => {
        comment.user = localUser;
      });
    }
    // 被回复的用户
    if(comment.reply_to_user_id) {
      comment.replyToUser = localEvent.getLocalItem(`user_${comment.reply_to_user_id}`);
      if(!lodash.keys(comment.replyToUser).lenght > 0) {
        getUserInfo(comment.reply_to_user_id, localUser => {
          comment.replyToUser = localUser;
        });
      }
    }
    // comment.created_at = new Date(comment.created_at.replace(/-/g, "/"));
    newComment.push(comment);
    max_id = comment.id;
  });
  return {
    comments: newComment,
    max_id: max_id
  }
};
