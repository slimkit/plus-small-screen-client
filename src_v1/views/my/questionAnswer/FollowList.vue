<template>
  <follow-question-list v-if="type == 'questions'"></follow-question-list>
  <topic-list v-else></topic-list>
</template>
<script>
  import FollowQuestionList from './FollowQuestionList';
  import TopicList from './TopicList';
  export default ({
    components: {
      FollowQuestionList,
      TopicList
    },
    data: () => ({
    }),
    computed: {
      type () {
        return this.$route.params.type;
      }
    }
  })
</script>