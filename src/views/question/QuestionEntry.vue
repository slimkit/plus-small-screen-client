<template>
  <section :class="[$style.QuestionEntryRoot, 'QuestionEntryRoot']">
    <header class="commonHeader">
      <Row :gutter="24">
        <Col span="4">
          <BackIcon @click.native="$router.push('/discover')" height="21" width="21" color="#999" />
        </Col>
        <Col span="16" :class="['title-col', $style.title]">
          <router-link to="/questions/questions">问答</router-link>
          <router-link to="/questions/topics">话题</router-link>
        </Col>
        <Col span="4" class="header-end-col">
          <SearchIcon height="21" @click.native="$router.push({ name: 'questionSearch' })" width="21" color="#999" />
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
        &:first-child {
          border-left: 1px solid #59b6d7;
          border-top: 1px solid #59b6d7;
          border-bottom: 1px solid #59b6d7;
          border-radius: 3px 0 0 3px;
        }
        &:last-child {
          border-right: 1px solid #59b6d7;
          border-top: 1px solid #59b6d7;
          border-bottom: 1px solid #59b6d7;
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
        .router-link-active {
          background-color: #59b6d7;
          color: #fff;
        } 
      }
    }
  }
</style>
<script>
  import BackIcon from '../../icons/Back';
  import SearchIcon from '../../icons/Search';
  
  const QuestionEntry = {
    components: {
      BackIcon,
      SearchIcon
    }
  };

  export default QuestionEntry;
</script>