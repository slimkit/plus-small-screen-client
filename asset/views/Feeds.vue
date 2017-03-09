<template>
  <div class="container">
    <FeedNavBar/>
    <router-view></router-view>
  </div>
</template>

<script>
  import { logout } from '../utils/auth.js';
  import FeedNavBar from '../components/feedNavBar';

  const feeds = {
    data: () => ({

    }),
    components: {
      FeedNavBar
    },
    method: {
      doLogout () {
        logout();
      }
    }
  }

  export default feeds;
</script>

