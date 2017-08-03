<template>
  <div>
    <div :class="$style.tool">
      <div :class="$style.toolItem">
        <DiggIcon v-if="isDigg" width="21" @click.native="cannelDigg" height="21" color="#f4504d" />
        <UnDiggIcon  v-else @click.native="sendDigg" width="21" height="21" color="#999" />
        <span :class="$style.count">{{ friendnum(feed.like_count) }}</span>
      </div>
      <div :class="$style.toolItem" @click="handleCommentInput(true)">
        <CommentIcon width="21" height="21" color="#999" />
        <span :class="$style.count">{{ friendnum(feed.feed_comment_count) }}</span>
      </div>
      <div :class="$style.toolItem" @click="changeUrl(`/feed/${feed.id}`)">
        <ViewIcon width="21" height="21" color="#999" />
        <span :class="$style.count">{{ friendnum(feed.feed_view_count) }}</span>
      </div>
      <div :class="$style.toolItem" @click="handleShowPopup(true)">
        <MoreIcon width="21" height="21" color="#999" />
      </div>
    </div>
    <ul :class="$style.comment" v-if="openInputByVuex" ref="commentInput">
      <li>
        <Input 
          type="textarea" 
          ref="commentInput"
          class="commentInput"
          :autosize="{ minRows: 1, maxRows: 4 }" 
          :minlength='1' 
          :maxlength='255'
          :autofocus="true"
          v-model="commentAbout.body"
          :placeholder="commentAbout.placeholder"
          v-childfocus
        />
      </li>
      <li :class="$style.commentOperations">
        <p :class="$style.commentOperation" v-show="commentCount > 100">
          <span :class="{ inputFull: commentCount > 100 }">{{ commentCount }}</span>/255
        </p>
        <Button :class="$style.commentOperation" type="text" class="sendButton" size="small" @click.native="handleCommentInput(false)">取消</Button>
        <Button 
          :class="$style.commentOperation" 
          type="primary" 
          class="sendButton" 
          :disabled="!validComment" 
          size="small" 
          @click.native="sendComment()"
        >
          发送
        </Button>
      </li>
    </ul>
    <div style="padding-top: 2wv;" v-if="commentsData.length">
      <ul>
        <li v-for="(comment, commentIndex) in commentsData" :key="comment.id">
          <p>
            <router-link 
              v-if="comment.user_id" 

              :class="$style.userName" 
              :to="{ path: `/users/feeds/${comment.user_id}` }"
            >
              {{ getUserName(comment.user_id) }}
            </router-link> 
            <span v-if="comment.reply_user" :class="$style.commentContent">
              回复
            </span>
            <router-link 
              v-if="comment.reply_user" 
              :class="$style.userName" 
              :to="{ path: `/users/feeds/${comment.reply_user}` }"
            >
              {{ getUserName(comment.reply_user) }}
            </router-link> 
            <span
              v-if="comment.user_id  != currentUser"
              @click.stop="handleCommentInput(true, comment.user_id)"
              :class="$style.commentContent"
            > 
             : {{ comment.body }}
            </span>
            <span
              v-else
              @click.stop="showComfirm(comment.id, feed.id, commentIndex)"
              :class="$style.commentContent"
            > 
             : {{ comment.body }}
            </span>
          </p>
        </li>
      </ul>
      <router-link v-if="hasMore" :class="$style.userName" :to="`/feed/${feed.id}#comments`">查看全部评论</router-link>
    </div>
  </div>
</template>

<script>
  import { friendNum } from '../utils/friendNum';
  import { createAPI, addAccessToken } from '../utils/request';
  import { 
    NOTICE, 
    COMMENTINPUT, 
    UPDATEFEED, 
    USERS, 
    USERS_APPEND,
    CONFIRM, 
    CLOSECOMMENTINPUT, 
    SHOWPOPUP, 
    CLOSEPOPUP,
    FEEDSLIST
  } from '../stores/types';
  import { goTo, changeUrl } from '../utils/changeUrl';
  import ViewIcon from '../icons/View';
  import CommentIcon from '../icons/Comment';
  import DiggIcon from '../icons/Digg';
  import UnDiggIcon from '../icons/UnDigg';
  import MoreIcon from '../icons/More';
  import getLocalTime from '../utils/getLocalTime';
  import LoadingWhiteIcon from '../icons/LoadingWhite';
  import lodash from 'lodash';
  import { getUsersInfo, getUserInfo } from '../utils/user';
  import Comfirm from '../utils/Comfirm';

  const FeedTool = {
    components: {
      CommentIcon,
      ViewIcon,
      DiggIcon,
      UnDiggIcon,
      MoreIcon
    },
    props: [
      'feed',
      'user',
      'openInput',
      'showPopup'
    ],
    data: () => ({
      commentAbout: {
        body: '',
        show: false,
        placeholder: '随便说说',
        reply_user: 0,
        loading: false
      }
    }),
    methods: {
      changeUrl,
      getUserName (user_id) {
        let { [user_id]: { name = '' } = {} } = this.users;
        return name;
      },
      handleCommentInput (open, reply_user = 0) {
        if(open){
          this.$store.dispatch(COMMENTINPUT, cb => {
            cb(this.feed.id);
          });
          this.commentAbout.reply_user = reply_user;
        } else {
          this.$store.dispatch(CLOSECOMMENTINPUT);
          this.commentAbout.reply_user = 0;
        }
      },
      handleShowPopup( open ) {
        if(open) {
          this.$store.dispatch(SHOWPOPUP, cb => {
            cb({
              show: true, 
              feed_id: this.feed.id, 
              me: this.feed.user_id === window.TS_WEB.currentUserId,
              isCollection: this.feed.has_collect
            });
          })
        } else {
          this.$store.dispatch(CLOSEPOPUP);
        }
      },

      friendnum (num) { 
        return friendNum(num);
      },

      sendDigg () {
        let uri = `feeds/${this.feed.id}/like`;
        let feed = this.feed;
        (addAccessToken().post(createAPI (uri), {}, 
          {
            validateStatus: status => status === 201
          }
        ))
        .then(response => {
          feed.has_like = 1;
          feed.like_count += 1;
          this.$store.dispatch(UPDATEFEED, cb => {
            cb(feed);
          })
        })
      },
      cannelDigg () {
        let feed = this.feed;
        let uri = `feeds/${this.feed.id}/unlike`;
        addAccessToken().delete(createAPI (uri), 
          {
            validateStatus: status => status === 204
          }
        )
        .then(response => {
          feed.has_like = 0;
          feed.like_count -= 1;
          this.$store.dispatch(UPDATEFEED, cb => {
            cb(feed);
          })
        })
      },
      sendComment () {
        if(!this.validComment || this.commentAbout.loading) return;
        this.commentAbout.loading = true;
        let comment_data = {
          body: this.commentAbout.body
        };

        if(this.commentAbout.reply_user) {
          comment_data.reply_user = this.commentAbout.reply_user
        }

        addAccessToken().post(createAPI(`feeds/${this.feed.id}/comments`), 
          comment_data,
          {
            validateStatus: status => status === 201
          }
        )
        .then( ({data = {}}) => {
          let comment = data.comment
          let feed = this.feed;
          let user_info = this.$storeLocal.get(`user_${window.TS_WEB.currentUserId}`);
          let reply_to_user = null;
          if(this.commentAbout.reply_user) {
            reply_to_user = this.$storeLocal.get(`user_${this.commentAbout.reply_user}`);
          }
          let newComment = {
            body: comment.body,
            created_at: comment.created_at,
            id: comment.id,
            reply_user: comment.reply_user,
            user_id: comment.user_id,
            reply_to_user: reply_to_user,
            user: user_info,
            updated_at: comment.updated_at
          };
          this.body = '';
          // 本地数据更新
          // feed.comments.unshift(newComment);
          // 更新vuex
          this.$store.getters[FEEDSLIST][this.feed.id].comments = this.$store.getters[FEEDSLIST][this.feed.id].comments ? this.$store.getters[FEEDSLIST][this.feed.id].comments : [];
          this.$store.getters[FEEDSLIST][this.feed.id].comments.unshift(newComment)
          this.$store.getters[FEEDSLIST][this.feed.id].feed_comment_count += 1;
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '已发送',
              time: 1500,
              status: true
            });
          });
          this.$store.dispatch(CLOSECOMMENTINPUT);
          // 重置输入框
          this.commentAbout = { ...this.commentAbout, ...{
            body: '',
            show: false,
            placeholder: '随便说说',
            reply_user: 0,
            loading: false
          }}
          // 更新动态
          // this.$store.dispatch(UPDATEFEED, cb => {
          //   cb(feed);
          // });
          this.loading = false;
        });
      },

      // 删除评论
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
            confirmContent: '删除评论',
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
        addAccessToken().delete(createAPI(`feeds/${data.feed_id}/comments/${data.comment_id}`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          this.$store.getters[FEEDSLIST][this.feed.id].comments.splice(data.index, 1);
          this.$store.getters[FEEDSLIST][this.feed.id].feed_comment_count -= 1;
        })
      },
    },

    computed: {
      isDigg () {
        return this.feed.has_like;
      },
      currentUser () {
        return window.TS_WEB.currentUserId;
      },
      validComment () {
        return this.commentAbout.body.length > 0;
      },
      commentCount () {
        return this.commentAbout.body.length;
      },
      commentsData () {
        const { comments = [] } = this.feed; 
        return comments.slice(0, 5); // 返回前三条评论
      },
      hasMore () {
        return this.feed.feed_comment_count > 5;
      },
      users () {
        return this.$store.getters[USERS];
      },
      openInputByVuex () {
        if(this.openInput && this.commentAbout.reply_user) {
          const reply_to_user = this.$storeLocal.get(`user_${this.commentAbout.reply_user}`);
          this.commentAbout.placeholder = `回复: ${reply_to_user.name}`;
        } else {
          this.commentAbout.placeholder = '随便说说';
        }
        return this.openInput;
      }
    },
    created () {
      let user_ids_obj = {};
      const { comments = [] } =  this.feed; 
      // console.log(comments);
      comments.forEach( (comment, index) => {

        // 被回复用户
        if(comment.reply_user) {
          let user = this.$storeLocal.get(`user_${comment.reply_user}`);
          if( !user ){
            user_ids_obj = { ...user_ids_obj, [comment.user_id]: comment.user_id, [comment.reply_user]: comment.reply_user };
          }else{
            this.$store.dispatch(USERS_APPEND, cb => cb(user));
          }
        } 

        // 评论用户
        let user = this.$storeLocal.get(`user_${comment.user_id}`);
        if( !user ){
          user_ids_obj = { ...user_ids_obj, [comment.user_id]: comment.user_id };
        }else{
          this.$store.dispatch(USERS_APPEND, cb => cb(user));
        }
      });

      let user_ids = lodash.values(user_ids_obj);
      // 批量获取用户
      getUsersInfo(user_ids);
    }
  }

  export default FeedTool;
</script>
<style lang="less" module>
  .tool {
    display: flex;
    align-items: center;
    .toolItem {
      width: 30vw;
      display: flex; 
      align-items: center;
      .count {
        padding-left: 4px;
        color: #999;
        font-style: normal
      }
      &:last-child {
        width: 10vw;
        justify-content: flex-end;
      }
    }
  }
  .comment {
    li {
      margin-top: 8px;
    }
    .commentOperations {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .commentOperation {
        margin: 0 8px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
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
