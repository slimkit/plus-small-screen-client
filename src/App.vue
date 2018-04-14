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
      <apply-top />
      <info-tips />
      <choose-tags />
      <EasemobRoot />
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
// 通用置顶弹窗
import applyTop from "@/components/applyForTop.vue";
import EasemobRoot from "@/page/message/msg.vue";

import localStore from "store";
import bus from "@/bus.js";

import { mapActions } from "vuex";

export default {
  name: "app",
  components: {
    pswp,
    payfor,
    actionsheet,
    commentInput,
    infoTips,
    applyTop,
    SvgIcon,
    Reward,
    CheckIn,
    PostMenu,
    chooseTags,
    EasemobRoot
  },
  methods: {
    ...mapActions(["BOOTSTRAPPERS"])
  },
  created() {
    this.BOOTSTRAPPERS();
  },
  mounted() {
    const TOKEN = (localStore.get("CURRENTUSER") || {}).token;
    if (TOKEN) {
      bus.$emit("connect-easemob");
    }
  }
};
</script>
