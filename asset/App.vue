<template>
  <div class="container-fluid" id="app">
    <div v-wechat-title="$route.meta.title + ' - ThinkSNS+'"></div>
    <router-view></router-view>
  </div>
</template>

<style lang="less">
  @import './styles/common.less';
</style>
<style lang="css">
  @import './styles/font.css';
</style>
