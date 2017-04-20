<template>
  <div :class="$style.feedListContent">
    <FeedList :option="option"></FeedList>
  </div>
</template>

<script>
  import FeedList from '../components/FeedList';
  // import Feedslist from '../components/Feedslist';

  const FeedFollowing = {
    components: {
      FeedList
    },
    data: () => ({
      option: {
        uri: 'feeds/follows',
        limiter: 'max_id',
        type: 'following'
      }
    })
  }
  export default FeedFollowing;
</script>

<style lang="scss" module>
  .feedListContent {
    // padding-top: 53px;
  }
</style>
