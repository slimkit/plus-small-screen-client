<template>
  <div :class="$style.commentRoot" v-show="show" id="commentRoot">
    <transition name="">
      <div :class="$style.commentInput" id="commentInput" v-show="show">
        <Row :gutter="16" type="flex" align="bottom" style="margin-left: 0; margin-right: 0;">
          <Col span="20">
            <Input type="textarea" class="commentInput" v-if="show" autofocus="autofocus" :placeholder="`回复: ${to_user_name}`" :autosize="{ minRows: 1, maxRows: 4 }" :minlength='1' blur="inputBlur" :maxlength='255' v-model="comment_content"></Input>
          </Col>
          <Col span="4">
            <Row v-if="commentCount > 200" :class="$style.commentCount">
              <Col span="24" ><span :class="{ inputFull: commentCount > 100 }">{{ commentCount }}</span>/255</Col>
            </Row>
            <Row>
              <Col span="24">
                <Button :long="true" type="primary" class="sendButton" :disabled="commentCount == 0" size="small" @click.native="sendComment()">发送</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </transition>
    <div @click.stop="closeInput" id="wrapper" :class="$style.wrapper" v-show="show"></div>
  </div>
</template>
<script>
  import { COMMENTINPUT, CLOSECOMMENTINPUT, NOTICE, UPDATEFEED } from '../stores/types';
  import { mapState } from 'vuex';
  import localEvent from '../stores/localStorage';
  import { createAPI, addAccessToken } from '../utils/request';
  import getLocalTime from '../utils/getLocalTime';

  const commentInput = {
    data: () => ({
      comment_content: '',
      userInfo: {}
    }),
    methods: {
      closeInput () {
        this.$store.dispatch(CLOSECOMMENTINPUT);
      },
      sendComment () {
        let currentUser = localEvent.getLocalItem(`UserLoginInfo`);
        let commentStore = this.$store.getters[COMMENTINPUT];
        let comment_content = this.comment_content;
        let reply_to_user_id = commentStore.data.reply_to_user_id;
        let user_id = currentUser.user_id;
        // 当前用户信息
        let user_info = localEvent.getLocalItem(`user_${user_id}`);
        // 被评论者用户信息
        let reply_to_user = localEvent.getLocalItem(`user_${reply_to_user_id}`);
        let feed = commentStore.data.feed;
        let feed_id = feed.feed.feed_id;
        let newCommentInfo = [];
        addAccessToken().post(createAPI(`feeds/${feed_id}/comment`), {
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
              created_at: getLocalTime(),
              id: response.data.data,
              reply_to_user_id: reply_to_user_id,
              user_id: user_id,
              reply_to_user: reply_to_user,
              user: user_info
            };
            this.comment_content = '';
            let info = {
              data: {
                show: false,
                reply_to_user_id: 0,
                to_user_name: '',
                feed: {}
              }
            }
            // 本地数据更新
            feed.comments.unshift(newComment);
            feed.tool.feed_comment_count += 1;
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '已发送',
                time: 1500,
                status: true
              });
            });
            this.$store.dispatch(COMMENTINPUT, cb => {
              cb(info);
            });
            this.$store.dispatch(UPDATEFEED, cb => {
              cb(feed);
            });
            this.callback(this.closeInput, newComment);
          }
        })
      }
    },
    computed: {
      ...mapState({
        show: state => state.commentInput.commentInput.data.show,
        reply_to_user_id: state => state.commentInput.commentInput.data.reply_to_user_id,
        feedIndex: state => state.commentInput.commentInput.data.feedIndex,
        to_user_name: state => state.commentInput.commentInput.data.to_user_name,
        close: state => state.commentInput.commentInput.close,
        callback: state => state.commentInput.commentInput.cb
      }),
      // 评论长短
      commentCount () {
        return this.comment_content.length;
      }
    }
  };

  export default commentInput;
  
</script>
<style lang="scss" module>
  .commentCount {
    margin-bottom: .5em;
    font-size: 12px;
  }
  .commentRoot {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    overflow: hidden;
    z-index: 7;
    .commentInput{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 7;
      background-color: #fff;
      border-bottom: 1px #59b6d7 solid;
      border: none;
      padding: 10px 0;
      textarea {
        min-height: 34px!important;
        position: relative;
        bottom: 0;
        left: 0;
      }
    }
    .wrapper{
      background-color: rgba(0, 0, 0, .3);
      z-index: 6;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      position: absolute;
      overflow: auto;
      margin: 0;
    }
  }
</style>
