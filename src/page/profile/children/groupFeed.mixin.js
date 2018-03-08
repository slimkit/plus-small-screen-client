export default {
  computed: {
    user () {
      return this.feed.user || {}
    },
    name () {
      return this.user.name
    }
  }
}
