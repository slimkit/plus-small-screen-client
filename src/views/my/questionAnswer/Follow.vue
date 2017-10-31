<template>
  <section :class="[$style.FollowNav, 'FollowNav']">
    <Row :gutter="24" :class="[$style.nav, 'nav']">
      <Col span="7"></Col>
      <Col span="5">
        <router-link :to="{name: 'myQuestionAnswerFollowList', params: {type: 'questions'}}">问题</router-link>
      </Col>
      <Col span="5">
        <router-link :to="{name: 'myQuestionAnswerFollowList', params: {type: 'topics'}}">话题</router-link>
      </Col>
      <Col span="7"></Col>
    </Row>
    <router-view :class="$style.view"></router-view>
  </section>
</template>
<style lang="less" module>
  .FollowNav {
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
  .FollowNav {
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
