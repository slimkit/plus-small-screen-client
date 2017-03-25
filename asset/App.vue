<template>
  <div class="container-fluid" id="app">
    <div v-wechat-title="$route.meta.title + ' - ThinkSNS+'"></div>
    <router-view></router-view>
    <NoticeText/>
    <ImageSwiper/>
  </div>
</template>
<script>
  import NoticeText from './components/Notice';
  import ImageSwiper from './components/ImageSwiper';
  import { NOTICE } from './stores/types';
  import { mapState } from 'vuex';
  import store from './stores/store';

  const App = {
    components: {
      NoticeText,
      ImageSwiper
    }
  }

  export default App;
</script>
<style lang="less">
  @import './styles/common.less';
</style>
<style lang="css">
  @import './styles/font.css';
</style>
