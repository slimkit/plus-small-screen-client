<template>
  <div :class="prefixCls">
    <header slot="head" class="m-box m-justify-bet m-aln-center m-head-top m-pos-f m-main m-bb1">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg class='m-style-svg m-svg-def' @click='cancel'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
        <span>{{title}}资讯排行榜</span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end"></div>
    </header>
    <load-more
      style="padding-top: .9rem"
      ref="loadmore"
      :onRefresh="onRefresh"
      :onLoadMore="onLoadMore">
      <div :class="`${prefixCls}-list`">
        <rank-list-item
          v-for="(user, index) in users"
          :prefixCls="prefixCls"
          :key="user.id"
          :user="user"
          :index="index">
          <p>阅读量：{{ user.extra.count || 0 }}</p>
        </rank-list-item>
      </div>
    </load-more>
  </div>
</template>

<script>
import HeadTop from "@/components/HeadTop";
import rankListItem from "../components/rankListItem.vue";
import { getRankUsers } from "@/api/ranks.js";
import { limit } from "@/api/api.js";

const prefixCls = "rankItem";
const api = "/news/ranks";
const config = {
  week: {
    vuex: "rankNewsWeek",
    title: "本周",
    query: "week"
  },
  today: {
    vuex: "rankNewsToday",
    title: "今日",
    query: "day"
  },
  month: {
    vuex: "rankNewsMonth",
    title: "本月",
    query: "month"
  }
};

export default {
  name: "newsList",
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
      this.to("/rank/news");
    },
    to(path) {
      path = typeof path === "string" ? { path } : path;
      if (path) {
        this.$router.push(path);
      }
    },
    onRefresh() {
      getRankUsers(api, { type: this.query }).then(data => {
        this.$store.commit("SAVE_RANK_DATA", { name: this.vuex, data });
        this.$refs.loadmore.topEnd(false);
      });
    },
    onLoadMore() {
      getRankUsers(api, {
        type: this.query,
        offset: this.users.length || 0
      }).then((data = []) => {
        this.$store.commit("SAVE_RANK_DATA", {
          name: this.vuex,
          data: [...this.users, ...data]
        });
        this.$refs.loadmore.bottomEnd(data.length < limit);
      });
    }
  },

  created() {
    let time = this.$route.params.time || "today";
    this.title = config[time].title;
    this.vuex = config[time].vuex;
    this.query = config[time].query;
    if (this.users.length === 0) {
      this.onRefresh();
    }
  }
};
</script>

<style lang="less" src="../style.less">
</style>
