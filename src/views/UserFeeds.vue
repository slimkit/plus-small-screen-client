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
              <Col span="12" :class="$style.followed" @click.native="changeUrl(`/users/relationship/${user_id}/followers`)">
                粉丝 <span :class="$style.counts">{{followed}}</span>
              </Col>
              <Col span="12" :class="$style.following" @click.native="changeUrl(`/users/relationship/${user_id}/followings`)">
                关注 <span :class="$style.counts">{{following}}</span>
              </Col>
            </Row>
          </div>
        </div>
        <div :class="$style.feeds" v-if="!nothing">
          <div style="padding: 8px; background: #f4f5f5; color: #999;">{{feedCounts}}条动态</div>
          <div :class="$style.feedContainer">
            <UserFeed v-for="feed in feedList" :feed="feed" :key="feed.id" />
          </div>
        </div>
        <div v-if="nothing" :class="$style.nothingDefault">
          <img style="padding-top: 6vh" :src="nothing" />
        </div>
      </div>
      <div slot="bottom" v-if="!nothing" class="loadMoreBottom" :class="{hasNoMore: loadMoreBottomStyle == 0, noMore: loadMoreBottomStyle == 1, hasHalfMore: loadMoreBottomStyle == 2}">
        <span v-if="bottomAllLoaded && bottomStatus !== 'loading' && !nothing && hasNoMore">没有更多了</span>
        <section v-else>
          <span v-show="bottomStatus === 'loading' && !bottomAllLoaded">加载中...</span>
          <span v-show="bottomStatus === 'pull' && !bottomAllLoaded">上拉加载更多</span>
          <span v-show="bottomStatus === 'drop'">释放加载更多</span>
        </section>
      </div>
    </mt-loadmore>
    <div v-if="currentUser != user_id" :class="$style.followStatus">
      <div class="actionButton" @click="handleFollowingStatus(followAction.status ? true : false)">
        <UnFollowingIcon v-if="followAction.text == '关注'" height="21" width="21" color="#333"/>
        <FollowingIcon v-if="followAction.text == '已关注'" height="21" width="21" color="#59b6d7"/>
        <EachFollowingIcon v-if="followAction.text == '相互关注'" height="21" width="21" color="#59b6d7"/>
        <span :class="{ following: followAction.status, noFollowing: !followAction.status }"> {{ followAction.text }} </span>
      </div>
      <div v-if="im_token" class="actionButton" @click="imMessage">
        <CommentIcon width="21" height="21" color="#333" />
        <span class="noFollowing"> 聊天 </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { createAPI, addAccessToken, createOldAPI } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import { followingUser, unFollowingUser, getLoggedUserInfo, getUserInfo } from '../utils/user';
  import { NOTICE, FEEDSLIST, USERFEEDS, APPENDUSERFEED, CLEANUSERFEEDS, DATES, GETUSERFEEDS, MESSAGELISTS } from '../stores/types';
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
  import { goTo, changeUrl } from '../utils/changeUrl';
  import { resolveImage } from '../utils/resource';
  import buildUrl from 'axios/lib/helpers/buildURL';

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
      currentUser: window.TS_WEB.currentUserId, // 当前登录用户
      userInfo: {}, // 当前被查看着用户信息
      user_id: 0,
      bottomAllLoaded: false,
      bottomStatus: '',
      max_id: 0,
      hasNoMore: false,
      im_token: window.TS_WEB.im_token

    }),
    methods: {
      changeUrl,  
      goBack() {
        goTo(-1);
      },
      imMessage () {
        addAccessToken().post(
          createOldAPI('im/conversations'),
          {
            type: 0,
            uids: [
              this.user_id,
              window.TS_WEB.currentUserId
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
          if(uids[0] == window.TS_WEB.currentUserId) {
            uid = uids[1];
          } else {
            uid = uids[0];
          }
          window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.chatroom, () => {
            window.TS_WEB.dataBase.chatroom.where('cid').equals(data.cid).count( count => {
              if(!count) {
                window.TS_WEB.dataBase.chatroom.put({
                  cid: data.cid,
                  user_id: data.user_id,
                  name: data.name,
                  pwd: data.pwd,
                  uids: data.uids,
                  type: data.type,
                  last_message_time: 0
                });
              }
            })
          });
          this.$store.dispatch(MESSAGELISTS, cb => {
            cb({
              name: this.userInfo.name,
              avatar: this.userInfo.avatar,
              lists: [],
              cid: data.cid,
              user_id: window.TS_WEB.currentUserId
            });
          });
          this.$router.push(`/users/message/${uid}/${data.cid}`);
        })
        .catch( error => {
          console.log(error);
        });
      },
      handleFollowingStatus (status) {
        if(status) {
          this.handleUnfollowing();
        } else {
          this.handleFollowing();
        }
      },
      // 关注操作
      handleFollowing() {
        followingUser(this.user_id)
        .then( status => {
          if (status) {
            this.userInfo.follower = true;
            // 更新页面数据
            this.userInfo.extra.followers_count += 1;

          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '关注失败,可能是已经关注了',
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
        .then( status => {
          if (status) {
            this.userInfo.follower = false;
            // 更新页面数据
            this.userInfo.extra.followers_count -= 1;

          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '取关失败,可能是还没关注',
                time: 1500,
                status: true
              });
            });
          }
        });
      },

      // 检测底部loading的状态变化
      bottomStatusChange (status) {
        this.bottomStatus = status;
      },

      timers,
      
      // 加载更多
      loadBottom () {
        if(this.max_id == 0) {
          setTimeout(() => {
            this.$refs.loadmore.onBottomLoaded();
          }, 500);
          return;
        }
        addAccessToken().get(createAPI(`feeds?user=${this.user_id}&after=${this.max_id}&limit=15`),{},
          {
            validateStatus: status => status === 200
          }
        )
        .then(({ data = {} }) => {
          let moreFeeds = data.feeds;
          let length = moreFeeds.length;
          let ids = [];
          let feeds = {};
          if(length < 15) {
            this.bottomAllLoaded = true;
          }
          if(length) {
            moreFeeds.forEach((feed) => {
              ids.push(feed.id);
              feeds[feed.id] = feed;
              this.max_id = feed.id;
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
          let timestamp = new window.Date(this.timers(feed.created_at, 8, false));
          let createDate = timestamp.toLocaleDateString();
          feed.month = '';
          feed.date = '';
          if(createDate != yesterday && createDate != today) {
             feed.month = timestamp.getMonth() + 1;
             feed.date = timestamp.getDate();
          }
          if(createDate == yesterday) {
            feed.date = '昨天';
          }
          if(createDate == today) {
            feed.date = '今天';
          }
          dayFeeds.push(feed);
          max_id = feed.id;
        });
        return dayFeeds;
      }
    },
    computed: {
      // 根据关注按钮来确认loadmore的样式
      loadMoreBottomStyle () {
        // loadmore 底部margin状态
        let MarginLoadMoreBottom = 0;

        if(window.TS_WEB.currentUserId != this.user_id) {
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
        if(window.TS_WEB.currentUserId != this.user_id) {
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
        if(this.userInfo.following && this.userInfo.follower) {
          return {
            status: true,
            text: '相互关注'
          };
        }
        if(!this.userInfo.follower) {
          return {
            status: false,
            text: '关注'
          }
        }
        if(!this.userInfo.following && this.userInfo.follower) {
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
        const { avatar = defaultAvatar } = this.userInfo;
        return avatar;
      },
      feedCounts () {
        const { extra: { feeds_count = 0 } = {} } = this.userInfo;
        return feeds_count;
      },
      following () {
        const { extra: { followings_count = 0 } = {} } = this.userInfo;
        return followings_count;
      },
      followed () {
        const { extra: { followers_count = 0 } = {} } = this.userInfo;
        return followers_count;
      },
      introText () {
        const { bio = '还没有简介呢' } = this.userInfo;
        return bio;
      },
      // 封面
      coverImg () {
        const { bg = '' } = this.userInfo;
        return bg ? bg : defaultBackgroundPic;
      },
      feedList () {
        let feeds = [ ...this.$store.getters[GETUSERFEEDS]];
        return this.fomateFeeds(feeds);
      }
    },
    beforeCreate () {
      // 页面创建之前 清理之前的旧数据
      this.$store.dispatch(CLEANUSERFEEDS);
    },
    created () {
      let user_id = parseInt(this.$route.params.user_id);
      if ( !user_id && !window.TS_WEB.currentUserId ) {
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
      this.user_id = (window.TS_WEB.currentUserId != user_id) ? user_id : window.TS_WEB.currentUserId;
      getUserInfo(this.user_id).then( user => {
        this.userInfo = { ...this.userInfo, ...user };
      });
      // 获取动态列表
      addAccessToken().get(createAPI(`feeds?type=users&user=${this.user_id}&limit=15`), {},
        {
          validateStatus: status => status === 200
        }
      )
      .then(({ data = {} = {} }) => {
        let feeds = data.feeds;
        if(!feeds.length){
          this.hasNoMore = false;
          this.bottomAllLoaded = true;
          return;
        } 
        this.hasNoMore = true;
        if(feeds.length < 15) {
          this.hasNoMore = false;
          this.bottomAllLoaded = true;
        }
        let ids = [];
        let storeFeeds = {};
        this.max_id = feeds[feeds.length - 1].id;
        feeds.forEach( feed => {
          ids.push(feed.id);
          storeFeeds[feed.id] = feed;
        });
        this.$store.dispatch(FEEDSLIST, cb => {
          cb(storeFeeds);
        })
        this.$store.dispatch(USERFEEDS, cb => {
          cb(ids);
        })
        setTimeout(() => {
          this.$refs.loadmore.onTopLoaded();
        }, 500);
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
    border-top: 1px solid #ededed;
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