<template>
  <div :class="$style.feedListContent">
    <FeedList :option="option"></FeedList>
  </div>
</template>

<script>
  import FeedList from '../components/FeedList';

  const FeedNew = {
    components: {
      FeedList
    },
    data: () => ({
      option: {
        uri: 'feeds?type=new',
        limiter: 'max_id',
        type: 'new'
      }
    })
  }
  export default FeedNew;
</script>

<style lang="scss" module>
  .feedListContent {
    // padding-top: 53px;
  }
</style>