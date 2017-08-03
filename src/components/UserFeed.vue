<template>
  <li :class="$style.detail" :id="`feed-${feed.id}`">
    <Row :gutter="16" :class="$style.userFeed">
      <Col span="3">
        <div class="grid-content bg-purple" style="line-height: 150%;">
          <span style="text-align: center; font-weight: 400; font-size: 18px;display: flex; justify-content: center; padding-bottom: 8px;" v-if="feed.date">{{feed.date}}</span>
          <span style="text-align: center; font-size: 14px;display: flex; justify-content: center;" v-if="feed.month">{{feed.month}}月</span>
        </div>
      </Col>
      <Col span="21">
        <div :class="$style.content" @click="router(`/feed/${feed.id}`)">
          {{ feed.feed_content }}
        </div>
        <div v-if="feed.images.length">
          <FeedImages :storages="feed.images"></FeedImages>
        </div>
      </Col>
    </Row>
    <Row :gutter="16" :class="$style.toolTop">
      <Col span="21" offset="3" style="padding-top: 3vw; padding-bottom: 3vw;">
        <FeedTool 
          :feed="feed" 
          :user="user" 
          :openInput="feed.id == commentFeed ? true : false"
        />
      </Col>
    </Row>
  </li>
</template>

<script>
  import { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import { getUserInfo } from '../utils/user';
  import FeedImages from './FeedImages';
  import FeedTool from './FeedTool';
  import CommentsTool from './CommentsTool';
  import timers from '../utils/timer';
  import router from '../routers/index';
  import lodash from 'lodash';
  import { mapState } from 'vuex';

  const feedinfo = {
    props: [
      'feed'
    ],
    data: () => ({
      user: {}
    }),
    methods: {
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
        const { avatar = '' } = this.user;
        return avatar;
      },
      // 检测动态展开输入框
      ...mapState({
        commentFeed: state => state.commentInput.commentFeed
      })
    },
    created () {
      let localUser = this.$storeLocal.get('user_' + this.feed.user_id);
      if(!localUser) {
        getUserInfo(this.feed.user_id).then(user => {
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
      margin-bottom: 8px;
    }
  }
  .toolTop {
    margin-top: 8px;
    border-top: 1px #e2e3e3 solid;
    display: flex!important;
    align-items: center;
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
</style>