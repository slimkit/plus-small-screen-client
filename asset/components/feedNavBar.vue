<template>
  <div :class="$style.feedNavBar" class="feed-nav-bar">
    <Row>
      <Col :span="4" offset="4">
          <router-link :class="$style.navLink" to="/feeds/following">关注</router-link>
      </Col>
      <Col :span="2" offset="2">
      </Col>
      <Col :span="4" offset="2">
        <router-link :class="$style.navLink" to="/feeds/hot">热门</router-link>
      </Col>
      <Col :span="2" offset="2">
      </Col>
      <Col :span="4" offset="2">
        <router-link :class="$style.navLink" to="/feeds/new">最新</router-link>
        <!-- <Button @click.native="clean">缓存</Button> -->
      </Col>
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
