<template>
  <section :class="[$style.QuestionEntryRoot, 'QuestionEntryRoot']">
    <header class="commonHeader">
      <Row :gutter="24">
        <Col span="4">
          <BackIcon @click.native="$router.push('/users/profile')" height="21" width="21" color="#999" />
        </Col>
        <Col span="20" :class="['title-col', $style.title]">
          <router-link to="/users/question-answer/questions">提问</router-link>
          <router-link to="/users/question-answer/answers">回答</router-link>
          <router-link to="/users/question-answer/follows">关注</router-link>
        </Col>
      </Row>
    </header>
    <section>
      <router-view></router-view>
    </section>
  </section>
</template>
<style lang="less" module>
  .QuestionEntryRoot {
    .title {
      a {
        color: #59b6d7;
        padding: 4px 24px;
        border-top: 1px solid #59b6d7;
        border-bottom: 1px solid #59b6d7;
        &:first-child {
          border-left: 1px solid #59b6d7;
          border-radius: 3px 0 0 3px;
        }
        &:last-child {
          border-right: 1px solid #59b6d7;
          border-radius: 0 3px 3px 0;
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .QuestionEntryRoot {
    .commonHeader {
      height: 60px;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100vw;
      z-index: 10;
      .title-col {
        text-align: center;
        .router-link-active {
          background-color: #59b6d7;
          color: #fff;
        } 
      }
    }
  }
</style>
<script>
  import BackIcon from '../../../icons/Back';
  import SearchIcon from '../../../icons/Search';
  
  const QuestionEntry = {
    components: {
      BackIcon,
      SearchIcon
    }
  };

  export default QuestionEntry;
</script>