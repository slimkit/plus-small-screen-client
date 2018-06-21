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
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end"></div>
    </header>
    <div :class="`${prefixCls}-list`">
      <rank-list-item
        v-for="(user, index) in users"
        :prefixCls="prefixCls"
        :key="user.id"
        :user="user"
        :index="index">
        <p>点赞量：{{ user.extra.count || 0 }}</p>
      </rank-list-item>
    </div>
  </div>
</template>

<script>
import HeadTop from "@/components/HeadTop";
import rankListItem from "../components/rankListItem.vue";

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
  name: "FeedsList",
  components: {
    HeadTop,
    rankListItem
  },
  data() {
    return {
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
    cancel() {
      this.to("/rank/feeds");
    },
    to(path) {
      path = typeof path === "string" ? { path } : path;
      if (path) {
        this.$router.push(path);
      }
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
