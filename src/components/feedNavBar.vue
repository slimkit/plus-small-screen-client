<template>
  <header :class="$style.feedNavBar" class="feed-nav-bar">
    <Row :gutter="32" :class="$style.NavRow">
      <Col :span="6" :class="$style.NavCol">
        <router-link :class="$style.navLink" to="/feeds/new">最新</router-link>
      </Col>
      <Col :span="6" :class="$style.NavCol">
        <router-link :class="$style.navLink" to="/feeds/hot">热门</router-link>
      </Col>
      <Col :span="6" :class="$style.NavCol">
          <router-link :class="$style.navLink" to="/feeds/following">关注</router-link>
      </Col>
    </Row>
  </header>
</template>

<script>
  // import localEvent from '../stores/localStorage';
  import router from '../routers/index';

  const navBar = {
    methods: {
      // clean () {
      //   localEvent.clearLocalAll();
      //   router.push({ path: '/login' });
      // }
    }
  }

  export default navBar;
</script>

<style lang="scss" module>
  .feedNavBar{
    font-size: 18px;
    height: 46px;
    line-height: 45px;
    border-bottom: 1px #ededed solid;
    background-color: #fff;
    position: fixed;
    width: 100%;
    z-index: 3;
    &:active {
      background-color: #fff;
    }
    .NavRow {
      height: 100%;
      justify-content: center;
      align-items: flex-end;
      .NavCol {
        position: relative;
      }
    }
  }
  .navLink {
    color: #999;
    display: block;
    text-align: center;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    bottom: -1px;
  }
</style>
