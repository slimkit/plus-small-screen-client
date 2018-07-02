<template>
  <div :class="prefixCls">
    <header 
      slot="head" 
      class="m-box m-justify-bet m-aln-center m-head-top m-pos-f m-main m-bb1">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg 
          class="m-style-svg m-svg-def" 
          @click="cancel">
          <use 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            xlink:href="#base-back"/>
        </svg>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
        <span>{{ title }}解答排行榜</span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end"/>
    </header>
    <load-more
      ref="loadmore"
      :on-refresh="onRefresh"
      :on-load-more="onLoadMore"
      style="padding-top: .9rem">
      <div :class="`${prefixCls}-list`">
        <rank-list-item
          v-for="(user, index) in users"
          :prefix-cls="prefixCls"
          :key="user.id"
          :user="user"
          :index="index">
          <p>回答量：{{ user.extra.count || 0 }}</p>
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
const api = "/question-ranks/answers";
const config = {
  week: {
    vuex: "rankQuestionsWeek",
    title: "本周",
    query: "week"
  },
  today: {
    vuex: "rankQuestionsToday",
    title: "今日",
    query: "day"
  },
  month: {
    vuex: "rankQuestionsMonth",
    title: "本月",
    query: "month"
  }
};

export default {
  name: "QuestionsList",
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

  created() {
    let time = this.$route.params.time || "today";
    this.title = config[time].title;
    this.vuex = config[time].vuex;
    this.query = config[time].query;
    if (this.users.length === 0) {
      this.onRefresh();
    }
  },

  methods: {
    cancel() {
      this.to("/rank/questions");
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
  }
};
</script>

<style lang="less" src="../style.less">
</style>
