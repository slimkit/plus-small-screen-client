<template>
  <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
    <div class="feed-diggs-container" :class="$style.diggListsRoot" v-if="show">
      <div class="feed-diggs-container-header diggs-background-color">
        <Row :gutter="16">
          <Col span="3" style="display: flex; justify-content: flex-start">
            <i class="ivu-icon ivu-icon-android-arrow-back" @click="handleShowDiggList" style="width: 100%; height: 100%; display: flex; align-items: center;"></i>
          </Col>
          <Col span="18" style="font-size: 18px;">
            点赞榜
          </Col>
          <Col span="3" style="display: flex;">
          </Col>
        </Row>
      </div>
      <mt-loadmore
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="bottomAllLoaded"
        ref="loadmoreDigglist"
        bottomPullText="上拉加载更多"
        bottomDropText="释放加载更多"
      >
        <div class="feed-diggs-container-list diggs-background-color">
          <li v-for="(digg, index) in diggList" :class="$style.perDiggParent" :key="index">
            <Row :gutter="16" :class="$style.perDigg">
              <Col span="4">
                <img :class="$style.diggAvatar" v-lazy="digg.avatar" :alt="digg.name" :title="digg.name">
              </Col>
              <Col span="17">
                <h4>{{ digg.name }}</h4>
                <p>{{ digg.intro ? digg.intro : '还没有简介...' }}</p>
              </Col>
              <Col span="3">
                <!-- <i class="ivu-icon ivu-icon-android-person-add" @click="doFollowing(digg.user_id)" v-if="!digg.is_following && currentUser != digg.user_id" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: flex-end"></i>
                <i class="ivu-icon ivu-icon-android-person" @click="doUnFollowing(digg.user_id)" v-if="digg.is_following && currentUser != digg.user_id" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: flex-end"></i> -->
                <div @click="doFollowing(digg.user_id)">
                  <UnFollowingIcon v-show="!digg.is_following && currentUser != digg.user_id" height="24" width="24" color="#999" />
                </div>
                <div @click="doUnFollowing(digg.user_id)">
                  <FollowingIcon v-show="digg.is_following && !digg.is_followed && currentUser != digg.user_id" height="24" width="24" color="#999" />
                </div>
                <div @click="doUnFollowing(digg.user_id)">
                  <EachFollowingIcon v-show="!digg.is_following && digg.is_followed && currentUser != digg.user_id" height="24" width="24" color="#999" />
                </div>
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
  import localEvent from '../stores/localStorage';
  import { followingUser, unFollowingUser } from '../utils/user';
  import { NOTICE } from '../stores/types';
  import FollowingIcon from '../icons/Following';
  import UnFollowingIcon from '../icons/UnFollowing';
  import EachFollowingIcon from '../icons/EachFollowing';

  const currentUser = localEvent.getLocalItem('UserLoginInfo');
  const FeedDiggsLists = {
    components: {
      FollowingIcon,
      UnFollowingIcon,
      EachFollowingIcon
    },
    data: () => ({
      // 加载更多相关
      bottomAllLoaded: true,
      page: 0,
      bottomStatus: '',
      currentUser: currentUser.user_id,
      localDiggs: {}
    }),
    props: {

    },
    methods: {
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
          if(status.status || status.code == 0) {
            this.localDiggs[user].is_following = 1;
            localEvent.setLocalItem(`user_${user}`, this.localDiggs[user]);
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
          if(status.status || status.code == 0) {
            this.localDiggs[user].is_following = 0;
            localEvent.setLocalItem(`user_${user}`, this.localDiggs[user]);
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
        let diggs = this.$store.getters[DIGGLISTS];
        this.localDiggs = diggs;
        return diggs;
      }
    },
    created () {
      console.log('c');
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
