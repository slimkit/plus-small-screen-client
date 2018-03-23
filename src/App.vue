<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <div>
      <svg-icon />

      <pswp />
      <payfor />
      <post-menu />
      <actionsheet />
      <comment-input />
      <check-in v-if="checkin"/>
    </div>
  </div>
</template>
<script>
import pswp from "@/components/pswp.vue";
import payfor from "@/components/payfor.vue";
import actionsheet from "@/components/actionsheet.vue";
import commentInput from "@/components/commentInput.vue";
// icons
import SvgIcon from "@/components/common/svgIcon.vue";
// 签到
import CheckIn from "@/page/checkin/CheckIn.vue";

import PostMenu from "@/page/PostMenu.vue";
export default {
  name: "app",
  components: {
    pswp,
    payfor,
    actionsheet,
    commentInput,

    CheckIn,
    SvgIcon,
    PostMenu
  },
  computed: {
    checkin() {
      return this.$store.state.CONFIG.checkin || true;
    }
  }
};
</script>
<style lang="less">
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}

.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}
</style>
