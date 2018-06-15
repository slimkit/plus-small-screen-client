<template>
  <div class="p-profile-collection-feeds">
    <load-more
      style="padding-top: .9rem"
      ref='loadmore'
      :onRefresh='onRefresh'
      :onLoadMore='onLoadMore'>
      <ul>
        <li
          class="p-profile-collection-feeds-item"
          v-for="feed in feeds"
          :key="`clet-${feed.id}`">
          <feed-card
            :feed="feed"
            :show-footer="false"/>
        </li>
      </ul>
    </load-more>
  </div>
</template>
<script>
// import FeedItem from "./children/feedItem.vue";
import FeedCard from "@/components/FeedCard/FeedCard.vue";
import { getCollectedFeed } from "@/api/feeds.js";
export default {
  name: "profile-collection-feeds",
  components: {
    FeedCard
  },
  data: () => ({
    feedList: new Map(),
    ChangeTracker: 1,
    isCurrentView: false
  }),
  methods: {
    formatFeeds(feedList) {
      feedList.forEach(feed => {
        this.feedList.set(feed.id, feed);
        this.ChangeTracker += 1;
      });
    },
    onRefresh() {
      let params = this.params;
      params = {
        ...params,
        offset: 0
      };
      getCollectedFeed({ ...params }).then(({ data = [] }) => {
        this.formatFeeds(data);
        this.$refs.loadmore.topEnd(!(data.length < this.params.limit));
      });
    },
    onLoadMore() {
      getCollectedFeed({ ...this.params }).then(({ data = [] }) => {
        this.formatFeeds(data);
        this.$refs.loadmore.bottomEnd(data.length < this.params.limit);
      });
    }
  },
  computed: {
    offset() {
      return this.feeds.length;
    },
    feeds() {
      return this.ChangeTracker && Array.from(this.feedList.values());
    },
    params() {
      return {
        offset: this.offset,
        limit: 15
      };
    }
  }
};
</script>
<style lang="less">
.p-profile-collection-feeds {
  &-item {
    .m-card-main {
      padding-bottom: 30px;
    }
  }
  &-item + &-item {
    margin-top: 10px;
  }
}
</style>
