<template>
  <div class="p-profile-news">
    <header class="m-box m-pos-f m-main m-bb1 m-head-top">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0">
        <svg
          class="m-style-svg m-svg-def"
          @click="goBack">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#base-back"/>
        </svg>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0 m-justify-center m-head-top-title">
        <span>我的投稿</span>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0 m-justify-end"/>
    </header>

    <main style="padding-top: .9rem">
      <div class="m-pos-f m-box m-aln-center m-justify-bet m-sub-nav m-bb1 m-main">
        <router-link
          replace
          exact
          tag="div"
          exact-active-class="active"
          to="/profile/news/released"
          class="m-sub-nav-item">
          <a>已发布</a>
        </router-link>
        <router-link
          replace
          exact
          tag="div"
          exact-active-class="active"
          to="/profile/news/auditing"
          class="m-sub-nav-item">
          <a>投稿中</a>
        </router-link>
        <router-link
          replace
          exact
          tag="div"
          exact-active-class="active"
          to="/profile/news/rejected"
          class="m-sub-nav-item">
          <a>被驳回</a>
        </router-link>
      </div>
      <load-more
        ref="loadmore"
        :on-refresh="onRefresh"
        :on-load-more="onLoadMore"
        style="padding-top: .9rem">
        <news-card
          v-for="news in newsList"
          :news="news"
          :key="news.id" />
      </load-more>
    </main>
  </div>
</template>
<script>
import _ from "lodash";
import { getMyNews } from "@/api/news.js";
import NewsCard from "@/page/news/components/NewsCard.vue";

export default {
  components: {
    NewsCard
  },
  data() {
    const released = new Map();
    const auditing = new Map();
    const rejected = new Map();
    return {
      released,
      auditing,
      rejected,
      ChangeTracker: 1
    };
  },
  computed: {
    newsList() {
      return (
        this.type &&
        this.ChangeTracker &&
        Array.from(this.$data[this.type].values())
      );
    },
    type() {
      return this.$route.params.type;
    },
    after() {
      const last = _.last(this.newsList);
      return last ? last.id : 0;
    },
    typeParam() {
      if (this.type === "released") {
        return 0;
      }
      if (this.type === "rejected") {
        return 3;
      }
      return 1;
    },
    params() {
      const { typeParam: type, after } = this;
      return {
        type,
        after,
        limit: 15
      };
    }
  },
  watch: {
    type(val) {
      this.isCurrentView && val && this.$refs.loadmore.beforeRefresh();
    }
  },
  activated() {
    this.isCurrentView = true;
  },
  deactivated() {
    this.isCurrentView = false;
  },
  methods: {
    formatNews(newsList) {
      newsList.forEach(news => {
        this.$data[this.type].set(news.id, news);
        this.ChangeTracker += 1;
      });
    },
    onRefresh() {
      getMyNews({ ...this.params }).then(({ data }) => {
        this.formatNews(data);
        this.$refs.loadmore.topEnd(!(data.length < this.params.limit));
      });
    },
    onLoadMore() {
      getMyNews({ ...this.params }).then(({ data = [] }) => {
        this.formatNews(data);
        this.$refs.loadmore.bottomEnd(data.length < this.params.limit);
      });
    }
  }
};
</script>
<style lang="less">
.p-profile-news {
  .m-sub-nav {
    top: 90px;
    z-index: 2;
    .m-sub-nav-item {
      height: 100%;
      line-height: 90px;
      &.router-link-active {
        color: #333;
        border-bottom: 4px solid #59b6d7;
      }
    }
  }
}
</style>
