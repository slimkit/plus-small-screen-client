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
        { label: '问题', path:{ name: 'myQuestionAnswerFollowList', params: {type: 'questions'} } },
        { label: '话题', path:{ name: 'myQuestionAnswerFollowList', params: {type: 'topics'} } },
        ]
      });
    }
  }
</script>
