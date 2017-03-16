<template>
  <div :class="$style.feedNavBar" class="feed-nav-bar">
    <Row>
      <i-col :span="4" offset="4">
          <router-link :class="$style.navLink" to="/feeds/following">关注</router-link>
      </i-col>
      <i-col :span="2" offset="2">
      </i-col>
      <i-col :span="4" offset="2">
        <router-link :class="$style.navLink" to="/feeds/all">全部</router-link>
      </i-col>
      <i-col :span="2" offset="2">
      </i-col>
      <i-col :span="4" offset="2">
        <!-- <router-link :class="$style.navLink" to="/feeds/new">最新</router-link> -->
        <i-button @click.native="clean">缓存</i-button>
        <!-- <a href="javascript:void(0)" @click.stop.prevent="clean">缓存</a> -->
      </i-col>
    </Row>
  </div>
</template>

<script>
  import localEvent from '../stores/localStorage';
  import router from '../routers/index';

  const navBar = {
    methods: {
      clean () {
        localEvent.clearLocalAll();
        router.push({ path: '/login' });
      }
    }
  }

  export default navBar;
</script>

<style lang="scss" module>
  .feedNavBar{
    font-size: 18px;
    height: 45px;
    line-height: 45px;
    border-bottom: 1px #dedede solid;
    background-color: #fff;
    position: fixed;
    width: 100%;
    z-index: 3;
    &:active {
      background-color: #fff;
    }
  }
  .navLink {
    color: #999;
    height: 44px;
    display: block;
    text-align: center;
  }
</style>
