<template>
  <div :class="`${prefixCls}`">
    <header class="m-box m-head-top m-pos-f m-main m-bb1" style="overflow: visible;">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0">
        <svg class="m-style-svg m-svg-def" @click="goBack">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box m-aln-center m-flex-grow2 m-flex-base2 m-justify-center">
        <diy-select 
        slot='nav'
        :options='options'
        v-model='currentType'
        placeholder='动态评论置顶' 
        style="margin-top: -1px"></diy-select>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0 m-justify-end"></div>
    </header>
    <div :class="`${prefixCls}-container`" style="padding-top: 0.9rem">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
const prefixCls = "auditList";
const options = [
  {
    value: "feedcomments",
    label: "动态评论置顶"
  },
  {
    value: "newscomments",
    label: "文章评论置顶"
  },
  {
    value: "groupposts",
    label: "帖子置顶"
  },
  {
    value: "groupcomments",
    label: "帖子评论置顶"
  },
  {
    value: "groupjoins",
    label: "圈子加入申请"
  }
];
// const items = {};
export default {
  name: "myAudits",
  data: () => ({
    prefixCls,
    refreshData: [],
    options,
    currentType: "feedComment"
  }),
  watch: {
    currentType(type) {
      this.$router.push(`/message/audits/${type}`);
    }
  },
  methods: {
    goBack() {
      this.$router.push("/message");
    }
  },
  computed: {
    ...mapState({
      // audits: state =>
    })
  }
};
</script>
<style lang="less" src="../style.less">
</style>

<style lang="less">
.auditList {
  .diy-select--options {
    margin-top: -1px; /* no */
  }
}
</style>
