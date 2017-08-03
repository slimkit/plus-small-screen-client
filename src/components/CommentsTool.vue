<template>
    <div style="padding-top: 2wv;">
      <ul>
        <li v-for="(comment, commentIndex) in commentsData" :key="comment.id" v-if="commentIndex < 3">
          <p>
            <router-link v-if="comment.user_id" :class="$style.userName" :to="{ path: `/users/feeds/${comment.user_id}` }">{{ getUserName(comment.user_id) }}</router-link> 
            <span v-if="comment.reply_to_user_id" :class="$style.commentContent">
              回复
            </span>
            <router-link v-if="comment.reply_to_user_id" :class="$style.userName" :to="{ path: `/users/feeds/${comment.reply_to_user_id}` }">{{ getUserName(comment.reply_to_user_id) }}</router-link> 
            <span
              v-if="comment.user_id  != currentUser.user_id"
              @click.stop="focusInput(comment.user_id)"
              :class="$style.commentContent"
            > 
             : {{ comment.body }}
            </span>
            <span
              v-if="comment.user_id == currentUser.user_id"
              @click.stop="showComfirm(comment.id, feed.feed.feed_id, commentIndex)"
              :class="$style.commentContent"
            > 
             : {{ comment.body }}
            </span>
          </p>
        </li>
      </ul>
      <router-link v-if="hasMore" :class="$style.userName" :to="`/feed/${feed.feed.feed_id}`">查看全部评论</router-link>
    </div>
</template>

<script>
  import { getUserInfo, getUsersInfo } from '../utils/user';
  import { createAPI, addAccessToken } from '../utils/request';
  import router from '../routers/index';
  import Comfirm from '../utils/Comfirm';
  import { CONFIRM } from '../stores/types';
  import { USERS, COMMENTINPUT, CLOSECOMMENTINPUT, NOTICE, FEEDSFOLLOWING, FEEDSFOLLWOINGADD, FEEDFOLLOWINGUPDATE, FEEDSHOT, FEEDSHOTADD, FEEDHOTUPDATE, FEEDSNEW, FEEDSNEWADD, FEEDNEWUPDATE, FEEDFOLLOWINGPREPEND, FEEDNEWPREPEND, FEEDHOTPREPEND, UPDATEFEED } from '../stores/types';
  import lodash from 'lodash';

  const commentsTool = {
    props: [
      'feed'
    ],
    components: {
      Comfirm
    },
    data: () => ({
      more: false, // 查看全部
      replyToUserId: 0, // 回复谁
      toFeed: 0, // 评论哪条动态
      sending: false, // 是否发送中
      deleteData: {} // 删除评论时传递的数据对象
    }),
    methods: {
      focusInput (comment_to_uid) {
        let to_user = this.$storeLocal.get(`user_${comment_to_uid}`);
        let to_user_name = ''; // 回复谁 用户名
        let show = true; // 展示输入框
        let feed = this.feed;
        let reply_to_user_id = comment_to_uid;
        if (!lodash.keys(to_user).length) {
          getUserInfo(comment_to_uid, 30).then( user => {
            to_user = user;
            to_user_name = to_user.name;
          });
        } else {
          to_user_name = to_user.name;
        }
        this.$store.dispatch(COMMENTINPUT, cb => {
          cb({
            data: {
              show,
              reply_to_user_id,
              to_user_name,
              feed
            }
          });
        })
      },
      /**
       * [showComfirm description]
       * @param  {[type]} commentId  [description]
       * @param  {[type]} feedId     [description]
       * @param  {[type]} index      评论索引
       * @return {[type]}            [description]
       */
      showComfirm (commentId, feedId, index) {
        this.$store.dispatch(CONFIRM, cb => {
          cb({
            show: true,
            confirmContent: '删除动态',
            data: {
              comment_id: commentId,
              feed_id: feedId,
              index: index
            },
            confirm: this.deleteComment
          })
        })
      },
      deleteComment (close, data) {
        let feed = this.feed;
        addAccessToken().delete(createAPI(`feeds/${data.feed_id}/comment/${data.comment_id}`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          feed.comments.splice(data.index, 1);
          feed.tool.feed_comment_count -= 1;
          this.$store.dispatch(UPDATEFEED, cb => cb({
            feed
          }));
        })
      },
      getUserName (user_id) {
        let { [user_id]: { name = '' } = {} } = this.users;
        return name;
      }
    },
    computed: {
      hasMore () {
        return this.feed.comments.length > 2;
      },
      users () {
        return this.$store.getters[USERS];
      },
      currentUser () {
        return this.$storeLocal.get('UserLoginInfo');
      },
      commentsData () {
        return this.feed.comments;
      }
    },
    created () {
      let user_ids_obj = {};
      this.feed.comments.forEach( (comment, index) => {
        if(comment.reply_to_user_id) {
          user_ids_obj = { ...user_ids_obj, [comment.user_id]: comment.user_id, [comment.reply_to_user_id]: comment.reply_to_user_id };
        } else {
          user_ids_obj = { ...user_ids_obj, [comment.user_id]: comment.user_id };
        }
      });
      let user_ids = lodash.values(user_ids_obj);
      this.$store.dispatch(USERS, cb => getUsersInfo(user_ids).then(users => cb(users)));
    }
  };

  export default commentsTool;
</script>

<style lang="scss" module>
  .userName {
    font-size: 13px;
    color: #333;
    border-bottom: none!important;
  }
  .commentContent{
    font-size: 14px;
    color: #999;
  }
</style>
