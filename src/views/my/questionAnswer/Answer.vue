<template>
  <section>
    <MyQuestionNav :navs='navs' />
    <router-view></router-view>
  </section>
</template>

<script>
  import MyQuestionNav from './MyQuestionNav';
  export default {
    name: 'my-questions',
    components:{
      MyQuestionNav
    },
    data(){
      return ({
        navs:[
        { label: '全部', path:{ name: 'myQuestionAnswerAnswerList', params: {type: 'all'} } },
        { label: '被采纳', path:{ name: 'myQuestionAnswerAnswerList', params: {type: 'adoption'} } },
        { label: '被邀请', path:{ name: 'myQuestionAnswerAnswerList', params: {type: 'invitation'} } },
        { label: '其他', path:{ name: 'myQuestionAnswerAnswerList', params: {type: 'other'} } },
        ]
      });
    }
  }
</script>
<!-- <template>
  <section :class="[$style.QuestionsNav, 'QuestionsNav']">
    <Row :gutter="24" :class="[$style.nav, 'nav']">
      <Col span="6">
        <router-link :to="{name: 'myQuestionAnswerAnswerList', params: {type: 'all'}}">全部</router-link>
      </Col>
      <Col span="6">
        <router-link :to="{name: 'myQuestionAnswerAnswerList', params: {type: 'adoption'}}">被采纳</router-link>
      </Col>
      <Col span="6">
        <router-link :to="{name: 'myQuestionAnswerAnswerList', params: {type: 'invitation'}}">被邀请</router-link>
      </Col>
      <Col span="6">
        <router-link :to="{name: 'myQuestionAnswerAnswerList', params: {type: 'other'}}">其他</router-link>
      </Col>
    </Row>
    <router-view :class="$style.view"></router-view>
  </section>
</template>
<style lang="less" module>
  .QuestionsNav {
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
  .QuestionsNav {
    .nav {
      div {
        text-align: center;
      }
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
 -->