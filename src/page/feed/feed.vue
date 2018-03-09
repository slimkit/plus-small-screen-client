<template>
  <div>
    <head-top>
      <div slot='nav' class="head-top-nav">
        <router-link class='head-top-nav-item' to="/feed/new">最新</router-link>
        <router-link class='head-top-nav-item' to="/feed/hot">热门</router-link>
        <router-link class='head-top-nav-item' to="/feed/follow">关注</router-link>
      </div>
    </head-top>
    <load-more 
    :onRefresh='onRefresh'
    :onLoadMore='onLoadMore'
    ref='loadmore'
    >
      <feed-item v-for='feed in feeds' channel='feed' :feed='feed' :key='`feed-${feed_type}-${feed.id}`'></feed-item>
    </load-more>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import { FeedItem } from "@/components/feed/feedItem";
import { oneOf } from "../../util/";
import HeadTop from "../../components/HeadTop";
import FootGuide from "../../components/FootGuide";

/* 有效类型 */
const types = ["new", "hot", "follow"];

export default {
  name: "feedIndex",
  components: {
    HeadTop,
    FeedItem,
    FootGuide
  },
  data() {
    return {
      feed_type: this.$route.params.type,

      ad: [], // 广告
      feeds: [], // 动态
      pinned: [], // 置顶

      maxId: 0
    };
  },
  watch: {
    $route({ params: { type } }) {
      /* 判断路由是否变化 */
      if (oneOf(type, types) && type !== this.feed_type) {
        this.ad = [];
        this.feeds = [];
        this.pinned = [];
        this.feed_type = type;
        this.$nextTick(this.$refs.loadmore.beforeRefresh);
      }
    }
  },
  activated() {
    this.ad = [];
    this.feeds = [];
    this.pinned = [];
    this.$nextTick(this.$refs.loadmore.beforeRefresh);
  },
  methods: {
    async onRefresh() {
      const { data: { ad, feeds, pinned } = {} } = await this.$http.get(
        "/feeds",
        {
          params: {
            type: this.feed_type,
            limit: 15
          }
        }
      );

      this.ad = ad ? [...ad] : [];
      this.feeds = feeds ? [...feeds] : [];
      this.pinned = pinned ? [...pinned] : [];
      this.maxId = feeds.length ? feeds[feeds.length - 1].id : 0;
      this.$refs.loadmore.topEnd(!(feeds.length < 15));
    },
    async onLoadMore() {
      const params = {
        type: this.feed_type,
        limit: 15,
        after: this.maxId
      };

      const { data: { ad, feeds, pinned } = {} } = await this.$http.get(
        "/feeds",
        { params }
      );
      this.ad = ad ? [...this.ad, ...ad] : this.ad;
      this.feeds = feeds ? [...this.feeds, ...feeds] : this.feeds;
      this.pinned = pinned ? [...this.pinned, ...pinned] : this.pinned;
      this.maxId = feeds.length ? feeds[feeds.length - 1].id : this.maxId;
      this.$refs.loadmore.bottomEnd(feeds.length < 15);
    }
  },
  /**
   * 组件内 路由守卫
   *     确保 feed_type 为有效值
   *         @author jsonleex <jsonleex@163.com>
   */
  beforeRouteEnter({ params: { type } }, from, next) {
    types.indexOf(type) > -1 ? next() : next({ path: "/feed/new" });
  },
  beforeDestroy() {
    this.$store.commit("SAVE_FEED_TYPE", "");
  }
};
</script>
<style lang="less">
</style>
