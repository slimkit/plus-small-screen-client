<template>
  <li 
    :class="$style.detail"
    :id="`feed-${feed.feed.feed_id}`"
  >
    <section 
      style="display: flex; align-items: flex-start;"
    >
      <img 
        :src="avatar" 
        :alt="user.name" 
        :class="$style.detailAvatar"
      >
      <section 
        style="padding: 0 2vw; width: 86vw;"
      >
        <section :class="$style.detailContentBefore">
          <router-link 
            :class="$style.detailUsername" 
            :to='`/users/feeds/${user.user_id}`'
          >
            {{ user.name }}
          </router-link>
          <timeago 
            :class="$style.detailTimer" 
            :since="timer" 
            locale="zh-CN" 
            :auto-update="60"
          />
        </section>
        <figure 
          :class="$style.detailFeedContent"
          @click.stop="changeUrl(`/feed/${feed.feed.feed_id}`)"
        >
          <p 
            :class="$style.detailContent" 
            v-html="feed.feed.feed_content.replace(/\n/g,'<br/>')"
          >
          </p>
          <FeedImages 
            v-show="feed.feed.storages.length" 
            :storages="feed.feed.storages"
          />
        </figure>
      </section>
    </section>
    <div 
      :class="$style.detailTools"
    >
      <FeedTool 
        :user="user" 
        :feed="feed" 
      />
      <CommentsTool 
        v-if="feed.comments" 
        :feed="feed" 
      />
    </div>
  </li>
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
  import defaultAvatar from '../statics/images/defaultAvatarx2.png';
  import lodash from 'lodash';
  import { changeUrl } from '../utils/changeUrl';

  const feedinfo = {
    props: [
      'feed'
    ],
    data: () => ({
      user: {}
    }),
    methods: {
      changeUrl,
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
        const { avatar: { 30: avatar = defaultAvatar } = {} } = this.user;
        return avatar;
      },
      timer () {
        return this.timers(this.feed.feed.created_at, 8, false);
      }
    },
    created () {
      let localUser = localEvent.getLocalItem('user_' + this.feed.user_id);
      if(!lodash.keys(localUser).length > 0) {
        getUserInfo(this.feed.user_id, 30).then( user => {
          this.user = { ...this.user, ...user };
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
    padding: 10px 0 0;
    &:active, &:focus {
      background-color: #fff;
    }
    .detailAvatar {
      padding: 0 2vw; 
      width: 14vw; 
      height: 10vw; 
      border-radius: 100%;
    }
    .detailTools {
      padding-left: 16vw; 
      width: 100vw; 
      padding-right: 2vw; 
      border-top: 1px #ededed solid; 
      padding-top: 3vw; 
      padding-bottom: 3vw;
    }
    .detailContentBefore {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .detailUsername {
        color: #333;
        font-size: 16px;
      }
      .detailTimer {
        text-align: right;
        color: #ccc;
        font-size: 12px;
      }
    }
    .detailFeedContent {
      width: 80vw;
      .detailContent {
        font-size: 14px;
        color: #666;
        text-align: initial;
        overflow: hidden;
        text-overflow: ellipsis;  
        display: -webkit-box;  
        -webkit-line-clamp: 3;  
        -webkit-box-orient: vertical;
        word-break: break-all;
        margin: 4px 0 12px 0;
      }
    }
  }
</style>