import localEvent from '../stores/localStorage';
import {
  getUserInfo
} from './user';
import lodash from 'lodash';
import {
  resolveImage
} from '../utils/resource';
import storeLocal from 'store';

const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));

export default function(commentsSource) {
  let newComment = [];
  let max_id = 0;
  commentsSource.forEach((comment, index) => {
    comment.user = {};
    comment.replyToUser = {};

    // 评论用户
    let user = storeLocal.get(`user_${comment.user_id}`);
    if(!user) {
      getUserInfo(comment.user_id).then(localUser => {
        comment.user = localUser;
      });
    } else {
      user.avatar = user.avatar || defaultAvatar;
      comment.user = { ...user };
    }

    // 被回复的用户
    if(comment.reply_user) {
      let reply_user = storeLocal.get(`user_${comment.reply_user}`);
      if(!reply_user) {
        getUserInfo(comment.reply_user).then(localUser => {
          comment.replyToUser = localUser;
        });
      } else {
        reply_user.avatar = reply_user.avatar || defaultAvatar;
        comment.replyToUser = { ...reply_user };
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