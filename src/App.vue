<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <svg-icon></svg-icon>
    <pswp></pswp>
  </div>
</template>
<script>
import pswp from '@/components/pswp.vue';
export default {
  name: 'app',
  components: {
    pswp,
    svgIcon: () =>
      import(/* webpackChunkName: 'svgIcon' */ '@/components/common/svgIcon')
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
