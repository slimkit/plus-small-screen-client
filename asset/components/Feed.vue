<template>
  <div :class="$style.detail" :id="`feed-${feed_id}`">
    <el-row>
      <el-col :span="3" offset="1">
        <div class="grid-content bg-purple">
          <img src="../statics/images/avatar.jpg" alt="" style="width:100%; border-radius:50%">
        </div>
      </el-col>
      <el-col :span="18" offset="1">
        <div class="grid-content bg-purple">
          <el-row :class="$style.usernameLine">
            <el-col :span="19">
              <router-link :class="$style.username" :to="{ path: '/users/profile' }">{{ user.name }}</router-link>
            </el-col>
            <el-col :span="5" :class="$style.timer">
              <timeago :since="timer"></timeago>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <router-link v-if="feedInfo.feed_title" :to="{ path: `/feeds/detail/${feed_id}` }" class="feedTitle">{{ feedInfo.feed_title }}</router-link>
              <div :class="$style.content">
                {{ feedInfo.feed_content }}
              </div>
              <div v-if="feedInfo.storages.length">
                <FeedImages :storages="feedInfo.storages"></FeedImages>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="tools" :class="$style.toolTop">
      <el-col offset="5" :span="19">
        <FeedTool :feedId="feedInfo.feed_id" :toolDatas="toolInfo"></FeedTool>
      </el-col>
    </el-row>
    <el-row v-if="comments.length">
      <el-col offset="5" :span="19">
        <CommentsTool :feedId="feedInfo.feed_id" :commentsData="comments"></CommentsTool>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { createRequestURI, createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import { getUserInfo } from '../utils/user';
  import FeedImages from './FeedImages';
  import FeedTool from './FeedTool';
  import CommentsTool from './CommentsTool';

  const feedinfo = {
    props: [
      'feed'
    ],
    components: {
      FeedImages,
      FeedTool,
      CommentsTool
    },
    data: () => ({
      feedInfo: {
        created_at: '',
        feed_content: '',
        feed_from: 0,
        feed_id: 0,
        feed_title: '',
        storages: []
      },
      toolInfo: {},
      commentInfo: {},
      timer: 0,
      feed_id: 0,
      user: {},
      tools: 0,
      comments: []
    }),
    mounted () {
      this.timer = new Date(this.feed.feed.created_at.replace(/-/g, "/"));
      this.feed_id = this.feed.feed.feed_id;
      this.toolInfo = Object.assign({}, this.toolInfo, this.feed.tool);
      this.comments = this.feed.comments;
      this.tools = 1;
      this.user = localEvent.getLocalItem('user_' + this.feed.user_id);
      if(this.user.length == 0) {
        getUserInfo(this.feed.user_id, user => {
          this.user = user;
        });
      }
      this.feedInfo = Object.assign({}, this.feedInfo, this.feed.feed);
    }
  }

  export default feedinfo;
</script>

<style lang="scss" module>
  .detail {
    background-color: #fff;
    margin-bottom: 6px;
    padding: 10px 0;
    &:active, &:focus {
      background-color: #fff;
    }
  }
  .toolTop {
    padding-top: 5px;
    margin-top: 5px;
    border-top: 1px #e2e2e2 solid;
  }
  .usernameLine {
    margin-bottom: 6px;
  }
  .username {
    color: #333;
    font-size: 16px;
  }
  .content {
    font-size: 14px;
    color: #666;
    text-align: justify;
    overflow: hidden;
    text-overflow: ellipsis;  
    display: -webkit-box;  
    -webkit-line-clamp: 3;  
    -webkit-box-orient: vertical;
  }
  .timer {
    text-align: right;
    color: #ccc;
    font-size: 12px;
  }
</style>