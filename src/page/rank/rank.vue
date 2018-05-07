<template>
  <div>
    <header slot="head" class="m-box m-justify-bet m-aln-center m-head-top m-pos-f m-main m-bb1">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg class='m-style-svg m-svg-def' @click='cancel'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
        <span>排行榜</span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end">

      </div>
    </header>
    <div class="rank-nav">
      <router-link tag='div' class='rank-nav-item' to='/rank/users'>用户</router-link>
      <router-link tag='div' class='rank-nav-item' to='/rank/questions'>问答</router-link>
      <router-link tag='div' class='rank-nav-item' to='/rank/feeds'>动态</router-link>
      <router-link tag='div' class='rank-nav-item' to='/rank/news'>资讯</router-link>
    </div>
    <div class="rank-content">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
import HeadTop from "../../components/HeadTop";
export default {
  name: "rankIndex",
  components: {
    HeadTop
  },
  methods: {
    cancel() {
      this.to("/discover");
    },
    to(path) {
      path = typeof path === "string" ? { path } : path;
      if (path) {
        this.$router.push(path);
      }
    }
  }
};
</script>

<style lang='less'>
.rank-nav {
  position: fixed;
  z-index: 100;
  top: 90px;
  padding-top: 0 !important;
  display: flex;
  align-items: center;
  height: 90px;
  width: 100%;
  line-height: 89px;
  border-bottom: 1px solid #ededed;
  /*no*/
  background-color: #fff;
  justify-content: center;
  &-item {
    padding: 0 10px;
    font-size: 32px;
    color: #999;
    border-bottom: 3px solid transparent;
    & + & {
      margin-left: 90px;
    }

    &.router-link-active {
      border-color: #59b6d7;
      color: #333;
    }
  }
}
.rank-content {
  padding-top: 180px;
  min-height: 100vh;
  position: relative;
  background-color: #f4f5f5;
}
</style>
