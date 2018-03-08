<template lang="html">
  <div class="setting">
    <head-top :go-back='true' title="设置"></head-top>
    <div></div>
    <ul class="entry__group padding">
      <router-link class='entry__item' to='/forgot'>
        <span>修改密码</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>      
      <router-link class='entry__item' to='/about'>
        <span>关于我们</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
      <li class="entry__item c_59b6d7" @click='beforeSignOut'>
        <span>退出登录</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "setting",
  methods: {
    async signOut() {
      const res = await this.$store.dispatch("SIGN_OUT");
      if (res) {
        this.$Modal.remove();
        this.$router.push("/signin");
      }
    },
    beforeSignOut() {
      const vm = this;
      this.$Modal.info({
        title: "确认退出登录?",
        render(h) {
          return h(
            "button",
            {
              on: {
                click: vm.signOut
              }
            },
            "退出"
          );
        }
      });
    }
  }
};
</script>
<style lang="less" src='./style/setting.less'>
</style>
