<template>
  <footer id="foot_guide">
    <section @click="to('/feeds?type=hot')" class="guide_item" :class="{active: isCurPath('/feed')}">
      <svg class="m-style-svg m-svg-def foot_guide_icon">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#foot-home"></use>
      </svg>
      <span>动态</span>
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
    <section @click="to('/message/info')" class="guide_item" :class="{active: isCurPath('/message')}">
      <v-badge :dot='hasMsg'>
        <svg class="m-style-svg m-svg-def foot_guide_icon">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#foot-message"></use>
        </svg>
      </v-badge>
      <span>消息</span>
    </section>
    <section @click="to('/profile')" class="guide_item" :class="{active: isCurPath('profile')}">
      <v-badge :dot='profile'>
        <svg class="m-style-svg m-svg-def foot_guide_icon">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#foot-profile"></use>
        </svg>
      </v-badge>
      <span>我</span>
    </section>
  </footer>
</template>
<script>
import { mapState, mapGetters } from "vuex";
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
        state.MESSAGE.NEW_UNREAD_COUNT.commented +
          state.MESSAGE.NEW_UNREAD_COUNT["feed-comment-pinned"] +
          state.MESSAGE.NEW_UNREAD_COUNT["group-join-pinned"] +
          state.MESSAGE.NEW_UNREAD_COUNT.liked +
          state.MESSAGE.NEW_UNREAD_COUNT["news-comment-pinned"] +
          state.MESSAGE.NEW_UNREAD_COUNT["post-comment-pinned"] +
          state.MESSAGE.NEW_UNREAD_COUNT["post-pinned"] +
          state.MESSAGE.NEW_UNREAD_COUNT.system >
        0,
      profile: state =>
        state.MESSAGE.NEW_UNREAD_COUNT.following +
          state.MESSAGE.NEW_UNREAD_COUNT.mutual >
        0
    }),
    ...mapGetters(["hasUnreadChat"]),
    hasMsg() {
      return this.has_msg || this.hasUnreadChat > 0;
    }
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
