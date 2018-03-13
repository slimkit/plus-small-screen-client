<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <div>
      <svg-icon />
      <pswp />
      <actionsheet />
    </div>
  </div>
</template>
<script>
import pswp from "@/components/pswp.vue";
import actionsheet from "@/components/actionsheet.vue";
export default {
  name: "app",
  components: {
    pswp,
    actionsheet,
    svgIcon: () =>
      import(/* webpackChunkName: 'svgIcon' */ "@/components/common/svgIcon")
  }
};
</script>
<style lang="less">
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}

.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}
</style>
