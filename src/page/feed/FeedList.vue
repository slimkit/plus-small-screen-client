<template>
  <div class="p-feed">
    <nav class="m-box m-head-top m-lim-width m-pos-f m-main m-bb1">
      <ul class="m-box m-flex-grow1 m-aln-center m-justify-center m-flex-base0 m-head-nav">
        <router-link
          :to="{ name:'feeds', query: { type: 'new' } }"
          tag="li"
          active-class="active"
          exact
          replace>
          <a>最新</a>
        </router-link>
        <router-link
          :to="{ name:'feeds', query: { type: 'hot' } }"
          tag="li"
          active-class="active"
          exact
          replace>
          <a>热门</a>
        </router-link>
        <router-link
          :to="{ name:'feeds', query: { type: 'follow' } }"
          tag="li"
          active-class="active"
          exact
          replace>
          <a>关注</a>
        </router-link>
      </ul>
    </nav>
    <jo-load-more
      ref="loadmore"
      :auto-load="true"
      class="p-feed-main"
      @onRefresh="onRefresh"
      @onLoadMore="onLoadMore" >

      <!-- 热门动态顶部 banner 广告位 -->
      <banner-ad
        v-if="feedType === 'hot'"
        type="feed:hot"/>

      <ul class="p-feed-list">
        <li
          v-for="(feed, index) in pinned"
          v-if="feed.id"
          :key="`pinned-feed-${feedType}-${feed.id}-${index}`">
          <feed-card
            :feed="feed"
            :pinned="true" />
        </li>
        <li
          v-for="(card, index) in feeds"
          :key="`feed-${feedType}-${card.id}-${index}`">
          <feed-card
            v-if="card.user_id"
            :feed="card" />
          <feed-ad-card
            v-if="card.space_id"
            :ad="card"/>
        </li>
      </ul>
    </jo-load-more>
    <foot-guide/>
  </div>
</template>

<script>
/**
 * 动态列表
 * @typedef {{id: number, user, ...others}} FeedDetail
 */

import FeedCard from "@/components/FeedCard/FeedCard.vue";
import FeedAdCard from "./components/FeedAdCard.vue";
import BannerAd from "@/components/advertisement/BannerAd.vue";
import * as api from "@/api/feeds.js";
import * as bootApi from "@/api/bootstrappers.js";

const feedTypesMap = ["new", "hot", "follow"];
const noop = () => {};

export default {
  name: "FeedList",
  components: { FeedCard, BannerAd, FeedAdCard },
  data() {
    return {
      pinned: [], // 置顶
      adCardList: [],
      adIndex: 0,

      newFeeds: [],
      hotFeeds: [],
      followFeeds: []
    };
  },
  computed: {
    feedType() {
      return this.$route.query.type;
    },
    feeds: {
      get() {
        return this.feedType ? this.$data[`${this.feedType}Feeds`] : [];
      },
      set(val) {
        this.$data[`${this.feedType}Feeds`] = val;
      }
    },
    maxId() {
      const len = this.feeds.length;
      return len ? this.feeds[len - 1].id : 0;
    },
    /**
     * 模拟动态卡片广告列表
     * @returns {FeedDetail[]}
     */
    feedCardAdsId() {
      const adType = this.$store.getters.getAdTypeBySpace("feed:list:analog");
      return adType.id;
    }
  },
  watch: {
    feedType(val, oldVal) {
      feedTypesMap.includes(val) &&
        oldVal &&
        this.$refs.loadmore.beforeRefresh();
    }
  },
  created() {
    this.onRefresh(noop);
    this.getAdCards();
  },
  methods: {
    onRefresh(callback) {
      // TODO: @mutoe [api] refactor there with vuex action
      api.getFeedsByType(this.feedType, 15).then(({ data }) => {
        const { pinned = [], feeds = [] } = data;
        this.pinned = pinned;
        callback(feeds.length < 15);
        if (this.feedType === "hot") {
          // 从广告栈顶取出一条随机插入列表
          let rand = ~~(Math.random() * 14) + 1;
          rand > feeds.length && (rand = feeds.length);
          this.adIndex = 0;
          this.adCardList[this.adIndex] &&
            feeds.splice(rand, 0, this.adCardList[this.adIndex++]);
        }
        this.feeds = feeds;
      });
    },
    onLoadMore(callback) {
      // 热门动态 修改为 offset
      const after =
        this.feedType === "hot"
          ? this.hotFeeds.length - this.adCardList.length
          : this.maxId;
      api.getFeedsByType(this.feedType, 15, after).then(({ data }) => {
        const { pinned = [], feeds = [] } = data;
        this.pinned = pinned;
        callback(feeds.length < 15);
        if (this.feedType === "hot") {
          // 从广告栈顶取出一条随机插入列表
          let rand = ~~(Math.random() * 9) + 1;
          rand > feeds.length && (rand = feeds.length);
          this.adCardList[this.adIndex] &&
            feeds.splice(rand, 0, this.adCardList[this.adIndex++]);
        }
        this.feeds = [...this.feeds, ...feeds];
      });
    },
    getAdCards() {
      // TODO: @mutoe [api] refactor there with vuex action
      bootApi.getAdsById(this.feedCardAdsId).then(({ data }) => {
        this.adCardList = data.sort((a, b) => a.sort < b.sort);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.p-feed {
  .p-feed-main {
    padding-top: 90px;
  }

  .p-feed-list > li + li {
    margin-top: 20px;
  }
}
</style>
