<template>
  <div :class="prefixCls">
    <header slot="head" class="m-box m-justify-bet m-aln-center m-head-top m-pos-f m-main m-bb1">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg class='m-style-svg m-svg-def' @click='cancel'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
        <span>{{title}}动态排行榜</span>
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
            <p>点赞量：{{ user.extra.count || 0 }}</p>
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
const api = "/feeds/ranks";
const config = {
  week: {
    vuex: "rankFeedsWeek",
    title: "本周",
    query: "week"
  },
  today: {
    vuex: "rankFeedsToday",
    title: "今日",
    query: "day"
  },
  month: {
    vuex: "rankFeedsMonth",
    title: "本月",
    query: "month"
  }
};

export default {
  components: {
    HeadTop
  },
  name: "FeedsList",
  props: {},
  data() {
    return {
      // users: [],
      prefixCls,
      loading: false,
      title: "", // 标题
      vuex: "", // vuex主键
      query: "" // api查询query
    };
  },

  computed: {
    users() {
      return this.$store.getters.getUsersByType(this.vuex);
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
      this.to("/rank/feeds");
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
    },

    getUsers() {
      this.$http
        .get(
          api,
          {
            params: {
              type: this.query
            }
          },
          {
            validateStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          this.$store.commit("SAVE_RANK_DATA", { name: this.vuex, data });
        });
    }
  },
  created() {
    let time = this.$route.params.time || "today";
    this.title = config[time].title;
    this.vuex = config[time].vuex;
    this.query = config[time].query;
    if (this.users.length === 0) {
      this.getUsers();
    }
  }
};
</script>

<style lang="less" src="../style.less">
</style>
