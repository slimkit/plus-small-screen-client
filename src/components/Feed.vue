<template>
  <li 
    :class="$style.detail"
    :id="`feed-${feed.id}`"
  >
    <section 
      style="display: flex; align-items: flex-start;"
    >
      <img 
        :src="avatar" 
        :alt="user.name" 
        :class="$style.detailAvatar"
        @click="changeUrl(`/users/feeds/${user.user_id}`)"
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
          @click.stop="toFeedDetail(feed.id)"
        >
          <p 
            :class="$style.detailContent" 
            v-html="feed.feed_content ? feed.feed_content.replace(/\n/g,'<br/>') : feed.feed_content"
          >
          </p>
          <FeedImages 
            v-show="feed.images.length" 
            :storages="feed.images"
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
        :openInput="feed.id == commentFeed ? true : false"
        :showPopup="feed.id == showPopup ? true : false"
      />
    </div>
  </li>
</template>

<script>
  import { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import { getUserInfo, getLoggedUserInfo } from '../utils/user';
  import FeedImages from './FeedImages';
  import FeedTool from './FeedTool';
  import CommentsTool from './CommentsTool';
  import timers from '../utils/timer';
  import router from '../routers/index';
  import {
    resolveImage
  } from '../utils/resource';

  import lodash from 'lodash';
  import { changeUrl } from '../utils/changeUrl';
  import { mapState } from 'vuex';
  import { NOTICE, USERS_APPEND } from '../stores/types';
  import storeLocal from 'store';
  const defaultAvatar =  resolveImage(require('../statics/images/defaultAvatarx2.png'));
  console.log(defaultAvatar);
  const feedinfo = {
    props: [
      'feed'
    ],
    data: () => ({
      user: {}
    }),
    methods: {
      changeUrl,
      toFeedDetail(id) {
        if(this.feed.paid_node && !this.feed.paid) {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '请先购买动态',
              time: 1500,
              status: false
            });
          });
          return;
        }
        this.changeUrl(`/feed/${id}`);
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
        let { avatar = defaultAvatar } = this.user;
        // avatar = avatar || ;
        return avatar;
      },
      timer () {
        return this.timers(this.feed.created_at, 8, false);
      },
      // 检测动态展开输入框
      ...mapState({
        commentFeed: state => state.commentInput.commentFeed,
        showPopup: state => state.commentInput.showPopup
      })
    },
    created () {
      let user = storeLocal.get(`user_${this.feed.user_id}`);
      if(!user) {
        if(this.feed.user_id !== TS_WEB.currentUserId) {
          getUserInfo(this.feed.user_id).then( user => {
            this.user = { ...user };
          });
        } else {
          getLoggedUserInfo().then( user => {
            this.user = { ...user };
          });
        }
          
      } else {
        user.avatar = user.avatar ? user.avatar : defaultAvatar;
        this.$store.dispatch(USERS_APPEND, cb =>{
          cb(user)
        });
        this.user = { ...user };
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