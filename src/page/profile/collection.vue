<template>
  <div class="p-profile-collection">
    <header class="m-box m-pos-f m-main m-bb1 m-head-top">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0">
        <svg class="m-style-svg m-svg-def" @click="goBack">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0 m-justify-center m-head-top-title">
        <span>我的收藏</span>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0 m-justify-end">
      </div>
    </header>
    <main style="padding-top: .9rem">
      <div class="m-pos-f m-box m-aln-center m-justify-bet m-sub-nav m-bb1 m-main">
        <router-link replace exact tag="div" exact-active-class="active" to="/profile/collection/feeds" class="m-sub-nav-item">
          <a>动态</a>
        </router-link>
        <router-link replace exact tag="div" exact-active-class="active" to="/profile/collection/news" class="m-sub-nav-item">
          <a>资讯</a>
        </router-link>
        <router-link replace exact tag="div" exact-active-class="active" to="/profile/collection/answers" class="m-sub-nav-item">
          <a>回答</a>
        </router-link>
        <router-link replace exact tag="div" exact-active-class="active" to="/profile/collection/posts" class="m-sub-nav-item">
          <a>帖子</a>
        </router-link>
      </div>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </main>
  </div>
</template>
<script>
export default {
  name: "profile-collection"
};
</script>
<style lang="less">
.p-profile-collection {
  .m-sub-nav {
    top: 90px;
    z-index: 2;
    .m-sub-nav-item {
      height: 100%;
      line-height: 90px;
      &.router-link-active {
        color: #333;
        border-bottom: 4px solid #59b6d7;
      }
    }
  }
}
</style>
