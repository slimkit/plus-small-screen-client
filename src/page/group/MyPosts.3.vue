<template>
  <div>
    <head-top v-if='head' :go-back='true' :title='`我的帖子`' />
    <load-more
    :onRefresh='onRefresh'
    :onLoadMore='onLoadMore'
    ref='loadmore'
    >
    <group-feed-item
    v-for='feed in list'
    v-if='feed.id'
    :key='feed.id'
    :feed='feed'
    />
    </load-more>
  </div>
</template>
<script>
import { GroupFeedItem } from "@/components/feed/feedItem";
export default {
  name: "my-groups-audit-list",
  components: {
    GroupFeedItem
  },
  data() {
    return {
      list: []
    };
  },
  computed: {
    head() {
      return this.$route.meta.head;
    }
  },
  methods: {
    onRefresh() {
      this.$http
        .get(
          `/plus-group/user-group-posts?limit=15&type=${this.$route.meta.index}`
        )
        .then(({ data }) => {
          this.list = [...data];
          this.$refs.loadmore.topEnd(!(data.length < 15));
        });
    },
    onLoadMore() {
      this.$http
        .get("/plus-group/user-groups", {
          params: {
            limit: 15,
            type: "audit",
            offset: this.list.length
          }
        })
        .then(({ data }) => {
          this.list = [...this.list, ...data];
          this.$refs.loadmore.bottomEnd(data.length < 15);
        });
    }
  },
  mounted() {
    this.$refs.loadmore.beforeRefresh();
  }
};
</script>
