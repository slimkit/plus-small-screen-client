<template>
  <div class="container-fluid" id="app">
    <div v-wechat-title="$route.meta.title + ' - ThinkSNS+'"></div>
    <router-view></router-view>
    <NoticeText v-show="notice.show" :show="notice.show" :time="notice.time" :text="notice.text" :status="notice.status"></NoticeText>
  </div>
</template>
<script>
  import NoticeText from './components/Notice';
  import { NOTICE } from './stores/types';
  const App = {
    components: {
      NoticeText
    },
    data: () => ({
      notice: {
        time: 1000,
        text: '',
        show: false,
        status: true
      }
    }),
    // computed: {
    //   notice () {
    //     return this.$store.getters[NOTICE];
    //   }
    // },
    // methods: {
    //   getItem (item) {
    //     return this.notice[item];
    //   }
    // },
    beforeUpdate () {
      this.notice = { ...this.notice, ...this.$store.getters[NOTICE] };
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
