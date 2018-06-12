<template>
  <div :class="prefixCls">
    <header slot="head" class="m-box m-justify-bet m-aln-center m-head-top m-pos-f m-main m-bb1">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg class='m-style-svg m-svg-def' @click='cancel'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
        <span>全站粉丝排行榜</span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end">

      </div>
    </header>
    <div :class="`${prefixCls}-list`">
      <div :class="`${prefixCls}-list-item`" v-for="(user, index) in users" :key="user.id">
        <span :class="{ top: index < 3 }" class="rank">{{ index + 1 }}</span>
        <div :class="`${prefixCls}-info`" @click="to(`/users/${user.id}`)">
          <avatar :class="`${prefixCls}-user-avatar`" :user="user"></avatar>
          <div :class="`${prefixCls}-title`">
            <h6>{{ user.name }}</h6>
            <p>粉丝：{{ user.extra.followers_count || 0 }}</p>
          </div>
        </div>
        <template>
          <svg class="m-style-svg m-svg-big" @click.stop="followUser(user, isFollow(user))">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="`#base-${isFollow(user)}`"></use>
          </svg>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import HeadTop from "../../../components/HeadTop";
import { followUserByStatus } from "@/api/user.js";
const prefixCls = "rankItem";
export default {
  components: {
    HeadTop
  },
  name: "fansList",
  props: {},
  data() {
    return {
      prefixCls,
      loading: false
    };
  },

  computed: {
    users() {
      return this.$store.getters.getUsersByType("rankFollowers");
    }
  },

  methods: {
    isFollow(user) {
      const { follower = false, following = false } = user;
      return follower && following
        ? "eachFollow"
        : follower
          ? "follow"
          : "unFollow";
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
    followUser(user, status) {
      if (this.loading) return;
      this.loading = true;
      followUserByStatus({ status, id: user.id })
        .then(state => {
          user.follower = state;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  },

  created() {}
};
</script>

<style lang="less" src="../style.less">
</style>
