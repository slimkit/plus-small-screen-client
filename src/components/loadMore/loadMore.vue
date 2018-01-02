<template>
  <div :class='`${prefixCls}`'>
    <section :class='`${prefixCls}-wrap`' :style="{ 'transform': transform }">
      <div :class='`${prefixCls}-head`' ref='head'>
        <slot name='head'>
          <span>{{ topText }}</span>
        </slot>
      </div>
      <slot></slot>
      <div :class='`${prefixCls}-foot`'>
        <slot name='foot'>
          <span>加载中...</span>
        </slot>
      </div>
    </section>
  </div>
</template>
<script>
const prefixCls = 'v-loadmore'
export default {
  name: 'vLoadmore',
  props: {
    onRefresh: {
      type: Function,
      default: undefined
    },
    onInfinite: {
      type: Function
    },
    topPullText: {
      type: String,
      default: '下拉刷新'
    },
    topDropText: {
      type: String,
      default: '释放更新'
    },
    topLoadingText: {
      type: String,
      default: '加载中...'
    }
  },
  data() {
    return {
      prefixCls,

      topText: '',
      topStatus: '',
      startY: 0,
      currentY: 0,

      direction: '',

      translate: 0,
      startScrollTop: 0,
      scrollEventTarget: null,

      topDropped: false
    }
  },
  computed: {
    maxDistance() {
      return this.$refs.head.offsetHeight * 2
    },
    transform() {
      return this.translate === 0 ? null : 'translate3d(0, ' + this.translate + 'px, 0)'
    }
  },

  watch: {
    topStatus(val) {
      switch (val) {
        case 'pull':
          this.topText = this.topPullText
          break
        case 'drop':
          this.topText = this.topDropText
          break
        case 'loading':
          this.topText = this.topLoadingText
          break
      }
    }
  },

  methods: {
    getScrollEventTarget(element) {
      let currentNode = element
      while (
        currentNode &&
        currentNode.tagName !== 'HTML' &&
        currentNode.tagName !== 'BODY' &&
        currentNode.nodeType === 1
      ) {
        let overflowY = document.defaultView.getComputedStyle(currentNode).overflowY
        if (overflowY === 'scroll' || overflowY === 'auto') {
          return currentNode
        }
        currentNode = currentNode.parentNode
      }
      return window
    },

    getScrollTop(element) {
      if (element === window) {
        return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop)
      } else {
        return element.scrollTop
      }
    },

    checkBottomReached() {
      if (this.scrollEventTarget === window) {
        console.log(1)
        return document.documentElement.scrollTop || document.body.scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight
      } else {
        return this.$el.getBoundingClientRect().bottom <= this.scrollEventTarget.getBoundingClientRect().bottom + 1
      }
    },

    handleTouchStart(e) {
      this.startY = e.targetTouches[0].pageY
      this.startScrollTop = this.getScrollTop(this.scrollEventTarget)
      if (this.topStatus !== 'loading') {
        this.topStatus = 'pull'
        this.topDropped = false
      }
    },

    handleTouchMove(e) {
      if (
        this.startY < this.$el.getBoundingClientRect().top &&
        this.startY > this.$el.getBoundingClientRect().bottom
      ) {
        return
      }
      this.currentY = event.touches[0].clientY
      // let distance = (this.currentY - this.startY) / this.distanceIndex
      let distance = (this.currentY - this.startY)
      this.direction = distance > 0 ? 'down' : 'up'

      if (
        this.direction === 'down' &&
        typeof this.onRefresh === 'function' &&
        this.getScrollTop(this.scrollEventTarget) === 0 &&
        this.topStatus !== 'loading'
      ) {
        event.preventDefault()
        event.stopPropagation()

        if (this.maxDistance > 0) {
          this.translate = distance <= this.maxDistance ? distance - this.startScrollTop : this.translate
        } else {
          this.translate = distance - this.startScrollTop
        }

        if (this.translate < 0) {
          this.translate = 0
        }

        this.topStatus = this.translate >= this.maxDistance / 2 ? 'drop' : 'pull'
      }
      if (
        this.direction === 'up'
      ) {
        console.log(this.checkBottomReached())
      }
    },

    handleTouchEnd(e) {
      if (
        this.direction === 'down' &&
        this.getScrollTop(this.scrollEventTarget) === 0 &&
        this.translate > 0
      ) {
        this.topDropped = true
        if (this.topStatus === 'drop') {
          this.translate = this.maxDistance / 2
          this.topStatus = 'loading'
          this.onRefresh(this.onRefreshed)
        } else {
          this.translate = 0
          this.topStatus = 'pull'
        }
      }
      this.direction = ''
    },

    bindTouchEvents() {
      this.$el.addEventListener('touchstart', this.handleTouchStart)
      this.$el.addEventListener('touchmove', this.handleTouchMove)
      this.$el.addEventListener('touchend', this.handleTouchEnd)
    },

    init() {
      this.topStatus = 'pull'
      this.bottomStatus = 'pull'
      this.topText = this.topPullText
      this.scrollEventTarget = this.getScrollEventTarget(this.$el)
      if (typeof this.onRefresh === 'function') {
        this.bindTouchEvents()
      }
    },

    onRefreshed() {
      this.translate = 0
      this.$nextTick(() => {
        this.topStatus = 'pull'
      })
    }

  },
  mounted() {
    this.init()
  }
}

</script>
<style lang='less' src='./loadMore.less'></style>
