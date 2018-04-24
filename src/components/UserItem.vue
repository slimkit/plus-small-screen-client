<template>
  <div class="m-box m-aln-center m-main user-item" @click='toUserHome'>
    <avatar :user="user" />
    <section 
      class="m-box-model m-flex-grow1 m-flex-shrink1 m-flex-base0 m-text-cut user-item-body">
      <h2 class="m-text-box m-text-cut">{{ user.name }}</h2>
      <p class="m-text-box m-text-cut">{{ user.bio || "这家伙很懒，什么也没留下" }}</p>
    </section>
    <svg class="m-style-svg m-svg-def" @click.stop="followUser">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="`#base-${isFollow}`"></use>
    </svg>
  </div>
</template>
<script>
import { followUserByStatus } from "@/api/user.js";
export default {
  name: "user-item",
  props: {
    user: null,
    link: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false
    };
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
    toUserHome() {
      this.link && this.$router.push(`/user/${this.user.id}`);
    },
    followUser() {
      if (this.loading) return;
      this.loading = true;
      followUserByStatus({
        id: this.user.id,
        status: this.isFollow
      }).then(follower => {
        this.user.follower = follower;
        this.loading = false;
      });
    }
  },
  created() {
    this.$store.commit("SAVE_USER", this.user);
  }
};
</script>
<style lang='less'>
.user-item {
  padding: 30px 20px;
  & + & {
    border-top: 1px solid #ededed; /*no*/
  }
  .user-item-body {
    margin-left: 30px;
    margin-right: 30px;
    h2 {
      margin: 9px 0;
      font-size: 32px;
    }
    p {
      margin: 9px 0;
      font-size: 28px;
      color: @text-color3;
    }
  }
  .m-svg-def {
    width: 42px;
    height: 42px;
  }
}
</style>
