<template>
  <div>
    <el-button @click="focusInput">点我</el-button>
    <router-link to="/web"></router-link>
    <el-input :class="$style.commentInput" v-model="input" v-show="CanInput" :autofocus="autoFocus" placeholder="请输入内容"></el-input>
  </div>
</template>

<script>
  
  const commentsTool = {
    props: [
      'commentsData'
    ],
    data: () => ({
      commentInfo: [
        1,
        2
      ],
      more: 0,
      CanInput: false,
      autoFocus: false
    }),
    methods: {
      focusInput () {
        this.CanInput = !this.CanInput,
        setTimeout(() => {
          this.autoFocus = true;
        }, 300)
      }
    },
    computed: {
      
    }
  };

  export default commentsTool;
</script>

<style lang="scss" module>
  .commentInput{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 3;
    background-color: #fff;
    border-bottom: 1px #59b6d7 solid;
    border: none;
  }
</style>

