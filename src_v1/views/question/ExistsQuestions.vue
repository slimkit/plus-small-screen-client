<template>
  <section v-show="existsQuestions.length || !title">
    <Row @click.native="$router.push({name: 'questionDetail', params: {question_id: question.id}})" :gutter="24" v-for="(question, index) in existsQuestions" :key="index" :class="$style.question">
      <Col span="24">
        <router-link :class="$style.link" :to="`question/${question.id}`">{{ question.subject }}</router-link> 
      </Col>
    </Row>
  </section>

</template>
<style lang="less" module>
  .question {
    padding-top: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #ededed;
    &:last-child {
      border-bottom: none;
    }
    .link {
      color: #333;
      font-size: 14px;
    }
  }
</style>
<script>
  import { createAPI, addAccessToken, createRequestURI } from '../../utils/request';
  
  const existsQuestions = {
    props: [
      'title'
    ],

    data: () => ({
      existsQuestions: []
    }),

    watch: {
      title: function (title) {
        if(!title) {
          this.existsQuestions = [];
          return;
        }

        addAccessToken().get(
          createAPI('questions'),
          {
            params: {
            type: 'all',
            subject: this.title
          }
        },
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          if (data.length) {
            this.existsQuestions = data.map( question => {
              return {
                subject: question.subject,
                id: question.id
              }
            })
          } else {
            this.existsQuestions = [];
          }
        })
        .catch(({response: { data } }) => {
          console.log(data);
        })
      }
    }
  };

  export default existsQuestions;
</script>