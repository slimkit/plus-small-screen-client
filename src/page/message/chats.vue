<template>
  <div class="p-chat-rooms">
    <header class="m-box m-head-top m-lim-width m-pos-f m-main m-bb1">
      <ul class="m-box m-flex-grow1 m-aln-center m-justify-center m-flex-base0 m-head-nav">
        <router-link tag="li" to="/message/msg" active-class="active">
          <v-badge :dot="has_msg">
            <a>消息</a>
          </v-badge>
        </router-link>
        <router-link tag="li" to="/chats" active-class="active">
          <v-badge :dot='unread_chat'>
            <a>聊天</a>
          </v-badge>
        </router-link>
      </ul>
    </header>
    <main class="m-chat-room-items">
      <ul>
        <li v-for="room in ROOMS" :key="`room-${room.id}`">
          <item :roomId="room.id" :userId="room.uid" :room="room" />
        </li>
      </ul>
    </main>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import Item from "./roomItem";
import { mapState } from "vuex";

export default {
  components: {
    Item
  },
  name: "chat-list",
  data() {
    return {
      chats: []
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
      unread_chat: state => state.MESSAGE.UNREAD_COUNT.notification,
      ROOMS: state => state.easemob.ROOMS
    })
  }
};
</script>
<style lang="less">
.p-chat-rooms {
  .m-chat-room-items {
    padding-top: 0.9rem;
    padding-bottom: 1rem;
  }
}
</style>
