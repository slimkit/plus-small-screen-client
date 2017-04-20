<template>
  <div>
    <transition name="">
      <div v-if="show" :class="$style.commentInput">
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
                <Button :long="true" type="primary" :class="$style.sendComment" :disabled="commentCount == 0" size="small" @click.native="sendComment()">发送</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </transition>
    <div @click.stop="closeInput" :class="$style.wrapper" v-show="show"></div>
  </div>
</template>
<script>
  import { COMMENTINPUT, USERS, NOTICE } from '../stores/types';
  import { mapState } from 'vuex';
  import localEvent from '../stores/localStorage';
  import { createAPI, addAccessToken } from '../utils/request';

  const currentUser = localEvent.getLocalItem('UserLoginInfo');
  const commentInput = {
    data: () => ({
      comment_content: ''
    }),
    methods: {
      closeInput () {
        let info = {
          show: false,
          reply_to_user_id: 0,
          feedIndex: -1,
          to_user_name: '',
          feed: {}
        };
        this.$store.dispatch(COMMENTINPUT, cb => {
          cb(info);
        });
      },
      sendComment () {
        let commentStore = this.$store.getters[COMMENTINPUT];
        let comment_content = this.comment_content;
        let reply_to_user_id = commentStore.reply_to_user_id;
        let user_id = currentUser.user_id;
        let feedIndex = commentStore.feedIndex;
        let feed = commentStore.feed;
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
              created_at: "",
              id: response.data.data,
              reply_to_user_id: reply_to_user_id,
              user_id: user_id,
              reply_to_user: localEvent.getLocalItem(`user_${reply_to_user_id}`),
              user: this.users[user_id]
            };
            this.comment_content = '';
            let info = {
              show: false,
              reply_to_user_id: 0,
              feedIndex: -1,
              to_user_name: '',
              feed: {}
            }
            // 本地数据更新
            feed.comments.unshift(newComment);
            feed.tool.feed_comment_count += 1;
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '已发送',
                time: 3000,
                status: true
              });
            });
            this.$store.dispatch(COMMENTINPUT, cb => {
              cb(info);
            });
            this.$store.dispatch(FEEDFOLLOWINGUPDATE, cb => {
              console.log(feed);
              cb({
                index: feedIndex,
                newFeed: feed
              })
            });
          }
        })
        // .catch(({ response: { data = {} } = {} } ) => {
        //   const { code = 'xxxx' } = data;
        // })
      }
    },
    computed: {
      ...mapState({
        show: state => state.commentInput.commentInput.show,
        reply_to_user_id: state => state.commentInput.commentInput.reply_to_user_id,
        feedIndex: state => state.commentInput.commentInput.feedIndex,
        to_user_name: state => state.commentInput.commentInput.to_user_name
      }),
      // 评论长短
      commentCount () {
        return this.comment_content.length;
      },
      users () {
        return this.$store.getters[USERS];
      }
    }
  };

  export default commentInput;
  
</script>
<style lang="scss" module>
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
  .commentCount {
    margin-bottom: .5em;
    font-size: 12px;
  }
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
  .sendComment {
    font-size: 14px;
    padding: 3px!important;
    background-color: #59b6d7;
    &[disabled] {
      background-color: #ccc!important;
      color: #fff!important;
    }
  }
</style>
<style lang="css">
  .commentInput {
    border: none;
  }
</style>