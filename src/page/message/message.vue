<template>
  <div :class="`${prefixCls}`">
    <nav class="m-box m-head-top m-lim-width m-pos-f m-main m-bb1">
      <ul class="m-box m-flex-grow1 m-aln-center m-justify-center m-flex-base0 m-head-nav">
        <router-link tag="li" to="/message/msg" active-class="active" exact>
          <v-badge :dot="has_msg">
            <a>消息</a>
          </v-badge>
        </router-link>
        <router-link tag="li" to="/chats" active-class="active" exact>
          <v-badge :dot='unread_chat'>
            <a>聊天</a>
          </v-badge>
        </router-link>
      </ul>
    </nav>
    <main style="padding-top: 0.9rem">
      <router-view></router-view>
    </main>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import HeadTop from "../../components/HeadTop";
import FootGuide from "../../components/FootGuide";
import { mapState } from "vuex";
const prefixCls = "message";
export default {
  name: "messageIndex",
  data() {
    return {
      prefixCls
    };
  },
  computed: {
    ...mapState({
      // 新消息提示
      has_msg: state =>
        state.MESSAGE.NEW_UNREAD_COUNT.commented +
          state.MESSAGE.NEW_UNREAD_COUNT["feed-comment-pinned"] +
          state.MESSAGE.NEW_UNREAD_COUNT.following +
          state.MESSAGE.NEW_UNREAD_COUNT["group-join-pinned"] +
          state.MESSAGE.NEW_UNREAD_COUNT.liked +
          state.MESSAGE.NEW_UNREAD_COUNT.mutual +
          state.MESSAGE.NEW_UNREAD_COUNT["news-comment-pinned"] +
          state.MESSAGE.NEW_UNREAD_COUNT["post-comment-pinned"] +
          state.MESSAGE.NEW_UNREAD_COUNT["post-pinned"] +
          state.MESSAGE.NEW_UNREAD_COUNT.system >
        0,
      // state.MESSAGE.UNREAD_COUNT.msg.diggs.count +
      //   state.MESSAGE.UNREAD_COUNT.msg.comments.count +
      //   state.MESSAGE.UNREAD_COUNT.msg.audits.feedCommentCount +
      //   state.MESSAGE.UNREAD_COUNT.msg.audits.groupJoinCount +
      //   state.MESSAGE.UNREAD_COUNT.msg.audits.groupPostCommentCount +
      //   state.MESSAGE.UNREAD_COUNT.msg.audits.groupPostCount +
      //   state.MESSAGE.UNREAD_COUNT.msg.audits.newsCommentCount >
      // 0,
      unread_chat: state => state.MESSAGE.UNREAD_COUNT.notification
    })
  },
  methods: {},
  // 挂载完成后,请求新的消息
  beforeMount() {
    this.$store.dispatch("GET_UNREAD_COUNT");
    this.$store.dispatch("GET_NEW_UNREAD_COUNT");
  },
  components: {
    HeadTop,
    FootGuide
  }
};
</script>
<style lang="less" src="./style.less">
</style>
