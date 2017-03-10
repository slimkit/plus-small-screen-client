<template>
  <div :class="FeedImages">
    
  </div>
</template>

<script>
  const FeedImages = {
    props: [
      images
    ],
    data: () => ({
      images: {}
    }),

  }
</script>

<style lang="scss" module>
  .FeedImages {
    width: 100%;
  }
</style>