<template>
  <div>
    <ul>
      <li v-for="comment in commentInfo">
        <p :key="comment.id">
          <router-link v-if="comment.user.name" :class="$style.userName" :to="{ path: '/users/profile' }">{{ comment.user.name }}</router-link> : 
          <span
            @click.stop="focusInput(comment.id, comment.user_id)"
            :class="$style.commentContent"
          >
            {{ comment.comment_content }}
          </span>
        </p>
      </li>
    </ul>
    <router-link v-if="hasMore" :class="$style.userName" to="/web">查看全部评论</router-link>
    <div v-if="CanInput" :class="$style.commentInput">
      <el-row type="flex" align="bottom">
        <el-col :span="18" offset="1">
          <el-input type="textarea" v-if="CanInput" autofocus="autoF" :placeholder="placeholder" :autosize="{ minRows: 1, maxRows: 4 }" minlength="1" :blur="inputBlur" maxlength="255" v-model="userComment"></el-input>
        </el-col>
        <el-col :span="3" offset="1">
          <el-row v-if="commentCount > 200" :class="$style.commentCount">
            <el-col :span="24" ><span :class="{ inputFull: commentCount > 100 }">{{ commentCount }}</span>/255</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button type="primary" :class="$style.sendComment" :disabled="commentCount == 0" size="mini">发送</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div @click.stop="closeInput" :class="$style.wrapper" v-show="CanInput"></div>
  </div>
</template>

<script>
  import localEvent from '../stores/localStorage';
  import { getUserInfo } from '../utils/user';

  const commentsTool = {
    props: [
      'commentsData'
    ],
    data: () => ({
      commentInfo: [],
      more: false,
      CanInput: false,
      autoF: false,
      placeholder: '',
      userComment: ''
    }),
    methods: {
      focusInput (comment_id, comment_to_uid) {
        this.userComment = '';
        let to_user = localEvent.getLocalItem(`user_${comment_to_uid}`);
        if (!to_user.length) {
          getUserInfo(comment_to_uid, user => {
            to_user = user;
            this.placeholder = `回复: ${to_user.name}`;
          });
        } else {
          this.placeholder = `回复: ${to_user.name}`;
        }
        this.CanInput = true
        this.autoF = true;
      },
      closeInput () {
        this.placeholder = '';
        this.CanInput = false;
        this.autoF = false;
        this.userComment = '';
      }
    },
    computed: {
      hasMore () {
        return this.commentsData.length > 2;
      },
      commentCount () {
        return this.userComment.length;
      }
    },
    mounted () {
      this.commentInfo = this.commentsData;
      let comments = this.commentsData;
        let author = {};
        let reply_to_user = {};
        let userObject = {};
        this.commentInfo.forEach( (comment, index) => {
          author = localEvent.getLocalItem(`user_${comment.user_id}`);
          if (!author.user_id) {
            getUserInfo(comment.user_id, user => {
              userObject = { [index]: { user: user }};
              comments[index] = Object.assign({}, this.commentInfo[index], { user: user });
            });
          } else {
            comments[index] = Object.assign({}, comments[index], { user: author });
          }
          if (comment.reply_to_user_id) {
            reply_to_user = localEvent.getLocalItem(`user_${comment.user_id}`);
            if (!reply_to_user.user_id) {
              getUserInfo(comment.user_id, user => {
                comments[index] = Object.assign({}, comments[index], { reply_to_user: user });
              });
            } else {
              comments[index] = Object.assign({}, comments[index], { reply_to_user: reply_to_user });
            }
          }
        });
        this.commentInfo = comments;
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
    z-index: 4;
    background-color: #fff;
    border-bottom: 1px #59b6d7 solid;
    border: none;
    padding: 5px 0;
  }
  .commentCount {
    margin-bottom: .5em;
    font-size: 12px;
  }
  .wrapper{
    background-color: rgba(0, 0, 0, .3);
    z-index: 3;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    position: fixed;
    overflow: auto;
    margin: 0px;
  },
  .sendComment {
    font-size: 14px;
    border: none!important;
    width: 100%;
    &:disabled {
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

