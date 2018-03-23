<template>
  <footer id="foot_guide">
    <section @click="to('/feed/new')" class="guide_item" :class="{active: isCurPath('/feed')}">
      <svg class="m-style-svg m-svg-def foot_guide_icon">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#foot-home"></use>
      </svg>
      <span>首页</span>
    </section>
    <section @click="to('/discover')" class="guide_item" :class="{active: isCurPath('/discover')}">
      <svg class="m-style-svg m-svg-def foot_guide_icon">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#foot-discover"></use>
      </svg>
      <span>发现</span>
    </section>
    <section @click="showPostMenu" class="guide_item plus">
      <svg class="m-style-svg m-svg-def foot_guide_icon plus">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#foot-plus"></use>
      </svg>
    </section>
    <section @click="to('/message/msg')" class="guide_item" :class="{active: isCurPath('/message')}">
      <v-badge :dot='has_msg'>
        <svg class="m-style-svg m-svg-def foot_guide_icon">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#foot-message"></use>
        </svg>
      </v-badge>
      <span>消息</span>
    </section>
    <section @click="to('/profile')" class="guide_item" :class="{active: isCurPath('profile')}">
      <v-badge :dot='has_fans'>
        <svg class="m-style-svg m-svg-def foot_guide_icon">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#foot-profile"></use>
        </svg>
      </v-badge>
      <span>我</span>
    </section>
  </footer>
</template>
<script>
import { mapState } from "vuex";
import bus from "@/bus.js";
export default {
  name: "FootGuide",
  data() {
    return {
      has_fans: false
    };
  },
  computed: {
    ...mapState({
      has_msg: state =>
        state.MESSAGE.UNREAD_COUNT.msg.diggs.count +
          state.MESSAGE.UNREAD_COUNT.msg.comments.count +
          state.MESSAGE.UNREAD_COUNT.msg.audits.feedCommentCount +
          state.MESSAGE.UNREAD_COUNT.msg.audits.groupJoinCount +
          state.MESSAGE.UNREAD_COUNT.msg.audits.groupPostCommentCount +
          state.MESSAGE.UNREAD_COUNT.msg.audits.groupPostCount +
          state.MESSAGE.UNREAD_COUNT.msg.audits.newsCommentCount >
        0
    })
  },
  methods: {
    to(path) {
      this.$router.push({ path });
    },
    isCurPath(path) {
      return this.$route.fullPath.indexOf(path) > -1;
    },
    showPostMenu() {
      bus.$emit("post-menu");
    }
  },
  mounted() {
    this.$el.parentNode.style.paddingBottom = "1rem";
  }
};
</script>
<style lang="less">
.foot_guide_icon {
  width: 45px;
  height: 45px;
  margin-bottom: 5px;
  &.plus {
    width: 65px;
    height: 65px;
  }
  + .v-badge-dot {
    top: 0;
    box-shadow: 0 0 0 1px #ed3f14; /*no*/
  }
}
</style>
<style lang="less" scoped>
#foot_guide {
  background-color: #363844;
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 10px;
  width: 100%;
  height: 100px;
  display: flex;
  box-shadow: 0 -0.026667rem 0.053333rem rgba(0, 0, 0, 0.1);
}

.guide_item {
  flex: 1;
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ccc;
  .v-badge-dot {
    top: 0;
  }
  &.plus {
    color: #fff !important;
    background-color: #59b6d7;
    margin: 0 15px;
  }
  &.active {
    color: #59b6d7;
  }
  span {
    font-size: 24px;
    color: inherit;
  }
}
</style>
