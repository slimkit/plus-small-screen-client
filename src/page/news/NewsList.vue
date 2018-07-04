<template>
  <div class="p-news">
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
        <span>资讯</span>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0 m-justify-end">
        <router-link
          append
          tag="svg"
          to="search"
          class="m-style-svg m-svg-def">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#base-search"/>
        </router-link>
      </div>
    </header>

    <news-filter @change="onCateChange"/>

    <load-more
      ref="loadmore"
      :on-refresh="onRefresh"
      :on-load-more="onLoadMore"
      class="p-news--body" >
      <news-item
        v-for="news in list"
        v-if="news.id"
        :key="news.id"
        :news="news"
      />
    </load-more>
  </div>
</template>

<script>
import NewsItem from "./components/NewsItem.vue";
import NewsFilter from "./components/NewsFilter.vue";

export default {
  name: "NewsList",
  components: {
    NewsItem,
    NewsFilter
  },
  data() {
    return {
      list: [],
      currentCate: 0
    };
  },
  computed: {
    after() {
      const len = this.list.length;
      return len > 0 ? this.list[len - 1].id : 0;
    }
  },
  methods: {
    onCateChange({ id = 0 } = {}) {
      this.list = [];
      this.currentCate = id;
      this.$refs.loadmore.beforeRefresh();
    },
    onRefresh() {
      // GET /news
      const params =
        this.currentCate === 0
          ? { limit: 10, recommend: 1 }
          : { limit: 10, cate_id: this.currentCate };

      this.$http
        .get("/news", {
          params
        })
        .then(({ data = [] } = {}) => {
          this.list = data;
          this.$refs.loadmore.topEnd(!(data.length < 10));
        });
    },
    onLoadMore() {
      const params =
        this.currentCate === 0
          ? { limit: 10, recommend: 1, after: this.after }
          : { limit: 10, cate_id: this.currentCate, after: this.after };
      this.$http
        .get("/news", {
          params
        })
        .then(({ data = [] } = {}) => {
          this.list = [...this.list, ...data];
          this.$refs.loadmore.bottomEnd(data.length < 10);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.p-news {
  &--nav {
    display: flex;
    position: fixed;
    top: 90px;
    padding-top: 0 !important;
    width: 100%;
    height: 85px;
    border-bottom: 1px solid #ededed; /*no*/
    background-color: #fff;
  }

  &--body {
    padding-top: 90+85px;
  }
}
</style>
