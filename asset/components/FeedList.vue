<template>
  <div class="feed-list">
    <div class="feed" v-for="feed in feedLists">
      <Feed :feed="feed"></Feed>
      {{ key }}
    </div>
  </div>
</template>

<script>
  import Feed from './Feed';
  const FeedList = {
    props: [
      'feeds'
    ],
    data: () => ({
      feedLists: {}
    }),
    components: {
      Feed
    },
    beforeMount () {
      this.feedLists = Object.assign({}, this.feedLists, this.$props.feeds);
    }
  }

  export default FeedList;
</script>