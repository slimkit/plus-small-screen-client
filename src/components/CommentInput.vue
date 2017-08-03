<template>
  <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
    <div :class="$style.commentRoot" v-if="show" id="commentRoot">
      <div class="commonHeader">
        <Row :gutter="24">
          <Col span="5">
            <Button :class="$style.actionBtn" type="text" @click="closeInput">取消</Button>
          </Col>
          <Col span="14" class="title-col">
            评论
          </Col>
          <Col span="5" class="header-end-col">
            <LoadingWhiteIcon height="21" width="21" v-if="loading" />
            <span :class="{ action: commentCount, notAction: !commentCount}"  v-show="!loading" @click="sendComment">发送</span>
          </Col>
        </Row>
      </div>
        <div :class="$style.commentInput" id="commentInput" v-show="show">
          <Row :gutter="16" type="flex" align="bottom" style="margin-left: 0; margin-right: 0;">
            <Col span="24">
              <Input 
                type="textarea" 
                ref="commentInput" 
                @on-focus="onFocus"
                @on-blur="onBlur"
                class="commentInput" 
                v-if="show"
                :placeholder="`回复: ${to_user_name}`" 
                :autosize="{ minRows: 1, maxRows: 4 }" 
                :minlength='1' blur="inputBlur" 
                :maxlength='255' 
                v-model="body"
                v-childfocus
              />
            </Col>
          </Row>
        </div>
    </div>
  </transition>
</template>
<script>
  import { COMMENTINPUT, CLOSECOMMENTINPUT, NOTICE, UPDATEFEED } from '../stores/types';
  import { mapState } from 'vuex';
  import { createAPI, addAccessToken } from '../utils/request';
  import getLocalTime from '../utils/getLocalTime';
  import LoadingWhiteIcon from '../icons/LoadingWhite';
  const handler = function() {
    event.preventDefault();
  };

  const commentInput = {
    components: {
      LoadingWhiteIcon
    },
    data: () => ({
      body: '',
      userInfo: {},
      loading: false
    }),
    methods: {
      onFocus () {
        document.getElementById('app').addEventListener('touchmove', handler, false);
      },
      onBlur () {
        document.getElementById('app').removeEventListener('touchmove', handler, false);
        document.getElementById('body-root').style.height  = 'auto';
      },
      closeInput () {
        this.$store.dispatch(CLOSECOMMENTINPUT);
      },
      sendComment () {
        if(!this.canSend || this.loading) return;
        this.loading = true;
        let currentUser = ths.$storeLocal(`UserLoginInfo`);
        let commentStore = this.$store.getters[COMMENTINPUT];
        let body = this.body;
        let reply_to_user_id = commentStore.data.reply_to_user_id;
        let user_id = currentUser.user_id;
        // 当前用户信息
        let user_info = this.$storeLocal.get(`user_${user_id}`);
        // 被评论者用户信息
        let reply_to_user = this.$storeLocal.get(`user_${reply_to_user_id}`);
        let feed = commentStore.data.feed;
        let feed_id = feed.feed.feed_id;
        let newCommentInfo = [];
        addAccessToken().post(createAPI(`feeds/${feed_id}/comment`), {
            body,
            reply_user
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then(response => {
          let newComment = {
            body: body,
            comment_mark: null,
            created_at: getLocalTime(),
            id: response.data.data,
            reply_to_user_id: reply_to_user_id,
            user_id: user_id,
            reply_to_user: reply_to_user,
            user: user_info
          };
          this.body = '';
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
          this.loading = false;
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
        return this.body.length;
      },
      canSend () {
        return this.commentCount > 0;
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
    // position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    overflow: hidden;
    z-index: 7;
    background-color: #fff;
    .commentInput{
      // position: fixed;
      // bottom: 0;
      // left: 0;
      width: 100%;
      z-index: 7;
      // border-bottom: 1px #59b6d7 solid;
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
<style scoped>
  .action {
    color: #59b6d7;
    font-size: 16px;
  }
  .notAction {
    color: #999;
    font-size: 16px;
  }
</style>
