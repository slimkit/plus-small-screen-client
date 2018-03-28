<template>
  <div>
    <nav class="m-box m-head-top m-lim-width m-pos-f m-main m-bb1">
      <ul class="m-box m-flex-grow1 m-aln-center m-justify-center m-flex-base0 m-head-nav">
        <router-link tag="li" to="/feed/new" active-class="active" exact>
          <a>最新</a>
        </router-link>
        <router-link tag="li" to="/feed/hot" active-class="active" exact>
          <a>热门</a>
        </router-link>
        <router-link tag="li" to="/feed/follow" active-class="active" exact>
          <a>关注</a>
        </router-link>
      </ul>
    </nav>
    <load-more 
      class="p-feed-main"
      :onRefresh='onRefresh'
      :onLoadMore='onLoadMore'
      ref='loadmore'
      >
      <ul>
        <li v-if="feed.id" v-for="feed in pinned" :key="`pinned-feed-${feed_type}-${feed.id}`">
          <feed-card :feed="feed" :pinned="true" />
        </li>
        <li v-if="feed.id" v-for="feed in feeds" :key="`feed-${feed_type}-${feed.id}`">
          <feed-card :feed="feed" />
        </li>
      </ul>
    </load-more>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import { oneOf } from "../../util/";
import FootGuide from "@/components/FootGuide";
import FeedCard from "@/components/FeedCard/FeedCard.vue";

/* 有效类型 */
const types = ["new", "hot", "follow"];

export default {
  name: "feedIndex",
  components: {
    FeedCard,
    // FeedItem,
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
    // this.ad = [];
    // this.feeds = [];
    // this.pinned = [];
    // this.$nextTick(this.$refs.loadmore.beforeRefresh);
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
  beforeRouteEnter({ params: { type } }, from, next) {
    types.indexOf(type) > -1 ? next() : next({ path: "/feed/new" });
  },
  beforeDestroy() {
    this.$store.commit("SAVE_FEED_TYPE", "");
  }
};
</script>

<style scoped>
.p-feed-main {
  padding-top: 90px;
}
.p-feed-main li + li {
  margin-top: 10px;
}
</style>
