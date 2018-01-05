<template>
    <div class="feed-detail">
      <head-top :go-back='true'></head-top>

    </div>
</template>
<script>
import HeadTop from '@/components/HeadTop'
export default {
  name: 'feedDetail',
  components: {
    HeadTop
  },
  methods: {
    to (path) {
      this.$route.push(path)
    }
  }
}
</script>
<style lang='less'>
.feed-detail {}
</style>