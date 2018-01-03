<template>
  <div>
    payModal page
  </div>
</template>
<script>
export default {
  name: 'payModal',
  methods: {
    close() {
      this.$emit('on-close')
    }
  }
}

</script>
<style lang='less'></style>
