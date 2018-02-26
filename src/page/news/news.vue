<template>
  <div class="p-news">
    <head-top :go-back='true' title='资讯' :append='true'>
      <router-link to='serach' append tag='svg' slot='append'>
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-search"></use>
      </router-link>
    </head-top>
    <news-filter @change='onCateChange'></news-filter>
    <load-more 
    class="p-news--body"
    :onRefresh='onRefresh'
    :onLoadMore='onLoadMore'
    ref='loadmore'
    >
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
import newsFilter from './components/newsFilter';
export default {
  name: 'news-index',
  components: {
    newsItem,
    newsFilter
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
        .get('/news', {
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
        .get('/news', {
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
<style lang="less" src='./style/news.less'>

</style>
