<template>
  <section class="m-box m-aln-st m-lim-width m-chat-message" :class="{'m-justify-end': isMine}">
    <avatar :user="user" :style="{order: isMine ? 1 : 0}" />
    <div class="m-box-model" :class="{'m-aln-end': isMine}">
      <h2 class="m-chat-name">{{ name }}</h2>
      <div class="m-chat-content m-text-box" :class="{'m-chat-content-l': !isMine}">{{ message.txt}}</div>
    </div>
  </section>
</template>
<style lang="less">
.m-chat-message {
  margin-top: 0.3rem;
  .m-chat-name {
    color: @text-color3;
  }
  .m-chat-content {
    color: @text-color1;
    margin-top: 0.2rem;
    border-radius: 10px 0 10px 10px;
    border: #87c6dd 1px solid; /* no */
    background-color: #b3e1f2;
    padding: 0.2rem;
    max-width: 5.05rem;
    line-height: 0.4rem;
  }
  .m-chat-content-l {
    border-radius: 0 10px 10px 10px;
  }
}
</style>
<script>
export default {
  name: "my-msg",
  props: {
    message: [Object],
    name: [String],
    id: [Number],
    isMine: [Boolean],
    user: [Object]
  }
};
</script>
