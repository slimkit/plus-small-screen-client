<template>
  <div class="p-profile">
    <header class="m-box m-aln-center m-justify-center m-main m-pos-f m-bb1 m-head-top">我</header>
    <main class="m-box-model" style="padding-top: .9rem">
      <div class="m-box-model m-main m-pr-info">
        <div class="m-box m-aln-center">
          <avatar :user="user" size="big"></avatar>
          <div class="m-text-box m-flex-grow1 m-flex-shrink1 m-flex-base0 m-pr-user-info">
            <h4 class="m-pr-username">{{ user.name }}</h4>
            <p class="m-pr-bio">{{ user.bio }}</p>
          </div>
          <svg class="m-style-svg m-svg-def">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
          </svg>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  name: "profile",
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.state.CURRENTUSER || {};
    }
  }
};
</script>
<style lang="less">
.m-pr-info {
  padding: 30px;
}
.m-pr-user-info {
  margin-left: 30px;
  margin-right: 30px;
  line-height: 40px;
  .m-pr-username {
    font-size: 32px;
    color: @text-color1;
  }
  .m-pr-bio {
    overflow: hidden;
    max-height: 40 * 2px;
    font-size: 28px;
    color: @text-color3;
    text-overflow: ellipsis;
  }
}
</style>
