<template>
  <div class="container-fluid" id="app">
    <div v-wechat-title="$route.meta.title + ' - ThinkSNS+'"></div>
    <router-view></router-view>
  </div>
</template>

<script>
  import { createAPI, addAccessToken } from './utils/request';

  export default {};
</script>

<style lang="scss">
  @import './styles/common.scss';
</style>
<style lang="css">
  @import './styles/font.css';
</style>
