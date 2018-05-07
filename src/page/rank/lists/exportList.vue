<template>
  <div :class="prefixCls">
    <head-top :go-back='cancel' append='true' title='社区专家排行榜'>
      <div slot='append'>
        
      </div>
    </head-top>
    <div :class="`${prefixCls}-list`">
      <div :class="`${prefixCls}-list-item`" v-for="(user, index) in users" :key="user.id">
        <span :class="{ top: index < 3 }" class="rank">{{ index + 1 }}</span>
        <div :class="`${prefixCls}-info`" @click="to(`/user/${user.id}`)">
          <avatar :class="`${prefixCls}-user-avatar`" :user="user"></avatar>
          <div :class="`${prefixCls}-title`">
            <h6>{{ user.name }}</h6>
          </div>
        </div>
        <template>
            <v-icon :type='`base-${isFollow(user.id)}`' class='find-item-follow-icon' @click.native='followUser(user.id)'></v-icon>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import HeadTop from "../../../components/HeadTop";
const prefixCls = "rankItem";
export default {
  components: {
    HeadTop
  },
  name: "exportList",
  props: {},
  data() {
    return {
      prefixCls,
      loading: false
    };
  },

  computed: {
    users() {
      return this.$store.getters.getUsersByType("rankQuestionExperts");
    }
  },

  methods: {
    isFollow(id) {
      let user = this.$store.getters.getUserById(id);
      const { follower = false, following = false } = user;
      return follower && following
        ? "eachFollow"
        : follower ? "follow" : "unFollow";
    },
    cancel() {
      this.to("/rank/users");
    },
    to(path) {
      path = typeof path === "string" ? { path } : path;
      if (path) {
        this.$router.push(path);
      }
    },
    followUser(id) {
      if (this.loading) return;
      this.loading = true;
      let user = this.$store.getters.getUserById(id);
      this.$store
        .dispatch("FOLLOW_USER", {
          id,
          status: this.isFollow(id)
        })
        .then(({ follower }) => {
          user.follower = follower;
          this.$store.commit("SAVE_USER", user);
          this.loading = false;
        })
        .catch(err => {
          const { response: { data = { message: "操作失败" } } = {} } = err;

          this.loading = false;
          this.$Message.error(data);
          this.loading = false;
        });
    }
  },

  created() {}
};
</script>

<style lang="less" src="../style.less">
</style>
