<template>
  <div @touchmove.prevent>
    <transition name="toast">
      <div 
        v-if="show" 
        class="m-pop-box" 
        @click="handelCancel"/>
    </transition>
    <transition name="toast">
      <div 
        v-if="show" 
        class="m-box-model m-justify-bet m-info-tips-box">
        <h2 class="m-info-tips-head">
          <slot name="title">
            <span>{{ title }}</span>
          </slot>
        </h2>
        <div 
          class="m-info-tips-body" 
          v-html="content"/>
        <div class="m-info-tips-foot">
          <button 
            class="m-info-tips-btn" 
            @click="handelCancel">{{ cancelTxt }}</button>
        </div>
      </div>
    </transition>
</div></template>
<script>
import bus from "@/bus.js";
const noop = () => {};
export default {
  name: "InfoTips",
  data() {
    return {
      show: false,
      title: "温馨提示",
      cancelTxt: "知道了",
      content: "温馨提示!"
    };
  },
  created() {
    bus.$on(
      "info-tips",
      ({
        title = this.title,
        content = this.content,
        cancelTxt = this.cancelTxt,
        onCancel = this.onCancel
      }) => {
        this.title = title;
        this.content = content;
        this.onCancel = onCancel;
        this.cancelTxt = cancelTxt;
        this.show = true;
      }
    );
  },
  methods: {
    onCancel: noop,
    handelCancel() {
      this.onCancel();
      this.$nextTick(this.cancel);
    },
    cancel() {
      this.show = false;
    }
  }
};
</script>
<style lang="less">
.m-info-tips-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 50px;
  width: 500px;
  min-height: 420px;
  border-radius: 10px;
  background-color: @body-bg;
  z-index: 119;
}

.m-info-tips-head {
  padding: 40px 0;
  color: #333;
  text-align: center;
  font-size: 32px;
  border-bottom: 1px solid @border-color; /*no*/
}
.m-info-tips-body {
  padding-top: 30px;
  padding-bottom: 30px;
  line-height: 1.3215;
  color: @text-color2;
}

.m-info-tips-btn {
  width: 100%;
  padding: 40px 0;
  text-align: center;
  font-size: 32px;
  color: @primary;
  background-color: transparent;
  border-top: 1px solid @border-color; /*no*/
}
</style>
