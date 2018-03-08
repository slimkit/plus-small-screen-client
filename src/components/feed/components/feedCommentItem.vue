<template>
  <div class="feed-comment-item" v-if='user.id' @click.stop='commentAction'>
    <a @click.stop="to(`/user/${user.id}`)" class="user-name">{{ user.name }}</a>
    <template v-if='replyUser'>
      回复
      <a @click.stop='to(`/user/${replyUser.id}`)' class="user-name">{{ replyUser.name }}</a>
    </template>
    <span class="content">{{ body }}</span>
  </div>
</template>
<script>
export default {
  name: 'feedCommentItem',
  props: {
    comment: {
      required: true
    }
  },
  computed: {
    user() {
      const { user } = this.comment
      if (user) {
        return user
      }
    },
    replyUser() {
      const { reply } = this.comment
      return reply
    },
    body() {
      let r = this.comment.body
      return r.length > 60 ? r.slice(0, 57) + '…' : r
    }
  },
  methods: {
    to(path) {
      this.$router.push({ path })
    },
    commentAction() {
      this.$emit('action', this.user.id, this.user.name, this.comment.id)
    }
  },
  mounted() {
    if (this.user.id) {
      this.$store.commit('SAVE_USER', this.user)
    }
  }
}

</script>
<style lang='less'>
.feed-comment-item {
  color: #999;
  font-size: 26px;
  line-height: 1.4;
  max-height: 26*1.4*3px;
  overflow-y: hidden;
  .user-name {
    padding: 0 5px;
    color: #333;
    &:last-of-type:after {
      content: ':';
      padding-left: 5px;
      color: #999;
    }
  }
}

</style>
