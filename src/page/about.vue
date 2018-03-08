<template>
  <div class="about-us">
    <head-top :go-back='true' title='关于我们'></head-top>
    <div class="about-us--content" v-html='body'></div>
  </div>
</template>
<script>
export default {
  name: 'AboutUs',
  data() {
    return {
      body: ''
    };
  },
  mounted() {
    this.$http.get('/aboutus').then(({ data }) => {
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
