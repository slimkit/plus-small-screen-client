<template>
  <p class="m-text-box">
    <router-link tag="span" :to="`/user/${user.id}`" class='m-comment-usr'>
      <a>{{ user.name }}</a>
    </router-link>
    <span class="m-comment-usr" v-if="replyUser">回复<router-link :to='`/user/${replyUser.id}`'>{{ replyUser.name }}</router-link></span>
    <span class="m-comment-body" @click="handelClick">{{ body }}</span>
  </p>
</template>
<script>
export default {
  name: "comment-item",
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    isMine() {
      return this.$store.state.CURRENTUSER.id === this.user.id;
    },
    user() {
      return this.comment.user || {};
    },
    replyUser() {
      const { reply } = this.comment;
      return reply && reply.id ? reply : null;
    },
    body() {
      return this.comment.body || "";
    }
  },
  methods: {
    handelClick() {
      const p = this.isMine
        ? {
            isMine: true
          }
        : {
            isMine: false,
            placeholder: `回复${this.user.name}`,
            reply_user: this.user.id
          };
      this.$emit("on-click", p);
    }
  }
};
</script>
