<template>
  <footer class='news-ctrl-box'>
    <div class="news-ctrl-btn" @click='handleLike'>
      <svg>
        <use :xlink:href="liked ? '#feed-like' :'#feed-unlike'"></use>
      </svg>
      <span>喜欢</span>
    </div>
    <div class="news-ctrl-btn" @click='handleComment'>
      <svg>
        <use xlink:href="#feed-comment"></use>
      </svg>
      <span>评论</span>
    </div>
    <div class="news-ctrl-btn" @click='handleShare'>
      <svg>
        <use xlink:href="#base-share"></use>
      </svg>
      <span>分享</span>
    </div>
    <div class="news-ctrl-btn" @click='handleMore'>
      <svg>
        <use xlink:href="#feed-more"></use>
      </svg>
      <span>更多</span>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'news-tool-bar',
  props: {
    liked: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    handleLike() {
      this.$emit('handleLike');
    },
    handleComment() {
      this.$emit('handleComment');
    },
    handleShare() {
      this.$emit('handleShare');
    },
    handleMore() {
      this.$emit('handleMore');
    }
  }
};
</script>
<style lang='less' src='../style/newsToolBar.less'>

</style>
