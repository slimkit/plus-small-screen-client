<template>
  <div class="feed-diggs-container" :class="$style.diggListsRoot">
    <header class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="6" style="display: flex; justify-content: flex-start" @click.native="goTo(-1)">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          点赞榜
        </Col>
        <Col span="4" class="header-end-col">
        </Col>
      </Row>
    </header>
    <div class="nothingDefault"> 
      <img v-if="nothing" :src="nothing" />
    </div>
    <mt-loadmore
      v-show="!nothing"
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="bottomAllLoaded"
      ref="loadmoreDigglist"
      bottomPullText="上拉加载更多"
      bottomDropText="释放加载更多"
    >
      <div class="feed-diggs-container-list diggs-background-color">
        <li v-for="(digg, index) in diggList" :class="$style.perDiggParent" :key="index">
          <Row :gutter="24" :class="$style.perDigg">
            <Col span="4" @click.native="changeUrl(`/users/feeds/${digg.user_id}`)">
              <img :class="$style.diggAvatar" v-lazy="digg.avatar" :alt="digg.name" :title="digg.name">
            </Col>
            <Col span="15">
              <h4 @click="changeUrl(`/users/feeds/${digg.user_id}`)">{{ digg.name }}</h4>
              <p>{{ digg.intro }}</p>
            </Col>
            <Col span="4" >
              <UnFollowingIcon @click.native="doFollowing(digg.user_id)" v-if="!digg.is_following && currentUser != digg.user_id" height="21" width="21" color="#999" />
              <FollowingIcon @click.native="doUnFollowing(digg.user_id)" v-if="digg.is_following && !digg.is_followed && currentUser != digg.user_id" height="21" width="21" color="#59b6d7" />
              <EachFollowingIcon @click.native="doUnFollowing(digg.user_id)" v-if="digg.is_following && digg.is_followed && currentUser != digg.user_id" height="21" width="21" color="#59b6d7" />
            </Col>
          </Row>
        </li>
      </div>
      <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomAllLoaded">没有更多了</span>
        <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
        <span v-show="bottomStatus === 'loading'">加载中...</span>
        <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
      </div>
    </mt-loadmore>
  </div>
</template>
<script>
  /**
   * 动态点赞用户列表
   */
  import { mapState } from 'vuex';
  import localEvent from '../stores/localStorage';
  import { followingUser, unFollowingUser } from '../utils/user';
  import { NOTICE } from '../stores/types';
  import FollowingIcon from '../icons/Following';
  import UnFollowingIcon from '../icons/UnFollowing';
  import EachFollowingIcon from '../icons/EachFollowing';
  import BackIcon from '../icons/Back';
  import lodash from 'lodash';
  import { changeUrl, goTo } from '../utils/changeUrl';
  import { resolveImage } from '../utils/resource';
  import { createAPI, addAccessToken } from '../utils/request';
  import { getUserInfo } from '../utils/user';

  const defaultNoBody = resolveImage(require('../statics/images/img_default_nobody@2x.png'));
  const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));

  const FeedDiggsLists = {
    components: {
      FollowingIcon,
      UnFollowingIcon,
      EachFollowingIcon,
      BackIcon
    },
    data: () => ({
      // 加载更多相关
      bottomAllLoaded: true,
      page: 0,
      bottomStatus: '',
      currentUser: 0,
      localDiggs: {},
      isWeiXin: TS_WEB.isWeiXin,
      topStatus: ''
    }),
    methods: {
      goTo,
      changeUrl,
      // 加载更多
      loadBottom() {
        setTimeout(() => {
          // 若数据已全部获取完毕
          this.bottomStatus = '';
          this.bottomAllLoaded = false;
          this.$refs.loadmoreDigglist.onBottomLoaded();
        }, 500);
      },
      // 加载最新
      loadTop () {
        setTimeout(() => {
          // 若数据已全部获取完毕
          this.$refs.loadmoreDigglist.onTopLoaded();
        }, 500);
      },
      // 关注用户
      doFollowing (user) {
        followingUser(user)
        .then(status => {
          if(status.status || status.code == 0) {
            this.localDiggs[user].is_following = 1;
            this.localDiggs = { ...this.localDiggs, [user]: this.localDiggs[user] };
            localEvent.setLocalItem(`user_${user}`, this.localDiggs[user]);
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
      // 取消关注用户
      doUnFollowing (user) {
        unFollowingUser(user)
        .then(() => {
          this.localDiggs[user].is_following = 0;
          this.localDiggs = { ...this.localDiggs, [user]: this.localDiggs[user] };
          localEvent.setLocalItem(`user_${user}`, this.localDiggs[user]);
        })
        .catch( error => {

        });
      }
    },
    computed: {
      diggList () {
        let diggList = {};
        for(let index in this.localDiggs) {
          let localUser = localEvent.getLocalItem(`user_${index}`);
          if(!lodash.keys(localUser).length) {
            getUserInfo(index).then( user => {
              const { datas: { intro: { value: intro = '还没有简介...' } = {} } = {} } = user;
              const { avatar = defaultAvatar } = user;
              diggList = { ...diggList, [index]: {
                  is_following: user.is_following,
                  is_followed: user.is_followed,
                  user_id: index,
                  avatar: avatar,
                  name: user.name,
                  intro: intro
                }
              }
            });
          } else {
            const { datas: { intro: { value: intro = '还没有简介...' } = {} } = {} } = localUser;
            const { avatar = defaultAvatar } = localUser;
            diggList = { ...diggList, [index]: {
                is_following: localUser.is_following,
                is_followed: localUser.is_followed,
                user_id: index,
                avatar: localUser.avatar,
                name: localUser.name,
                intro: intro
              }
            }
          }
        }
        return diggList;
      },
      nothing () {
        return lodash.keys(this.localDiggs).length > 0 ? 0 : defaultNoBody;
      }
    },
    created () {
      let feed_id = parseInt(this.$route.params.feed_id);
      if ( !feed_id ) {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: '发生一些错误',
            time: 1500,
            status: false
          });
        });
        setTimeout(() => {
          this.goTo(-1);
        }, 1500);
        return;
      }
      let currentUser = localEvent.getLocalItem('UserLoginInfo');
      this.currentUser = currentUser.user_id;
      addAccessToken().get(createAPI(`feeds/${feed_id}/likes`), {}, {
          validateStatus: status => status === 200
        }
      )
      .then( ({data = {}}) => {
        let diggUsers = data;
        let localUser = {};
        let diggFormate = {};
        let length = diggUsers.length;
        if(!length) {
          this.bottomAllLoaded = true;
          return;
        }
        if(length < 15) {
          this.bottomAllLoaded = true;
        }
        diggUsers.forEach( diggUser => {
          getUserInfo(diggUser.user_id).then( user => {
            this.localDiggs = { ...this.localDiggs, [diggUser.user_id]: user };
          });
        });
      });
      setTimeout( () => {
        if(this.$refs.loadmoreDigglist)
          this.$refs.loadmoreDigglist.onTopLoaded();
      }, 500)
    }
  };

  export default FeedDiggsLists;
</script>
<style lang="scss" module>
  .diggListsRoot {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    overflow: hidden;
    background: #fff;
    z-index: 10;
    display: block;
    height: 100%;
    width: 100%;
  }
  .diggAvatar {
    width: 100%;
    border-radius: 50%;
  }
  .perDiggParent{
    border-bottom: 1px #e2e2e2 solid;
    padding: 12px 0;
    .perDigg {
      display: -webkit-flex;
      display: flex;
      align-items: center;
      -webkit-align-items: center;
      justify-content: center;
      -webkit-justify-content: center;
    }
  }
  
</style>
<style lang="scss" scoped>
  .feed-diggs-container-header {
    height: 45px;
    border-bottom: 1px #ddd solid;
    .ivu-row {
      width: 100%;
    }
    .ivu-row, .ivu-col {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        height: 100%;
      }
      a {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        padding: 5px 0;
      }
    }
  }
  .mint-loadmore {
    padding-bottom: 50px;
    overflow: initial;
  }
</style>
