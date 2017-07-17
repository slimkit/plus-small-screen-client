<template>
  <div :class="$style.feedListContent">
    <FeedList :option="option"></FeedList>
  </div>
</template>

<script>
  import FeedList from '../components/FeedList';

  const FeedHot = {
    components: {
      FeedList
    },
    data: () => ({
      option: {
        uri: 'feeds?type=hot',
        limiter: 'page',
        type: 'hot'
      }
    })
  }
  export default FeedHot;
</script>

<style lang="scss" module>
  .feedListContent {
    // padding-top: 53px;
  }
</style>