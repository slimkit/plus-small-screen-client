<template>
  <FeedList :option="option"></FeedList>
</template>

<script>
  import FeedList from '../components/FeedList';

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
