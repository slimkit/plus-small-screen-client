<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <div>
      <svg-icon />

      <pswp />
      <reward />
      <payfor />
      <post-menu />
      <actionsheet />
      <comment-input />
      <check-in v-if="checkin"/>
    </div>
  </div>
</template>
<script>
// 相册展示
import pswp from "@/components/pswp.vue";
// 发布菜单
import PostMenu from "@/page/PostMenu.vue";
// 通用支付弹窗
import payfor from "@/components/payfor.vue";
// 通用更多操作弹窗
import actionsheet from "@/components/actionsheet.vue";
// 通用评论输入框
import commentInput from "@/components/commentInput.vue";
// icons
import SvgIcon from "@/components/common/svgIcon.vue";
// 签到
import CheckIn from "@/page/checkin/CheckIn.vue";
// 打赏
import Reward from "@/components/reward.vue";

export default {
  name: "app",
  components: {
    pswp,
    payfor,
    actionsheet,
    commentInput,

    SvgIcon,

    Reward,
    CheckIn,
    PostMenu
  },
  computed: {
    /**
     * 检查后台是否开启签到功能
     * @author jsonleex <jsonlseex@163.com>
     * @return {Boolean}
     */
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
