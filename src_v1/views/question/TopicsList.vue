<template>
  <section :class="[$style.TopicsRoot, 'TopicsRoot']">
    <Row :gutter="24" :class="[$style.nav, 'nav']">
      <Col offset="2" span="10" class="title-col">
        <router-link to="/questions/topics/all">全部话题</router-link>
      </Col>
      <Col span="10" class="title-col">
        <router-link to="/questions/topics/follow">我关注的</router-link>
      </Col>
    </Row>
    <router-view :class="$style.view"></router-view>
  </section>
</template>
<style lang="less" module>
  .TopicsRoot {
    padding-top: 60px;
    .nav {
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      width: 100vw;
      padding-bottom: 12px;
      padding-top: 12px;
      border-bottom: 1px solid #efefef;
      background-color: #fff;
      z-index: 10;
    }
    .view {
      padding-top: 47px;
    }
  }
</style>
<style lang="less" scoped>
  .TopicsRoot {
    .nav {
      a {
        font-size: 16px;
        color: #bfbfbf;
        &.router-link-active {
          color: #333;
          border-bottom: none;
          font-weight: 500;
        }
      }
    }
  }
</style>
