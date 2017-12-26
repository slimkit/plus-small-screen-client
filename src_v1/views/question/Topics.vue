<template>
  <section v-if="topics.length > 0">
    <Row :gutter="24" v-for="(topic, index) in topics" :key="index" :class="$style.topicRow" @click.native="selectChildTopic(topic)">
      <Col span="6">
        <img v-lazy="topic.avatar" :alt="topic.name">
      </Col>
      <Col span="18">
        <section>
          <h4>{{ topic.name }}</h4>
          <p>{{ topic.description }}</p>
        </section>
      </Col>
    </Row>
  </section>
</template>
<style lang="less" module>
  .topicRow {
    padding-bottom: 12px;
    padding-top: 12px;
    border-bottom: 1px solid #ededed;
    img {
      width: 100%;
    }
  }
</style>
<script>
  import { createAPI, addAccessToken, createRequestURI } from '../../utils/request';

  const Topics = {
    props: [
      'search',
      'selectTopic'
    ],
    data: () => ({
      topics: []
    }),
    methods: {
      selectChildTopic (topic) {
        this.$emit('selectTopic', topic);
      }
    },
    watch: {
      search: function (search) {
        if (!search) {
          this.topics = [];
          return;
        }
        addAccessToken().get(
          createAPI('question-topics'),
          {
            params: {
              name: this.search
            }
          },
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          this.topics = data;
        })
        .catch(({ response: { data } } = {}) => {
          console.log(data);
        })
      }
    }
  };

  export default Topics;
</script>