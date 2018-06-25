<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="protocol">
      <header class="m-box m-aln-center m-head-top m-pos-f m-main m-bb1">
        <div class="m-box m-aln-center m-flex-grow1 m-flex-base0">
          <svg class="m-style-svg m-svg-def" @click="goBack">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
          </svg>
        </div>
        <div class="m-box m-aln-center m-justify-center m-flex-grow1 m-flex-base0 m-head-top-title">
          <span>用户注册协议</span>
        </div>
        <div class="m-box m-aln-center m-justify-end m-flex-grow1 m-flex-base0"></div>
      </header>
      <main style="padding-top: 0.9rem">
        <div class="content" v-html="content"></div>
      </main>
    </div>
  </transition>
</template>

<script>
import markdownIt from "markdown-it";

// TODO: 注册页面和协议页面切换时保留过渡动画

export default {
  name: "registerProtocol",
  data() {
    return {};
  },
  computed: {
    content() {
      let content = this.$store.state.CONFIG.registerSettings.content;
      content = content.replace(/<br>/, "\n");
      return markdownIt({ html: true }).render(content);
    }
  }
};
</script>

<style lang="less">
.protocol {
  padding: 0.2rem;

  .content > * {
    margin-bottom: 0.4rem;
  }

  h1 {
    font-size: 0.62rem;
    font-weight: bold;
  }
  h4 {
    font-weight: bold;
  }
  ol {
    list-style: decimal outside;
    margin-left: 1em;
  }
  blockquote {
    margin-left: 1em;
  }
}
</style>
