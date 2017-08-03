<template>
  <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
    <div class="feed-diggs-container" :class="$style.diggListsRoot" v-if="show">
      <div class="commonHeader">
        <Row :gutter="24">
          <Col span="5" style="display: flex; justify-content: flex-start" @click.native="handleShowDiggList">
            <BackIcon height="21" width="21" color="#999" />
          </Col>
          <Col span="14" class="title-col">
            点赞榜
          </Col>
          <Col span="5" style="display: flex;">
          </Col>
        </Row>
      </div>
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
              <Col span="4" @click.native="rediredtUrl(`/users/feeds/${digg.user_id}`)">
                <img :class="$style.diggAvatar" v-lazy="digg.avatar" :alt="digg.name" :title="digg.name">
              </Col>
              <Col span="15">
                <h4 @click="rediredtUrl(`/users/feeds/${digg.user_id}`)">{{ digg.name }}</h4>
                <p>{{ digg.intro ? digg.intro : '还没有简介...' }}</p>
              </Col>
              <Col span="4">
                <UnFollowingIcon @click.native="doFollowing(digg.user_id)" v-if="!digg.is_following && currentUser != digg.user_id" height="21" width="21" color="#999" />
                <FollowingIcon @click.native="doUnFollowing(digg.user_id)" v-if="digg.is_following && !digg.is_followed && currentUser != digg.user_id" height="21" width="21" color="#999" />
                <EachFollowingIcon @click.native="doUnFollowing(digg.user_id)" v-if="digg.is_following && digg.is_followed && currentUser != digg.user_id" height="21" width="21" color="#999" />
              </Col>
            </Row>
          </li>
        </div>
      </mt-loadmore>
    </div>
  </transition>
</template>
<script>
  /**
   * 动态点赞用户列表
   */
  import { SHOWFEEDDIGGSLISTS, DIGGLISTS } from '../stores/types';
  import { mapState } from 'vuex';
  import { followingUser, unFollowingUser } from '../utils/user';
  import { NOTICE } from '../stores/types';
  import FollowingIcon from '../icons/Following';
  import UnFollowingIcon from '../icons/UnFollowing';
  import EachFollowingIcon from '../icons/EachFollowing';
  import BackIcon from '../icons/Back';
  import lodash from 'lodash';
  import { changeUrl } from '../utils/changeUrl';
  import { resolveImage } from '../utils/resource';

  const defaultNoBody = resolveImage(require('../statics/images/img_default_nobody@2x.png'));
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
      localDiggs: {}
    }),
    methods: {
      rediredtUrl (url) {
        this.$store.dispatch(SHOWFEEDDIGGSLISTS, cb => {
          cb({
            show: false,
            diggs: {}
          })
        });
        setTimeout( () => {
          changeUrl(url)
        }, 300);
      },
      handleShowDiggList () {
        this.$store.dispatch(SHOWFEEDDIGGSLISTS, cb => {
          cb({
            show: false,
            diggs: {}
          })
        })
      },
      loadBottom() {
        setTimeout(() => {
          // 若数据已全部获取完毕
          this.bottomStatus = '';
          this.bottomAllLoaded = false;
          this.$refs.loadmoreDigglist.onBottomLoaded();
        }, 500);
      },
      loadTop () {
        setTimeout(() => {
          // 若数据已全部获取完毕
          this.$refs.loadmoreDigglist.onTopLoaded();
        }, 500);
      },
      // 关注用户
      doFollowing (user) {
        followingUser(user, status => {
          if(status) {
            this.localDiggs[user].follower = true;
            this.$store.dispatch(SHOWFEEDDIGGSLISTS, cb => {
              cb({
                show: true,
                diggs: this.localDiggs
              })
            });
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
        unFollowingUser(user, status => {
          if(status) {
            this.localDiggs[user].follower = false;
            this.$store.dispatch(SHOWFEEDDIGGSLISTS, cb => {
              cb({
                show: true,
                diggs: this.localDiggs
              })
            });
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
      }
    },
    computed: {
      ...mapState({
        diggs: state => state.feedDiggsList.diggLists.diggs,
        show: state => state.feedDiggsList.diggLists.show
      }),
      diggList () {
        return this.$store.getters[DIGGLISTS];
      },
      nothing () {
        return lodash.keys(this.diggList).length > 0 ? 0 : defaultNoBody;
      }
    },
    created () {
      let currentUser = this.$storeLocal.get('UserLoginInfo');
      this.currentUser = currentUser.user_id;
      setTimeout( () => {
        if(this.$refs.loadmoreDigglist)
          this.$refs.loadmoreDigglist.onTopLoaded();
      })
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
<style lang="scss">
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
</style>
