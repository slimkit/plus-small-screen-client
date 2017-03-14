<template>
  <div>
    <ul>
      <li v-for="comment in commentInfo">
        <p @click.stop="focusInput">{{ comment.comment_content }}</p>
      </li>
    </ul>
    <router-link v-if="hasMore" to="/web"></router-link>
    <el-input :class="$style.commentInput" v-model="input" v-if="CanInput" autofocus="{{ autoF }}" placeholder="请输入内容"></el-input>
  </div>
</template>

<script>
  
  const commentsTool = {
    props: [
      'commentsData'
    ],
    data: () => ({
      commentInfo: [],
      more: false,
      CanInput: false,
      autoF: false
    }),
    methods: {
      focusInput () {
        this.CanInput = !this.CanInput,
        setTimeout(() => {
          this.autoF = true;
        }, 300)
      }
    },
    computed: {
      hasMore () {
        return this.commentsData.length > 3;
      }
    },
    beforeMount () {
      this.commentInfo = this.commentsData;
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

