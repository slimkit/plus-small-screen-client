<template>
  <div class="about-us">
    <header class="m-box m-aln-center m-head-top m-pos-f m-main m-bb1">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0">
        <svg class="m-style-svg m-svg-def" @clcik="goBack">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box m-aln-center m-justify-center m-flex-grow1 m-flex-base0 m-head-top-title">
        <span>关于我们</span>
      </div>
      <div class="m-box m-aln-center m-justify-end m-flex-grow1 m-flex-base0"></div>
    </header>
    <main style="padding-top: 0.9rem; margin-top: -20px">
        <div class="about-us--content" v-html='body'></div>
    </main>
  </div>
</template>
<script>
export default {
  name: "about-us",
  data() {
    return {
      body: ""
    };
  },
  mounted() {
    this.$http.get("/aboutus").then(({ data }) => {
      this.body = data;
    });
  }
};
</script>
<style lang='less'>
.about-us--content {
  min-height: 100vh;
  background: #fff;
}
</style>
