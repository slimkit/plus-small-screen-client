<template>
  <div class="container-fluid" id="app">
    <div v-wechat-title="$route.meta.title + ' - ThinkSNS+'"></div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss">
  @import './styles/common.scss';
</style>
