<template>
  <div :class="$style.detail" :id="`feed-${feed_id}`">
    <Row :gutter="16">
      <Col span="4">
        <div class="grid-content bg-purple">
          <img :src="avatar" alt="" style="width:100%; border-radius:50%">
        </div>
      </Col>
      <Col span="20">
        <div class="grid-content bg-purple">
          <Row :class="$style.usernameLine">
            <Col span="17">
              <router-link :class="$style.username" :to='`/users/feeds/${user.user_id}`'>{{ user.name }}</router-link>
            </Col>
            <Col span="7" :class="$style.timer">
              <timeago :since="timer" locale="zh-CN" :auto-update="60"></timeago>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <router-link style="display: flex;" v-if="feedInfo.feed_title" :to="`/feed/${feed_id}`" class="feedTitle">{{ feedInfo.feed_title }}</router-link>
              <div :class="$style.content" @click="router(`/feed/${feed_id}`)">
                {{ feedInfo.feed_content }}
              </div>
              <div v-if="feedInfo.storages.length">
                <FeedImages :storages="feedInfo.storages"></FeedImages>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
    <Row v-if="tools" :gutter="16" :class="$style.toolTop">
      <Col span="4" :class="$style.seat">
        1
      </Col>
      <Col span="20">
        <FeedTool @addNewCommentFoFeed="addNewCommentFoFeed" :user="user" :feedId="feedInfo.feed_id" @parentAddDigg="addDigg" @parentCannelDigg="cannelDigg" :toolDatas="toolInfo"></FeedTool>
      </Col>
    </Row>
    <Row v-if="feed.comments.length" :gutter="16">
      <Col :class="$style.seat" span="4">
        1
      </Col>
      <Col span="20" style="padding-bottom: 8px;">
        <CommentsTool v-if="feed.comments" @addComment="addNewComment" @delComment="delOldComment" :feedId="feedInfo.feed_id" :commentsData="feed.comments"></CommentsTool>
      </Col>
    </Row>
  </div>
</template>

<script>
  import { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import { getUserInfo } from '../utils/user';
  import FeedImages from './FeedImages';
  import FeedTool from './FeedTool';
  import CommentsTool from './CommentsTool';
  import timers from '../utils/timer';
  import router from '../routers/index';

  const feedinfo = {
    props: [
      'feed'
    ],
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
      feed_id: 0,
      user: {},
      tools: 0
    }),
    methods: {
      addNewCommentFoFeed (newComment) {
        let oldComments = this.feed.comments;
        let toolData = this.toolInfo;
        toolData.feed_comment_count += 1;
        this.toolInfo = Object.assign({}, this.toolInfo, toolData);
        oldComments.unshift(newComment);
        this.updateComments(oldComments);
      },
      addNewComment (newComments) {
        let toolData = this.toolInfo;
        toolData.feed_comment_count += 1;
        this.toolInfo = Object.assign({}, this.toolInfo, toolData);
        this.updateComments(newComments);
      },
      delOldComment (newComments) {
        let toolData = this.toolInfo;
        toolData.feed_comment_count -= 1;
        this.toolInfo = Object.assign({}, this.toolInfo, toolData);
        this.updateComments(newComments);
      },
      cannelDigg () {
        let toolData = this.toolInfo;
        toolData.feed_digg_count -= 1;
        toolData.is_digg_feed = false;
        this.toolInfo = Object.assign({}, this.toolInfo, toolData);
      },
      addDigg () {
        let toolData = this.toolInfo;
        toolData.feed_digg_count += 1;
        toolData.is_digg_feed = true;
        this.toolInfo = Object.assign({}, this.toolInfo, toolData);
      },
      updateComments (newComments) {
        this.feed.comments = newComments.slice(0);
      },
      // 获取单条图片
      getImg (id, process = 30) {
        return createRequestURI(`api/v1/storages/${id}/${process}`);
      },
      timers,
      router (link) {
        router.replace(link);
      }
    },
    components: {
      FeedImages,
      FeedTool,
      CommentsTool
    },
    computed: {
      avatar () {
        const { avatar: { 30: avatar = '' } = {} } = this.user;
        return avatar;
      },
      timer () {
        return this.timers(this.feedInfo.created_at, 8, false);
      }
    },
    created () {
      this.feed_id = this.feed.feed.feed_id;
      this.toolInfo = Object.assign({}, this.toolInfo, this.feed.tool);
      this.tools = 1;
      let localUser = localEvent.getLocalItem('user_' + this.feed.user_id);
      if(localUser.length == 0) {
        getUserInfo(this.feed.user_id, 30, user => {
          localUser = user;
          this.user = Object.assign({}, this.user, localUser);
        });
      } else {
        this.user = Object.assign({}, this.user, localUser);
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
    padding: 10px 0 0;
    &:active, &:focus {
      background-color: #fff;
    }
  }
  .toolTop {
    margin-top: 5px;
    border-top: 1px #e2e2e2 solid;
    display: flex!important;
    align-items: center;
    height: 45px!important;
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
    word-break: break-all;
    margin-bottom: 8px;
  }
  .timer {
    text-align: right;
    color: #ccc;
    font-size: 12px;
  }
  .seat {
    visibility: hidden;
  }
</style>