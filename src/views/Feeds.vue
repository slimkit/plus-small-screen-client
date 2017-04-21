<template>
  <div class="container" :class="$style.manContent">
    <FeedNavBar/>
    <router-view></router-view>
    <ToolBar/>
  </div>
</template>

<script>
  import { logout } from '../utils/auth.js';
  import FeedNavBar from '../components/feedNavBar';
  import ToolBar from '../components/ToolBar';

  const feeds = {
    data: () => ({

    }),
    components: {
      FeedNavBar,
      ToolBar
    },
    method: {
      doLogout () {
        logout();
      }
    }
  }

  export default feeds;
</script>

<style lang="scss" module>
  .manContent {
    padding:  0;
  }
</style>
