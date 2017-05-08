<template>
  <div :class="$style.feedNavBar" class="feed-nav-bar">
    <Row :gutter="32" :class="$style.NavRow">
      <Col :span="6">
        <router-link :class="$style.navLink" to="/feeds/new">最新</router-link>
        <!-- <Button @click.native="clean">缓存</Button> -->
      </Col>
      <Col :span="6" >
          <router-link :class="$style.navLink" to="/feeds/following">关注</router-link>
      </Col>
      <Col :span="6" >
        <router-link :class="$style.navLink" to="/feeds/hot">热门</router-link>
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
    height: 55px;
    line-height: 45px;
    border-bottom: 1px #dedede solid;
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
    }
  }
  .navLink {
    color: #999;
    height: 44px;
    display: block;
    text-align: center;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:active, &:hover {
      color: #333;
    }
  }
</style>
