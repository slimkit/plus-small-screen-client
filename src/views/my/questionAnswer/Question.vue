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
        { label: '全部', path:{ name: 'myQuestionAnswerQuestionList', params: {type: 'all'} } },
        { label: '邀请', path:{ name: 'myQuestionAnswerQuestionList', params: {type: 'invitation'} } },
        { label: '悬赏', path:{ name: 'myQuestionAnswerQuestionList', params: {type: 'reward'} } },
        { label: '其他', path:{ name: 'myQuestionAnswerQuestionList', params: {type: 'other'} } },
        ]
      });
    }
  }
</script>
