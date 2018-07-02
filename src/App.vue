<template>
  <div 
    id="app" 
    class="wap-wrap">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
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
      <chooseGroupCate />
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
//
import chooseGroupCate from "@/page/chooseGroupCate.vue";
// 提示性 弹窗
import infoTips from "@/components/infoTips.vue";
// 通用置顶弹窗
import applyTop from "@/components/applyForTop.vue";

import { mapActions, mapState } from "vuex";
// import WebIM from "@/vendor/easemob";

export default {
  name: "App",
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
    chooseGroupCate
  },
  data() {
    return {
      title: "TS+"
    };
  },
  watch: {
    $route(val) {
      const {
        meta: { title }
      } = val;
      title && (this.title = title);
    },
    title(val) {
      val && (document.title = val);
    }
  },
  methods: {
    ...mapActions(["BOOTSTRAPPERS"])
  },
  computed: {
    ...mapState({
      UID: state => state.CURRENTUSER.id,
      status: state => state.EASEMOB.status
    })
  },
  created() {
    this.BOOTSTRAPPERS();
  }
};
</script>
