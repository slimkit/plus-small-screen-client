<template>
  <div :class="$style.detail" :id="`feed-${feed_id}`">
    <Row :gutter="16">
      <Col span="4">
        <div class="grid-content bg-purple">
          <img :src="userInfo.avatar[20]" alt="" style="width:100%; border-radius:50%">
        </div>
      </Col>
      <Col span="20">
        <div class="grid-content bg-purple">
          <Row :class="$style.usernameLine">
            <Col span="19">
              <router-link :class="$style.username" :to="{ path: '/users/profile' }">{{ userInfo.name }}</router-link>
            </Col>
            <Col span="5" :class="$style.timer">
              <timeago :since="timer"></timeago>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <router-link v-if="feedInfo.feed_title" :to="{ path: `/feed/${feed_id}` }" class="feedTitle">{{ feedInfo.feed_title }}</router-link>
              <div :class="$style.content">
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
        <FeedTool @addNewCommentFoFeed="addNewCommentFoFeed" :user="userInfo" :feedId="feedInfo.feed_id" @parentAddDigg="addDigg" @parentCannelDigg="cannelDigg" :toolDatas="toolInfo"></FeedTool>
      </Col>
    </Row>
    <Row v-if="feed.comments.length" :gutter="16">
      <Col :class="$style.seat" span="4">
        1
      </Col>
      <Col span="20">
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
      timer: 0,
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
      }
    },
    components: {
      FeedImages,
      FeedTool,
      CommentsTool
    },
    computed: {
      userInfo () {
        let user = this.user;
        return user;
      }
    },
    created () {
      this.timer = new Date(this.feed.feed.created_at.replace(/-/g, "/"));
      this.feed_id = this.feed.feed.feed_id;
      this.toolInfo = Object.assign({}, this.toolInfo, this.feed.tool);
      this.tools = 1;
      let localUser = localEvent.getLocalItem('user_' + this.feed.user_id);
      if(localUser.length == 0) {
        getUserInfo(this.feed.user_id, user => {
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
  .seat {
    visibility: hidden;
  }
</style>