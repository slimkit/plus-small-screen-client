<template>
  <section :class="$style.QuestionDetail">
    <header class="commonHeader">
      <Row :gutter="24">
        <Col span="5">
          <BackIcon height="21" width="21" color="#bfbfbf" />
        </Col>
        <Col span="14" class="title-col">
          问题详情
        </Col>
      </Row>
    </header>
  </section>
</template>
<style lang="less" module>
  .QuestionDetail {

  }
</style>
<script>
  import BackIcon from '../../icons/Back';

  const QuestionDetail = {
    components: {
      BackIcon
    }
  };

  export default QuestionDetail;
</script>