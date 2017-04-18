<template>
    <div>
      <ul>
        <li v-for="(comment, index) in commentsData" :key="comment.id" v-if="index < 3">
          <p>
            <router-link v-if="comment.user_id" :class="$style.userName" :to="{ path: '/users/profile' }">{{ getUserName(comment.user_id) }}</router-link> 
            <span v-if="comment.reply_to_user_id" :class="$style.commentContent">
              回复
            </span>
            <router-link v-if="comment.reply_to_user_id" :class="$style.userName" :to="{ path: '/users/profile' }">{{ getUserName(comment.reply_to_user_id) }}</router-link> 
            <span
              v-if="comment.user_id  != currentUser.user_id"
              @click.stop="focusInput(comment.id, comment.user_id, feedId)"
              :class="$style.commentContent"
            > 
             : {{ comment.comment_content }}
            </span>
            <span
              v-if="comment.user_id == currentUser.user_id"
              @click.stop="showComfirm(comment.id, feedId, index)"
              :class="$style.commentContent"
            > 
             : {{ comment.comment_content }}
            </span>
          </p>
        </li>
      </ul>
      <router-link v-if="hasMore" :class="$style.userName" :to="`/feed/${feed_id}`">查看全部评论</router-link>
      <div v-if="CanInput" :class="$style.commentInput">
        <Row :gutter="16" type="flex" align="bottom" style="margin-left: 0; margin-right: 0;">
          <Col span="20">
            <Input type="textarea" class="commentInput" v-if="CanInput" autofocus="autofocus" :placeholder="placeholder" :autosize="{ minRows: 1, maxRows: 4 }" :minlength='1' blur="inputBlur" :maxlength='255' v-model="userComment"></Input>
          </Col>
          <Col span="4">
            <Row v-if="commentCount > 200" :class="$style.commentCount">
              <Col span="24" ><span :class="{ inputFull: commentCount > 100 }">{{ commentCount }}</span>/255</Col>
            </Row>
            <Row>
              <Col span="24">
                <Button :long="true" type="primary" :class="$style.sendComment" :disabled="commentCount == 0" size="small" @click.native="sendComment()">发送</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Comfirm v-if="isShowComfirm" @cannel="cannel" @increment="deleteComment" :data="deleteData" comfirm-content="删除这条评论"></Comfirm>
      <div @click.stop="closeInput" :class="$style.wrapper" v-show="CanInput"></div>
    </div>
</template>

<script>
  import localEvent from '../stores/localStorage';
  import { getUserInfo, getUsersInfo } from '../utils/user';
  import { createAPI, addAccessToken } from '../utils/request';
  import router from '../routers/index';
  import Comfirm from '../utils/Comfirm';
  import { USERS, USERS_APPEND, USERS_ITEM_UPDATE, NOTICE } from '../stores/types';

  const commentsTool = {
    props: [
      'commentsData', // 评论数据
      'feedId' // 动态id
    ],
    components: {
      Comfirm
    },
    data: () => ({
      feed_id: 0,
      more: false, // 查看全部
      CanInput: false, // 输入框显示
      placeholder: '', // 占位文字
      userComment: '', // 用户评论内容
      replyToUserId: 0, // 回复谁
      toFeed: 0, // 评论哪条动态
      sending: false, // 是否发送中
      isShowComfirm: false, // 是否显弹框
      deleteData: {}, // 删除评论时传递的数据对象
    }),
    methods: {
      focusInput (comment_id, comment_to_uid, feed_id) {
        this.userComment = '';
        let to_user = localEvent.getLocalItem(`user_${comment_to_uid}`);
        if (!to_user.length) {
          getUserInfo(comment_to_uid, 30, user => {
            to_user = user;
            this.placeholder = `回复: ${to_user.name}`;
          });
        } else {
          this.placeholder = `回复: ${to_user.name}`;
        }
        this.CanInput = true;
        this.autoF = true;
        this.replyToUserId = comment_to_uid;
      },
      showComfirm (commentId, feedId, index) {
        this.isShowComfirm = true;
        this.deleteData = {
          comment_id: commentId,
          feed_id: feedId,
          index: index
        };
      },
      deleteComment (data) {
        addAccessToken().delete(createAPI(`feeds/${data.feed_id}/comment/${data.comment_id}`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          let newComments = this.commentsData;
          this.isShowComfirm = false;
          this.deleteData = {};
          newComments.splice(data.index,1);
          this.$emit('delComment', newComments);
        })
        .catch(error => {
          console.log(error)
        })
      },
      // comfirm显示
      cannel () {
        this.isShowComfirm = false;
      },
      closeInput () {
        this.placeholder = '';
        this.CanInput = false;
        this.autoF = false;
        this.userComment = '';
      },
      updateComments (newComments) {
        this.commentsData = newComments.slice(0);
      },
      sendComment () {
        let comment_content = this.userComment;
        let reply_to_user_id = this.replyToUserId;
        let user_id = this.currentUser.user_id;
        let oldCommentInfo = this.commentsData;
        let newCommentInfo = [];
        addAccessToken().post(createAPI(`feeds/${this.feedId}/comment`), {
            comment_content,
            reply_to_user_id
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then(response => {
          if(response.data.code === 0 || response.data.status) {
            let newComment = {
              comment_content: comment_content,
              comment_mark: null,
              created_at: "",
              id: response.data.data,
              reply_to_user_id: reply_to_user_id,
              user_id: user_id,
              reply_to_user: localEvent.getLocalItem(`user_${reply_to_user_id}`),
              user: this.users[user_id]
            };
            this.placeholder = '';
            this.CanInput = false;
            this.autoF = false;
            this.userComment = '';
            oldCommentInfo.unshift(newComment);
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '已发送',
                time: 3000,
                status: true
              });
            });
            this.$emit('addComment', oldCommentInfo);
          }
        })
        .catch(({ response: { data = {} } = {} } ) => {
          const { code = 'xxxx' } = data;
        })
      },
      getUserName (user_id) {
        let { [user_id]: { name } = {} } = this.users;
        return name;
      }
    },
    computed: {
      hasMore () {
        return this.commentsData.length > 2;
      },
      commentCount () {
        return this.userComment.length;
      },
      users () {
        return this.$store.getters[USERS];
      },
      currentUser () {
        return localEvent.getLocalItem('UserLoginInfo');
      }
    },
    created () {
      this.feed_id = this.feedId;
      let user_ids_obj = {};
      this.commentsData.forEach( (comment, index) => {
        if(comment.reply_to_user_id) {
          user_ids_obj = { ...user_ids_obj, [comment.user_id]: comment.user_id, [comment.reply_to_user_id]: comment.reply_to_user_id };
        } else {
          user_ids_obj = { ...user_ids_obj, [comment.user_id]: comment.user_id };
        }
      });
      let user_ids = Object.values(user_ids_obj);
      this.$store.dispatch(USERS, cb => getUsersInfo(user_ids, users => cb(users)));
    }
  };

  export default commentsTool;
</script>

<style lang="scss" module>
  .commentInput{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 6;
    background-color: #fff;
    border-bottom: 1px #59b6d7 solid;
    border: none;
    padding: 10px 0;
    textarea {
      min-height: 34px!important;
    }
  }
  .commentCount {
    margin-bottom: .5em;
    font-size: 12px;
  }
  .wrapper{
    background-color: rgba(0, 0, 0, .3);
    z-index: 5;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    position: fixed;
    overflow: auto;
    margin: 0;
  }
  .sendComment {
    font-size: 14px;
    padding: 3px!important;
    background-color: #59b6d7;
    &[disabled] {
      background-color: #ccc!important;
      color: #fff!important;
    }
  }
  .userName {
    font-size: 13px;
    color: #333;
  }
  .commentContent{
    font-size: 14px;
    color: #999;
  }
</style>
<style lang="css">
  .commentInput {
    border: none;
    
  }
</style>
