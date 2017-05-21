<template>
  <div class="userFeeds">
    <mt-loadmore
      :bottom-method="loadBottom"
      :bottom-all-loaded="bottomAllLoaded"
      ref="loadmore"
      :bottomDistance="50"
      @bottom-status-change="bottomStatusChange"
      :class="{noBottom: mintPaddingBottomStyle == 0, hasBottom: mintPaddingBottomStyle == 1, myHasBottom: mintPaddingBottomStyle == 2, hasHalfBottom: mintPaddingBottomStyle == 3}"
    >
      <div>
        <div :class="$style.navBar">
          <div :class="$style.back" @click="goBack">
            <BackIcon height="24" width="24" color="#fff" />
          </div>
          <div :class="$style.share">
            <ShareIcon height="24" width="24" color="#fff" />
          </div>
        </div>
        <div :class="$style.userCover">
          <img :class="$style.coverImg" :src="coverImg" :alt="userInfo.name"/>
        </div>
        <div :class="$style.userProfile">
          <div :class="$style.avatar">
            <img v-lazy="avatar" :alt="userInfo.name">
          </div>
          <h4 :class="$style.name">{{userInfo.name}}</h4>
          <div :class="$style.intro">
            <p>
              {{introText}}
            </p>
          </div>
          <div :class="$style.follows">
            <Row :gutter="24">
              <Col span="12" :class="$style.followed">
                粉丝 <span :class="$style.counts">{{followed}}</span>
              </Col>
              <Col span="12" :class="$style.following">
                关注 <span :class="$style.counts">{{following}}</span>
              </Col>
            </Row>
          </div>
        </div>
        <div :class="$style.feeds" v-if="!nothing">
          <div style="padding: 8px; background: #f4f5f5; color: #999;">{{feedCounts}}条动态</div>
          <div :class="$style.feedContainer">
            <UserFeed v-for="feed in feedList" :feed="feed" :key="feed.feed_id" />
          </div>
        </div>
        <div v-if="nothing" :class="$style.nothingDefault">
          <img style="padding-top: 6vh" :src="nothing" />
        </div>
      </div>
      <div slot="bottom" v-if="!nothing" class="loadMoreBottom" :class="{hasNoMore: loadMoreBottomStyle == 0, noMore: loadMoreBottomStyle == 1, hasHalfMore: loadMoreBottomStyle == 2}">
        <span v-show="bottomAllLoaded && bottomStatus !== 'loading' && !nothing && hasNoMore">没有更多了</span>
        <span v-show="bottomStatus === 'loading' && !bottomAllLoaded">加载中...</span>
        <span v-show="bottomStatus === 'pull' && !bottomAllLoaded">上拉加载更多</span>
        <span v-show="bottomStatus === 'drop'">释放加载更多</span>
      </div>
    </mt-loadmore>
    <div v-if="currentUser != user_id" :class="$style.followStatus">
      <div class="actionButton" @click="handleFollowingStaus(followAction.status ? true : false)">
        <UnFollowingIcon v-if="followAction.text == '关注'" height="21" width="21" color="#333"/>
        <FollowingIcon v-if="followAction.text == '已关注'" height="21" width="21" color="#59b6d7"/>
        <EachFollowingIcon v-if="followAction.text == '相互关注'" height="21" width="21" color="#59b6d7"/>
        <span :class="{ following: followAction.status, noFollowing: !followAction.status }"> {{ followAction.text }} </span>
      </div>
      <div class="actionButton" @click="imMessage">
        <CommentIcon width="21" height="21" color="#333" />
        <span class="noFollowing"> 聊天 </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { createAPI, addAccessToken } from '../utils/request';
  import { getUserInfo } from '../utils/user';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import { followingUser, unFollowingUser } from '../utils/user';
  import { NOTICE, FEEDSLIST, USERFEEDS, APPENDUSERFEED, CLEANUSERFEEDS, DATES, GETUSERFEEDS } from '../stores/types';
  import getImg from '../utils/getImage';
  import { friendNum } from '../utils/friendNum';
  import timers from '../utils/timer';
  import contains from '../utils/contains';
  import { mapState } from 'vuex';
  import UserFeed from '../components/UserFeed';
  import FollowingIcon from '../icons/Following';
  import UnFollowingIcon from '../icons/UnFollowing';
  import EachFollowingIcon from '../icons/EachFollowing';
  import BackIcon from '../icons/Back';
  import ShareIcon from '../icons/Share';
  import CommentIcon from '../icons/Comment';
  import { goTo } from '../utils/changeUrl';
  import { resolveImage } from '../utils/resource';

  const defaultNothing =  resolveImage(require('../statics/images/defaultNothingx3.png'));
  const defaultBackgroundPic = resolveImage(require('../statics/images/default_cover.png'));
  const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));

  const UserFeeds = {
    components: {
      UserFeed,
      FollowingIcon,
      UnFollowingIcon,
      EachFollowingIcon,
      BackIcon,
      ShareIcon,
      CommentIcon
    },
    data: () => ({
      currentUser: 0, // 当前登录用户
      userInfo: {}, // 当前被查看着用户信息
      user_id: 0,
      bottomAllLoaded: false,
      bottomStatus: '',
      max_id: 0,
      hasNoMore: false

    }),
    methods: {
      goBack() {
        goTo(-1);
      },
      imMessage () {
        addAccessToken().post(
          createAPI('im/conversations'),
          {
            type: 0,
            uids: [
              this.user_id,
              this.currentUser
            ]
          },
          {
            validateStatus: status => status === 200
          }
        )
        .then( response => {
          let data = response.data.data;
          let uids = data.uids.split(',');
          let uid = 0;
          if(uids[0] == this.currentUser) {
            uid = uids[1];
          } else {
            uid = uids[0];
          }
          this.$router.push(`/users/message/${uid}/${data.cid}`);
        })
        .catch( error => {
          console.log(error);
        });
      },
      handleFollowingStaus (status) {
        if(status) {
          this.handleUnfollowing();
        } else {
          this.handleFollowing();
        }
      },
      // 关注操作
      handleFollowing() {
        followingUser(this.user_id)
        .then(status => {
          if(status.status || status.code == 0) {
            this.userInfo = { ...this.userInfo, is_following: 1 };
            localEvent.setLocalItem(`user_${this.user_id}`, this.userInfo);
          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: status.message,
                time: 1500,
                status: true
              });
            });
          }
        })
      },
      // 取关操作
      handleUnfollowing () {
        unFollowingUser(this.user_id)
        .then(() => {
          this.userInfo = { ...this.userInfo, is_following: 0 };
          localEvent.setLocalItem(`user_${this.user_id}`, this.userInfo);
        })
        .catch( error => {

        });
      },
      // 检测底部loading的状态变化
      bottomStatusChange (status) {
        this.bottomStatus = status;
      },
      timers,
      // 加载更多
      loadBottom () {
        if(this.max_id == 0) return;
        addAccessToken().get(createAPI(`feeds/users/${this.user_id}?max_id=${this.max_id}`),{},
          {
            validateStatus: status => status === 200
          }
        )
        .then(response => {
          let data = response.data.data;
          let length = data.length;
          let ids = [];
          let feeds = {};
          if(length < 15) {
            this.bottomAllLoaded = true;
          }
          if(length) {
            data.forEach((feed) => {
              ids.push(feed.feed.feed_id);
              feeds[feed.feed.feed_id] = feed;
              this.max_id = feed.feed.feed_id;
            });
            this.$store.dispatch(USERFEEDS, cb => {
              cb(ids);
            });
            this.$store.dispatch(FEEDSLIST, cb => {
              cb(feeds);
            })
          }
          setTimeout(() => {
            this.$refs.loadmore.onBottomLoaded();
          }, 500);
        })
      },
      // 组装多条数据
      fomateFeeds (feeds) {
        // 组装数据 
        let dayFeeds = [];
        let max_id = 0;
        let today = new window.Date().toLocaleDateString();
        let yesterday = new window.Date(new Date()-24*60*60*1000).toLocaleDateString();
        feeds.forEach((feed) => {
          // 获取动态生成日期
          let timestamp = new window.Date(this.timers(feed.feed.created_at, 8, false));
          let createDate = timestamp.toLocaleDateString();
          feed.month = '';
          feed.date = '';
          feed.created_at = '';
          if(createDate != yesterday && createDate != today) {
             feed.month = timestamp.getMonth() + 1;
             feed.date = timestamp.getDate();
          }
          if(createDate == yesterday) {
            feed.created_at = '昨天';
          }
          if(createDate == today) {
            feed.created_at = '今天';
          }
          dayFeeds.push(feed);
          max_id = feed.feed.feed_id;
        });
        return dayFeeds;
      }
    },
    computed: {
      // 根据关注按钮来确认loadmore的样式
      loadMoreBottomStyle () {
        // loadmore 底部margin状态
        let MarginLoadMoreBottom = 0;

        if(this.currentUser != this.user_id) {
          MarginLoadMoreBottom = 1;
        } else {
          // 第一次加载内容不足15条 没有margin值
          if(!this.hasNoMore) {
            MarginLoadMoreBottom = 2;
          }
        }
        return MarginLoadMoreBottom
      },
      mintPaddingBottomStyle () {
        let mintPaddingBottom = 0;
        if(this.currentUser != this.user_id) {
          if(this.bottomAllLoaded == true) {
            mintPaddingBottom = 1;
          } else {
            mintPaddingBottom = 3;
          }
        } else {
          if(this.bottomAllLoaded == true) {
            if(!this.hasNoMore) {
              mintPaddingBottom = 0;
            } else {
              mintPaddingBottom = 2;
            }
          }
        }
        return mintPaddingBottom;
      },
      ...mapState({
        feeds: state => state.userFeeds.userFeeds
      }),
      followAction () {
        if(this.userInfo.is_following && this.userInfo.is_followed) {
          return {
            status: true,
            text: '相互关注'
          };
        }
        if(!this.userInfo.is_following) {
          return {
            status: false,
            text: '关注'
          }
        }
        if(this.userInfo.is_following && !this.userInfo.is_followed) {
          return {
            status: true,
            text: '已关注'
          }
        }
      },
      nothing () {
        let feedLength = this.$store.getters[USERFEEDS];
        return feedLength.length ? 0 : defaultNothing;
      },
      avatar () {
        const { avatar: { 30: avatar = defaultAvatar } = {} } = this.userInfo;
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
        const { datas: { intro: { value: intro = '还没有简介呢' } = {} } = {} } = this.userInfo;
        return intro;
      },
      coverImg () {
        const { datas: { cover: { value: cover = 0 } = {} } = {} } = this.userInfo;
        if(cover) {
          return getImg(cover, 100);
        } else {
          return defaultBackgroundPic;
        }
      },
      feedList () {
        let feeds = this.$store.getters[GETUSERFEEDS];
        return this.fomateFeeds(feeds);
      }
    },
    beforeCreate () {
      // 页面创建之前 清理之前的旧数据
      this.$store.dispatch(CLEANUSERFEEDS);
    },
    created () {
      let currentUser = localEvent.getLocalItem('UserLoginInfo');
      this.currentUser = currentUser.user_id;
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
      this.user_id = this.currentUser != user_id ? user_id : this.currentUser;
      // this.userInfo = { ...this.userInfo, ...localEvent.getLocalItem(`user_${this.user_id}`) };
      getUserInfo(this.user_id, 30).then( user => {
        this.userInfo = { ...this.userInfo, ...user };
      });
      // 获取动态列表
      addAccessToken().get(createAPI(`feeds/users/${this.user_id}`), {},
        {
          validateStatus: status => status === 200
        }
      )
      .then(response => {
        let feeds = response.data.data;
        if(!feeds.length) return;
        this.hasNoMore = true;
        if(feeds.length < 15) {
          this.hasNoMore = false;
          this.bottomAllLoaded = true;
        }
        let ids = [];
        let storeFeeds = {};
        this.max_id = feeds[feeds.length - 1].feed.feed_id;
        feeds.forEach( feed => {
          ids.push(feed.feed.feed_id);
          storeFeeds[feed.feed.feed_id] = feed;
        });
        this.$store.dispatch(FEEDSLIST, cb => {
          cb(storeFeeds);
        })
        this.$store.dispatch(USERFEEDS, cb => {
          cb(ids);
        })
        setTimeout(() => {
          this.$refs.loadmore.onTopLoaded();
          this.$refs.loadmore.onBottomLoaded();
        }, 200);
      })
    }
  };

  export default UserFeeds;
</script>

<style lang="scss" module>
  .navBar {
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0; 
    left: 0;
    right: 0;
    height: 55px;
  }
  .userCover {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .coverImg {
      width: 100%;
    }
  }
  .nothingDefault {
    display: flex; 
    align-items: center;
    justify-content: center;
    img {
      width: 60%;
    }
  }
  .userProfile {
    width: 100%;
    margin-top: -11vh;
    background: #fff;
    .avatar {
      width: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 30vw;
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
  .followStatus {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-top: 1px solid #e2e3e3;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
<style lang="scss" scope>
  .loadMoreBottom {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
  }
  .hasNoMore {
    margin-bottom:  -40px;
  }
  .hasHalfMore {
    margin-bottom: -30px;
  }
  .noMore {
    margin-bottom: 0;
    padding: 0;
  }
  .noBottom {
    padding-bottom: 10px;
  }
  .hasBottom {
    padding-bottom: 55px;
  }
  .myHasBottom {
    padding-bottom: 45px;
  }
  .hasHalfBottom {
    padding-bottom: 30px;
  }
  .noFollowing {
    color: #333;
    font-size: 16px;
    margin-left: 8px;
  }
  .following {
    color: #59b6d7;
    font-size: 16px;
    margin-left: 8px;
  }
  .actionButton {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>