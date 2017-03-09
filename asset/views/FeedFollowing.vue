<template>
  <div :class="$style.feedListContent">
    <FeedList></FeedList>
  </div>
</template>

<script>
  import FeedList from '../components/FeedList';

  const FeedFollowing = {
    components: {
      FeedList
    },
    date: () => ({

    })
  }
  export default FeedFollowing;
</script>

<style lang="scss" module>
  .feedListContent {
    padding-top: 49px;
  }
</style>
