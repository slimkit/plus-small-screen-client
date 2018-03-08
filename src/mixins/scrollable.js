// const FUNC = (e) => { e.preventDefault() }
// const app = document.getElementById('app')
export default {
  watch: {
    scrollable(val) {
      if (!val) {
        this.addScrollEffect()
      } else {
        this.removeScrollEffect()
      }
    }
  },
  methods: {
    addScrollEffect() {
      document.documentElement.style.overflow = 'hidden'
      // document.body.style.height = '100vh'
      // console.log(document.body.offsetHeight)
      // app.style.overflow = 'hidden'
      // app.style.height = '100vh'
      /* 兼容移动端 全屏时禁止 body 的滑动 允许 modal 滑动 */
      this.$el.addEventListener('touchmove', (e) => {
        e.preventDefault()
      }, false)
    },
    removeScrollEffect() {
      // document.body.style.overflow = ''
      // document.body.style.height = ''
      // app.style.overflow = ''
      // app.style.height = ''
    }
  }
}
