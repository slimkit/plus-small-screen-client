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