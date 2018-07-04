<template>
  <div class="p-news-search">
    <header class="m-box m-aln-center m-pos-f m-main m-bb1 m-head-top">
      <div class="m-box m-flex-grow2 m-flex-shrink2 m-aln-center m-head-top-title">
        <div class="m-search-box">
          <form
            action="#"
            onsubmit="return false">
            <input
              v-model="keyword"
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
      @onRefresh="onRefresh"
      @onLoadMore="onLoadMore">
      <news-item
        v-for="news in list"
        v-if="news.id"
        :key="news.id"
        :news="news"
      />
    </jo-load-more>
  </div>
</template>
<script>
import _ from "lodash";
import { searchNewsByKey } from "@/api/news.js";
import newsItem from "./components/newsItem.vue";

export default {
  name: "NewsSearch",
  components: {
    newsItem
  },
  data() {
    return {
      keyword: "",
      list: []
    };
  },
  computed: {
    after() {
      const len = this.list.length;
      return len > 0 ? this.list[len - 1].id : 0;
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
      searchNewsByKey(this.keyword).then((list = []) => {
        this.list = list;
      });
    }, 600),
    onRefresh(callback) {
      searchNewsByKey(this.keyword, 15).then(list => {
        this.list = list;
        callback(list.length < 15);
      });
    },
    onLoadMore(callback) {
      searchNewsByKey(this.keyword, 15, this.after).then(list => {
        this.list = [...this.list, ...list];
        callback(list.length < 15);
      });
    }
  }
};
</script>
<style lang="less">
.p-news-search {
  .m-head-top-title {
    padding: 0 20px 0 0;
    .m-search-box {
      width: 100%;
    }
  }

  .jo-loadmore-head {
    top: 90px;
  }
}
</style>
