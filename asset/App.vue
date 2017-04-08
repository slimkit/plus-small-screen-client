<template>
  <div class="container-fluid" id="app">
    <div v-wechat-title="$route.meta.title + ' - ThinkSNS+'"></div>
    <router-view></router-view>
    <NoticeText/>
    <IviewSwiper/>
    <PostFeed/>
  </div>
</template>
<script>
  import NoticeText from './components/Notice';
  // import ImageSwiper from './components/ImageSwiper';
  import IviewSwiper from './components/IviewSwiper';
  import { NOTICE } from './stores/types';
  import { mapState } from 'vuex';
  import store from './stores/store';
  import PostFeed from './components/PostFeed';
  import { SHOWPOST } from './stores/types';

  const App = {
    components: {
      NoticeText,
      IviewSwiper,
      PostFeed
    },
    methods: {
      closePost () {
        this.$store.dispatch(SHOWPOST, cb => {
          cb ({
            show: false
          });
        });
      }
    }
  }

  export default App;
</script>
<style lang="less">
  @import './styles/common.less';
</style>
<style lang="css">
  @import './styles/font.css';
  @import '~animate.css/animate.min.css';
  .animated {
    -webkit-animation-duration: .3s;
    animation-duration: .3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  .animated.hinge {
    -webkit-animation-duration: .3s;
    animation-duration: .3s;
  }
</style>
