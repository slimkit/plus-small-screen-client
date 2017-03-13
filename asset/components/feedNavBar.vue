<template>
  <div :class="$style.feedNavBar" class="feed-nav-bar">
    <el-row>
      <el-col :span="4" offset="4">
          <router-link :class="$style.navLink" to="/feeds/following">关注</router-link>
      </el-col>
      <el-col :span="2" offset="2">
      </el-col>
      <el-col :span="4" offset="2">
        <router-link :class="$style.navLink" to="/feeds/all">全部</router-link>
      </el-col>
      <el-col :span="2" offset="2">
      </el-col>
      <el-col :span="4" offset="2">
        <!-- <router-link :class="$style.navLink" to="/feeds/new">最新</router-link> -->
        <el-button v-on:click="clean">缓存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import localEvent from '../stores/localStorage';
  import router from '../routers/index';

  const navBar = {
    methods: {
      clean () {
        localEvent.clearLocalAll();
        router.push({ path: '/login' });
      }
    }
  }

  export default navBar;
</script>

<style lang="scss" module>
  .feedNavBar{
    font-size: 18px;
    height: 46px;
    line-height: 46px;
    border-bottom: 1px #dedede solid;
    background-color: #fff;
    position: fixed;
    width: 100%;
    z-index: 2;
    &:active {
      background-color: #fff;
    }
  }
  .navLink {
    color: #999;
    height: 44px;
    display: block;
    text-align: center;
  }
</style>
