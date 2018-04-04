<template>
  <section @click="goToChat" class="m-room-item m-box m-aln-center m-justify-bet m-main m-bb1">
    <avatar  :user="user" />
    <div class="m-flex-grow1 m-flex-shrink1 m-room-item-body">
      <h2>{{ user.name }}</h2>
      <p class="m-text-box">{{ lastMessage }}</p>
    </div>
    <!-- <div class="m-box-model m-text-r">
      <i>{{ lastMessageTime | time2tips }}</i>
      <v-badge count="100" />
    </div> -->
  </section>
</template>
<style lang="less">
.m-room-item {
  line-height: 1.4;
  padding: 20px;
  &-body {
    margin: 0 20px;
    h2 {
      color: @text-color1;
    }
    .m-text-box {
      color: @text-color3;
    }
  }
  .m-box-model i {
    font-size: 24px;
    color: #ccc;
  }
}
</style>
<script>
export default {
  name: "room-item",
  props: {
    room: [Object],
    roomId: [Number],
    userId: [Number]
  },
  methods: {
    goToChat() {
      this.$router.push(`/chats/${this.userId}`);
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUserById(this.userId) || {};
    },
    lastMessage() {
      return this.room.last_message_txt;
    },
    lastMessageTime() {
      return "" + this.room.last_message_time;
    }
  }
};
</script>
