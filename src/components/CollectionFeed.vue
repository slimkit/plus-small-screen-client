<template>
  <div :class="$style.detail" :id="`feed-${feed.id}`">
    <Row :gutter="16" style="-webkit-align-items: flex-start; align-items: flex-start;">
      <Col span="4">
        <img :src="avatar" alt="" style="width:100%; border-radius:50%">
      </Col>
      <Col span="20">
        <Row :class="$style.usernameLine">
          <Col span="17">
            <router-link :class="$style.username" :to='`/users/feeds/${user.user_id}`'>{{ user.name }}</router-link>
          </Col>
          <Col span="7" :class="$style.timer">
            <timeago :since="timer" locale="zh-CN" :auto-update="60"></timeago>
          </Col>
        </Row>
        <Row>
          <Col span="23">
            <div :class="$style.content" @click="router(`/feed/${feed.id}`)">
              {{ feed.feed_content }}
            </div>
            <FeedImages v-show="feed.images.length" :storages="feed.images"></FeedImages>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
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
  import defaultAvatar from '../statics/images/defaultAvatarx2.png';
  import lodash from 'lodash';

  const CollectionFeed = {
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
      timer () {
        return this.timers(this.feed.created_at, 8, false);
      }
    },
    created () {
      let localUser = this.$storeLocal.get('user_' + this.feed.user_id);
      if(!lodash.keys(localUser).length > 0) {
        getUserInfo(this.feed.user_id).then( user => {
          this.user = { ...this.user, ...user };
        });
      } else {
        this.user = { ...this.user, ...localUser };
      }
    }
  }

  export default CollectionFeed;
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
    text-align: initial;
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