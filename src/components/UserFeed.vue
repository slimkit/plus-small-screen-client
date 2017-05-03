<template>
  <div :class="$style.detail" :id="`feed-${feed.feed.feed_id}`">
    <Row :gutter="16" :class="$style.userFeed">
      <Col span="3">
        <div class="grid-content bg-purple" style="line-height: 100%;">
          <span 
            style="text-align: center; font-weight: 400; width: 100%; display: flex; justify-content: center; align-items: center; flex-wrap: wrap; line-height: 100%; font-size: 18px;" 
            v-if="feed.created_at"
          >
            {{feed.created_at}}
          </span>
          <span style="text-align: center; font-weight: 400; font-size: 18px;display: flex; justify-content: center;" v-if="feed.date">{{feed.date}}</span>
          <span style="text-align: center; font-size: 14px;display: flex; justify-content: center;" v-if="feed.month">{{feed.month}}月</span>
        </div>
      </Col>
      <Col span="21">
        <router-link style="display: flex; line-height: 100%; padding-bottom: 8px;" v-if="feed.feed.feed_title" :to="`/feed/${feed.feed.feed_id}`" class="feedTitle">{{ feed.feed.feed_title }}</router-link>
        <div :class="$style.content" @click="router(`/feed/${feed.feed.feed_id}`)">
          {{ feed.feed.feed_content }}
        </div>
        <div v-if="feed.feed.storages.length">
          <FeedImages :storages="feed.feed.storages"></FeedImages>
        </div>
      </Col>
    </Row>
    <Row :gutter="16" :class="$style.toolTop">
      <Col span="3" :class="$style.seat">
        1
      </Col>
      <Col span="21">
        <FeedTool :feed="feed" :user="user" />
      </Col>
    </Row>
    <Row v-if="feed.comments.length" :gutter="16">
      <Col :class="$style.seat" span="3">
        1
      </Col>
      <Col span="21" style="padding-bottom: 8px;">
        <CommentsTool v-if="feed.comments" :feed="feed" />
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
  import lodash from 'lodash';

  const feedinfo = {
    props: [
      'feed'
    ],
    data: () => ({
      user: {}
    }),
    methods: {
      // 获取单条图片
      getImg (id, process = 30) {
        return createRequestURI(`api/v1/storages/${id}/${process}`);
      },
      timers,
      router (link) {
        router.push(link);
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
      }
    },
    created () {
      let localUser = localEvent.getLocalItem('user_' + this.feed.user_id);
      if(!lodash.keys(localUser).length > 0) {
        getUserInfo(this.feed.user_id, 30).then(user => {
          localUser = user;
          this.user = { ...this.user, ...localUser };
        });
      } else {
        this.user = { ...this.user, ...localUser };
      }
    }
  }

  export default feedinfo;
</script>

<style lang="scss" module>
  .detail {
    background-color: #fff;
    margin-bottom: 6px;
    padding: 16px 0 0;
    &:active, &:focus {
      background-color: #fff;
    }
    .userFeed {
      display: block;
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