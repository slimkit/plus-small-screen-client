<template>
  <div class="chat-list">
    <jo-load-more
    :auto-load="false"
    :showBottom="false"
    style="height: 100%"
    @onRefresh="onRefresh">
      <chat-item 
      :item="room" 
      v-for="(room, index) in chatRooms" 
      :key="`${index}-${room.id}`" />
    </jo-load-more>

  </div>
</template>
<script>
import chatItem from "./chat-item.vue";
import { mapState, mapActions } from "vuex";
import { startSingleChat } from "@/vendor/easemob/";
export default {
  name: "chat-list",
  components: {
    chatItem
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      chatRooms: state => state.EASEMOB.chatRooms
    })
  },
  methods: {
    startSingleChat,
    ...mapActions(["initChatRooms"]),
    onRefresh(callback) {
      this.initChatRooms().then(data => {
        setTimeout(() => {
          callback(false);
        }, 1e3);
      });
    }
  },
  mounted() {
    this.initChatRooms();
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
