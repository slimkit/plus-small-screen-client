<template>
  <div :class="`${prefixCls}`">
    <head-top :go-back='goBack'>
      <diy-select slot='nav' v-model='currentType' :options='options' placeholder='动态评论置顶'></diy-select>
    </head-top>
    <div :class="`${prefixCls}-container`">
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
