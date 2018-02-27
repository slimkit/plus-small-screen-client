<template>
  <div class="p-news-search">
    <head-top :go-back='true' :append='true' title='搜索资讯'>
      <div slot='append' class="head-top-cancel" @click='beforeSearch'>搜索</div>
      <div slot='title' class="p-news-search-input">
        <input type="text" v-model='keyword' @keypress='beforeSearch($event)'>
      </div>
    </head-top>
    <div></div>
    <load-more
    ref='loadmore'
    :onRefresh='topEvent'
    :onLoadMore='onLoadMore'
    class="p-news-search-body">
      <news-item
      v-for='news in list'
      v-if='news.id'
      :key='news.id'
      :news='news'
      />
    </load-more>
  </div>
</template>
<script>
import newsItem from './components/newsItem.vue';
export default {
  name: 'news-search',
  components: {
    newsItem
  },
  data() {
    return {
      keyword: '',
      list: []
    };
  },
  computed: {
    after() {
      const len = this.list.length;
      return len > 0 ? this.list[len - 1].id : 0;
    },
    topEvent() {
      const len = this.keyword.length;
      return len > 0 ? this.onRefresh : null;
    }
  },
  methods: {
    beforeSearch(e) {
      if (!this.keyword) return;
      const type = e.type;
      switch (type) {
        case 'click':
          return this.onRefresh();
        case 'keypress':
          return e.keyCode === 13 && this.onRefresh();
      }
    },
    onRefresh() {
      if (!this.keyword) {
        return this.$refs.loadmore.topEnd(!1);
      }
      this.$http
        .get(`/news`, {
          params: {
            limit: 15,
            key: this.keyword
          }
        })
        .then(({ data } = []) => {
          this.list = data;
          this.$refs.loadmore.topEnd(!(data.length < 15));
        });
    },
    onLoadMore() {
      if (!this.keyword) {
        return this.$refs.loadmore.bottomEnd(true);
      }
      this.$http
        .get(`/news`, {
          params: {
            limit: 15,
            key: this.keyword,
            after: this.after
          }
        })
        .then(({ data } = []) => {
          data.length > 0 && (this.list = [...this.list, ...this.data]);
          this.$refs.loadmore.bottomEnd(data.length < 15);
        });
    }
  }
};
</script>
<style lang='less' src='./style/newsSearch.less'>

</style>
