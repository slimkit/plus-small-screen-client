<template lang="html">
  <div class="user-item" :id='`user-item-${user.id}`'>
    <v-avatar :uid='user.id' class="user-item-avatar" :sex='user.sex' :src='user.avatar'></v-avatar>
    <div class="user-item-info">
        <p class="user-item-name ellipsis">{{ user.name }}</p>
        <p class="user-item-bio ellipsis">{{ user.bio || '这家伙很懒,什么也没留下' }}</p>
    </div>
    <svg class="user-item-follow-icon" @click.stop='followUser'>
      <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="`#base-${isFollow}`"></use>
    </svg>
  </div>
</template>

<script>
export default {
  name: "UserItem",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    isFollow() {
      const { follower = false, following = false } = this.user;
      return follower && following
        ? "eachFollow"
        : follower ? "follow" : "unFollow";
    }
  },
  methods: {
    followUser() {
      if (this.loading) return false;
      this.loading = true;
      this.$store
        .dispatch("FOLLOW_USER", {
          id: this.user.id,
          status: this.isFollow
        })
        .then(({ follower }) => {
          this.loading = false;
          this.user.follower = follower;
        })
        .catch(err => {
          const { response: { data = { message: "操作失败" } } = {} } = err;

          this.loading = false;
          this.$Message.error(data);
        });
    }
  }
};
</script>

<style lang="less" src='./style/UserItem.less'>
</style>
