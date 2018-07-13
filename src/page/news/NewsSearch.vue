<template>
  <div class="p-news-search">
    <header class="m-box m-aln-center m-pos-f m-main m-bb1 m-head-top">
      <div class="m-box m-flex-grow2 m-flex-shrink2 m-aln-center m-head-top-title">
        <div class="m-search-box">
          <form
            action="#"
            onsubmit="return false">
            <input
              v-model="keywordOrigin"
              type="search"
              placeholder="搜索"
              @input="searchNewsByKey">
          </form>
        </div>
      </div>
      <div class="m-box m-flex-grow0 m-flex-shrink0 m-aln-center m-justify-end">
        <a @click.prevent.stop="goBack">取消</a>
      </div>
    </header>
    <jo-load-more
      ref="loadmore"
      :auto-load="false"
      :show-bottom="list.length > 0"
      style="padding-top: 0.9rem"
      @onLoadMore="onLoadMore">
      <news-card
        v-for="news in list"
        v-if="news.id"
        :key="news.id"
        :news="news" />
    </jo-load-more>
    <p
      v-show="loading"
      class="load-more-ph m-text-c mt10">正在搜索...</p>
    <div
      v-show="noResult && !loading && keyword && !list.length"
      class="placeholder m-no-find"/>
  </div>
</template>

<script>
import _ from "lodash";
import NewsCard from "./components/NewsCard.vue";
import { searchNewsByKey } from "@/api/news.js";
import { limit } from "@/api/api";

export default {
  name: "NewsSearch",
  components: {
    NewsCard
  },
  data() {
    return {
      keywordOrigin: "",
      list: [],
      loading: false,
      noResult: false
    };
  },
  computed: {
    after() {
      const len = this.list.length;
      return len > 0 ? this.list[len - 1].id : 0;
    },
    keyword() {
      return this.keywordOrigin.trim();
    }
  },
  methods: {
    /**
     * 使用 lodash.debounce 节流，每输入 600ms 后执行
     * 不要使用箭头函数，会导致 this 作用域丢失
     * @author mutoe <mutoe@foxmail.com>
     */
    searchNewsByKey: _.debounce(function() {
      if (!this.keyword) return;
      this.loading = true;
      searchNewsByKey(this.keyword).then(({ data: list }) => {
        this.loading = false;
        this.list = list;
        this.$refs.loadmore.afterRefresh(list.length < limit);
        if (!list.length) this.noResult = true;
      });
    }, 600),
    onLoadMore() {
      searchNewsByKey(this.keyword, limit, this.after).then(
        ({ data: list }) => {
          this.list = [...this.list, ...list];
          this.$refs.loadmore.afterLoadmore(list.length < limit);
        }
      );
    }
  }
};
</script>

<style lang="less" scoped>
.p-news-search {
  height: ~"calc(100% - 90px)";

  .m-head-top-title {
    padding: 0 20px 0 0;
    .m-search-box {
      width: 100%;
    }
  }

  .jo-loadmore-head {
    top: 90px;
  }

  .placeholder {
    width: 100%;
    height: 100%;
  }
}
</style>

<style lang="less">
.jo-loadmore-head {
  top: 90px;
}
</style>
