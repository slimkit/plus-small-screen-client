<template>
  <div :class="$style.tool">
    <Row>
      <i-col :span="7">
        <!-- <i class="iconfont icon-digg" :class="{ digg: isDigg }" @click.stop="!toolDatas.is_digg_feed ? sendDigg() : cannelDigg()">
          <span class="count">{{ friendnum(toolDatas.feed_digg_count) }}</span>
        </i> -->
        <i v-if="isDigg" :class="$style.fontIcon" @click="cannelDigg" class=" digg ivu-icon ivu-icon-android-favorite"><span class="count">{{ friendnum(toolDatas.feed_digg_count) }}</span></i>
        <i v-if="!isDigg" @click="sendDigg" class="ivu-icon ivu-icon-android-favorite-outline"><span class="count">{{ friendnum(toolDatas.feed_digg_count) }}</span></i>
      </i-col>
      <i-col :span="7">
        <i class="iconfont icon-comment" @click.stop="commentFeed">
          <span class="count">{{ friendnum(toolDatas.feed_comment_count) }}</span>
        </i>
      </i-col>
      <i-col :span="7">
        <i class="iconfont icon-view">
          <span class="count">{{ friendnum(toolDatas.feed_view_count) }}</span>
        </i>
      </i-col>
      <i-col :span="3" style="text-align: right">
        <i class="iconfont icon-more"></i>
      </i-col>
    </Row>
    <!-- 评论动态 -->
    <div v-if="CanInput" :class="$style.commentInput">
      <Row type="flex" align="bottom">
        <i-col :span="18" offset="1">
          <i-input type="textarea" class="commentInput" v-if="CanInput" :autofocus="autoF" :placeholder="placeholder" :autosize="{ minRows: 1, maxRows: 4 }" minlength="1" :blur="inputBlur" maxlength="255" v-model="comment"></i-input>
        </i-col>
        <i-col :span="3" offset="1">
          <Row v-if="commentCount > 200" :class="$style.commentCount">
            <i-col :span="24" ><span :class="{ inputFull: commentCount > 100 }">{{ commentCount }}</span>/255</i-col>
          </Row>
          <Row>
            <i-col :span="24">
              <i-button :long="true" type="primary" :class="$style.sendComment" :disabled="commentCount == 0" size="mini" @click.native="sendComment()">发送</i-button>
            </i-col>
          </Row>
        </i-col>
      </Row>
    </div>
    <div @click.stop="closeInput" :class="$style.wrapper" v-show="CanInput"></div>
    <!--评论动态-->
  </div>
</template>

<script>
  import { friendNum } from '../utils/friendNum';
  import { createAPI, addAccessToken } from '../utils/request';
  import localEvent from '../stores/localStorage';
  import { getUserInfo } from '../utils/user';

  const localUser = localEvent.getLocalItem('UserLoginInfo');
  const FeedTool = {
    props: [
      'toolDatas',
      'feedId',
      'user'
    ],
    data: () => ({
      toolData: {},
      CanInput: false,
      comment: ''
    }),
    methods: {
      // 发送动态
      sendComment () {
        let comment_content = this.comment;
        let user_id = localUser.user_id;
        addAccessToken().post(createAPI(`feeds/${this.feedId}/comment`), {
            comment_content
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
              reply_to_user_id: 0,
              id: response.data.data,
              user_id: localUser.user_id,
              user: localEvent.getLocalItem(`user_${localUser.user_id}`)
            };
            this.placeholder = '';
            this.CanInput = false;
            this.autoF = false;
            this.comment = '';
            this.$emit('addNewCommentFoFeed', newComment);
          }
        })
        .catch(({ response: { data = {} } = {} } ) => {
          const { code = 'xxxx' } = data;
        })
      },
      // 评论动态输入框
      commentFeed () {
        this.comment = '';
        let to_user = this.user;
        this.placeholder = `回复: ${to_user.name}`;
        this.CanInput = true;
        this.autoF = true;
      },
      friendnum (num) { 
        return friendNum(num);
      },
      closeInput () {
        this.placeholder = '';
        this.CanInput = false;
        this.autoF = false;
        this.userComment = '';
      },
      sendDigg () {
        let uri = `feeds/${this.feedId}/digg`;
        (addAccessToken().post(createAPI (uri), {}, 
          {
            validateStatus: status => status === 201
          }
        ))
        .then(response => {
          let isDigged = this.toolData.is_digg_feed;
          if (response.data.code === 0 || response.data.status) {
            this.$emit('parentAddDigg');
          }
        })
        .catch(({ response: { data = {} } = {} } ) => {
          this.isDisabled = false;
          const { code = 'xxxx' } = data;
          // this.isLoading = false;
          // this.errors = Object.assign({}, this.errors, { code: errorCodes[code] });
        });
      },
      cannelDigg () {
        let uri = `feeds/${this.feedId}/digg`;
        addAccessToken().delete(createAPI (uri), 
          {
            validateStatus: status => status === 204
          }
        )
        .then(response => {
          // this.toolData.is_digg_feed = false;
          // this.toolData.feed_digg_count -= 1;
          this.$emit('parentCannelDigg');
        })
        .catch(error => {
          console.log(error)
        })
      }
    },
    computed: {
      isDigg () {
        return this.toolDatas.is_digg_feed;
      },
      commentCount () {
        return this.comment.length;
      },
    },
    beforeMount () {
      this.toolData = Object.assign({}, this.toolData, this.toolDatas);
    }
  }

  export default FeedTool;
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
  .ivu-icon {
    font-size: 20px!important;
  }
</style>
