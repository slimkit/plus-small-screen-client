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
          <Col span="12" :class="$style.following">
            关注 <span :class="$style.counts">{{following}}</span>
          </Col>
        </Row>
      </div>
    </div>
    <div :class="$style.feeds">
      <div style="padding: 8px; background: #e2e3e3; color: #999;">{{feedCounts}}条动态</div>
      <div :class="$style.feedContainer">
        <UserFeed v-for="feed in feeds" :feed="feed" :key="feed.id"> </UserFeed>
      </div>
    </div>
    
  </div>
</template>

<script>
  import defaultBackgroundPic from '../statics/images/default_cover.png';
  import { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import { getUserInfo, followingUser, unFollowingUser } from '../utils/user';
  import { NOTICE, USERFEEDS, APPENDUSERFEED, CLEANUSERFEEDS, DATES } from '../stores/types';
  import getImg from '../utils/getImage';
  import { friendNum } from '../utils/friendNum';
  import timers from '../utils/timer';
  import contains from '../utils/contains';
  import { mapState } from 'vuex';
  import UserFeed from '../components/UserFeed';

  const currentUser = localEvent.getLocalItem('UserLoginInfo');
  const UserFeeds = {
    components: {
      UserFeed
    },
    data: () => ({
      currentUser: currentUser.user_id, // 当前登录用户
      userInfo: {}, // 当前被查看着用户信息
      user_id: 0
    }),
    methods: {
      timers,
      // 加载更多
      loadMore () {
        addAccessToken().get(createAPI(`feeds/users/${this.user_id}?max_id=2`),{},
          {
            validateStatus: status => status === 200
          }
        )
        .then(response => {

        })
        .catch(error => {

        })
      }
    },
    computed: {
      ...mapState({
        feeds: state => state.userFeeds.userFeeds
      }),
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
    beforeCreate () {
      // 页面创建之前 清理之前的旧数据
      this.$store.dispatch(CLEANUSERFEEDS);
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
      user_id = this.user_id = user_id ? user_id : currentUser;
      this.userInfo = { ...this.userInfo, ...localEvent.getLocalItem(`user_${user_id}`) };
      // 获取动态列表
      addAccessToken().get(createAPI(`feeds/users/${user_id}`), {},
        {
          validateStatus: status => status === 200
        }
      )
      .then(response => {
        // 组装数据 
        let dayFeeds = [];
        let feeds = response.data.data;
        let formateFeeds = [];
        let today = new window.Date().toLocaleDateString();
        let yesterday = new window.Date(new Date()-24*60*60*1000).toLocaleDateString();
        feeds.forEach((feed) => {
          // 获取动态生成日期
          let timestamp = new window.Date(this.timers(feed.feed.created_at, 8, false));
          let createDate = timestamp.toLocaleDateString();
          feed.month = '';
          feed.date = '';
          feed.created_at = '';
          if(createDate !== yesterday && createDate !== today) {
             feed.month = timestamp.getMonth() + 1;
             feed.date = timestamp.getDate();
          }
          if(createDate === yesterday) {
            feed.created_at = '昨天';
          }
          if(createDate === today) {
            feed.created_at = '今天';
          }
          dayFeeds.push(feed);
        });
        this.$store.dispatch(USERFEEDS, cb => {
          cb(dayFeeds);
        })
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
    display: flex;
    align-items: center;
    justify-content: center;
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
      .following {
        display: flex;
        justify-content: flex-start;
      }
      .counts{
        color: #59b6d7;
        padding-left: 5px;
      }
    }
  }
</style>