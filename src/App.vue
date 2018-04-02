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
      <check-in />
      <post-menu />
      <actionsheet />
      <comment-input />

      <info-tips />
      <choose-tags />
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
// 选择标签
import chooseTags from "@/page/chooseTags.vue";
// 提示性 弹窗
import infoTips from "@/components/infoTips.vue";

export default {
  name: "app",
  components: {
    pswp,
    payfor,
    actionsheet,
    commentInput,
    infoTips,

    SvgIcon,

    Reward,
    CheckIn,
    PostMenu,
    chooseTags
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
