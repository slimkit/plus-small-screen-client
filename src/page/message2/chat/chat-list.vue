<template>
  <div class="chat-list">
    <h2 v-if='showTips' class="m-box m-aln-center m-justify-center easemob-tips">{{ connecting }}</h2>
    <jo-load-more
    :auto-load="false"
    :showBottom="false"
    style="height: 100%"
    @onRefresh="onRefresh">
      <chat-item v-for="(chatItem, index) in chatList" :item="chatItem" :key="`${index}-${chatItem.UID}`" />
    </jo-load-more>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import chatItem from "./chat-item.vue";

import WebIM from "@/vendor/easemob";

export default {
  name: "chat-list",
  components: {
    chatItem
  },
  data() {
    return {
      showTips: false
    };
  },
  computed: {
    ...mapState({
      UID: state => state.CURRENTUSER.id,
      connecting: state => state.EASEMOB.connecting,
      chatList: state => state.EASEMOB.chatList || [],
      status: state => state.EASEMOB.status
    })
  },
  watch: {
    connecting(val) {
      val === "断开连接"
        ? (this.showTips = true)
        : setTimeout(() => {
            this.showTips = false;
          }, 2e3);
    }
  },
  methods: {
    ...mapActions(["initChats"]),
    onRefresh(callback) {
      if (WebIM.conn.isOpened()) {
        console.log("手动更新对话列表");
        this.$store.dispatch("initChats").then(data => {
          setTimeout(() => {
            callback(false);
          }, 1e3);
        });
      } else {
        console.log("手动重连");
        this.$store.dispatch("EASEMOB_OPEN", this.UID).then(data => {
          callback(false);
        });
      }
    }
  },
  mounted() {
    this.initChats();
  }
};
</script>

<style lang="less">
.chat-list {
  height: 100%;
}
.easemob-tips {
  position: fixed;
  top: 90px;
  left: 0;
  right: 0;
  z-index: 11;
  height: 60px;

  color: #fff;
  font-size: 24px;
  touch-action: none;

  background-color: rgba(89, 182, 215, 0.7);
}
</style>
