<template>
  <div class="UserFeeds">
    <div :class="$style.userCover">
      <img :class="$style.coverImg" :src="`http://localhost:8080/${coverImg}`" :alt="userInfo.name"/>
    </div>
    <div :class="$style.userProfile">
      <div :class="$style.avatar">
        <img :src="avatar" :alt="userInfo.name">
      </div>
      <h4 :class="$style.name">{{userInfo.name}}</h4>
      <div :class="$style.intro">
        <p>
          {{introText}}
        </p>
      </div>
      <div :class="$style.follows">
        <Row :gutter="32">
          <Col span="12" :class="$style.followed">
            粉丝 <span :class="$style.counts">{{followed}}</span>
          </Col>
          <Col span="12">
            关注 <span :class="$style.counts">{{following}}</span>
          </Col>
        </Row>
      </div>
    </div>
    <div :class="$style.feeds">
      <div style="padding: 8px; background: #e2e3e3; color: #999;">{{feedCounts}}条动态</div>
    </div>
  </div>
</template>

<script>
  import defaultBackgroundPic from '../statics/images/default_cover.png';
  import { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import { getUserInfo, followingUser, unFollowingUser } from '../utils/user';
  import { NOTICE } from '../stores/types';
  import getImg from '../utils/getImage';
  import { friendNum } from '../utils/friendNum';
  import timers from '../utils/timer';
  import contains from '../utils/contains';

  const currentUser = localEvent.getLocalItem('UserLoginInfo');
  const UserFeeds = {
    data: () => ({
      currentUser: currentUser.user_id, // 当前登录用户
      userInfo: {} // 当前被查看着用户信息
    }),
    methods: {
      timers
    },
    computed: {
      avatar () {
        const { avatar: { 30: avatar = '' } = {} } = this.userInfo;
        return avatar;
      },
      feedCounts () {
        const { counts: { feeds_count = 0 } = {} } = this.userInfo;
        return feeds_count;
      },
      following () {
        const { counts: { following_count = 0 } = {} } = this.userInfo;
        return following_count;
      },
      followed () {
        const { counts: { followed_count = 0 } = {} } = this.userInfo;
        return followed_count;
      },
      introText () {
        const { datas: { intro: { value: intro = '还没有简介呢' } = {} } } = this.userInfo;
        return intro;
      },
      coverImg () {
        const { datas: { cover: { value: cover = 0 } = {} } } = this.userInfo;
        if(cover) {
          return getImg(cover, 100);
        } else {
          return defaultBackgroundPic;
        }
      }
    },
    created () {
      let user_id = parseInt(this.$route.params.user_id);
      if ( !user_id && !this.currentUser ) {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: '发生一些错误',
            time: 1500,
            status: false
          });
        });
        this.goBack();
        return;
      }
      user_id = user_id ? user_id : currentUser;
      this.userInfo = { ...this.userInfo, ...localEvent.getLocalItem(`user_${user_id}`) };
      // 获取动态列表
      addAccessToken().get(createAPI(`feeds/users/${user_id}`), {},
        {
          validateStatus: status => status === 200
        }
      )
      .then(response => {
        // 组装数据 
        let feeds = response.data.data;
        let formateFeeds = {};
        let dates = [];
        let today = new window.Date().toLocaleDateString();
        let yesterday = new window.Date(new Date()-24*60*60*1000).toLocaleDateString();
        console.log(today, yesterday);
        feeds.forEach((feed) => {
          // feed.feed.created_at
          let createDate = new window.Date(this.timers(feed.feed.created_at, 8, false)).toLocaleDateString();
          if(!contains(dates, createDate)){
            dates.push(createDate);
          }
          console.log(dates);
        });
      })
      .catch(({ response: { message = '网络状况堪忧啊' } = {} } ) => {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: message,
            time: 1500,
            status: true
          });
        });
      })
    }
  };

  export default UserFeeds;
</script>

<style lang="scss" module>
  .userCover {
    width: 100%;
    .coverImg {
      width: 100%;
    }
  }
  .userProfile {
    width: 100%;
    margin-top: -11vh;
    .avatar {
      width: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 25%;
        border-radius: 50%;
      }
    }
    .name {
       text-align: center; 
       padding: 1vh 0;
    }
    .intro {
      padding: 1vh 20px 2vh 20px;
      p {
        color: #999;
        font-size: 14px;
        text-align: center;
      }
    }
    .follows {
      padding: 1vh 0 3vh 0;
      .followed {
        display: flex;
        justify-content: flex-end;
      }
      .counts{
        color: #59b6d7;
      }
    }
  }
</style>