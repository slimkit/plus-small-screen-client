<template>
    <div :class="[prefixCls]">
        <div :class="[`${prefixCls}-wrap`]">
            <div :class="[`${prefixCls}-content`, { 'is-dropped': topDropped || bottomDropped}]" :style="{ 'transform': 'translate3d(0rem, ' + translate/100 + 'rem, 0rem)'}">
                <slot name="top">
                    <div :class="[`${prefixCls}-top`]" v-if="topMethod">
                        <v-icon :class='[`${prefixCls}-spinner`]' :type='topIcon' width='.32rem' height='.32rem' />
                        <span :class="[`${prefixCls}-text`]">{{ topText }}</span>
                    </div>
                </slot>
                <slot></slot>
                <slot name="bottom">
                    <div :class="[`${prefixCls}-bottom`]" v-if="bottomMethod">
                        <template v-if='bottomAllLoaded'>
                            没有更多
                        </template>
                        <template v-else>
                            <v-icon :class='[`${prefixCls}-spinner`]' type='base-loading' width='.32rem' height='.32rem' />
                            <span :class="[`${prefixCls}-text`]">{{ bottomText }}</span>
                        </template>
                    </div>
                </slot>
            </div>
        </div>
    </div>
</template>
<script>
const prefixCls = 'v-load-more'
export default {
  name: 'loadMore',
  props: {
    maxDistance: {
      type: Number,
      default: 0
    },
    autoFill: {
      type: Boolean,
      default: false
    },
    distanceIndex: {
      type: Number,
      default: 2
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
    },
    topDistance: {
      type: Number,
      default: 70
    },
    topMethod: {
      type: Function
    },
    bottomPullText: {
      type: String,
      default: '上拉刷新'
    },
    bottomDropText: {
      type: String,
      default: '释放更新'
    },
    bottomLoadingText: {
      type: String,
      default: '加载中...'
    },
    bottomDistance: {
      type: Number,
      default: 70
    },
    bottomMethod: {
      type: Function
    },
    bottomAllLoaded: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      prefixCls,
      translate: 0,
      scrollEventTarget: null,
      containerFilled: false,
      topText: '',
      topDropped: false,
      bottomText: '',
      bottomDropped: false,
      bottomReached: false,
      direction: '',
      startY: 0,
      startScrollTop: 0,
      currentY: 0,
      topStatus: '',
      bottomStatus: '',
      topIcon: 'base-arrow-u'
    }
  },
  computed: {},
  watch: {
    topStatus (val) {
      this.$emit('top-status-change', val)
      switch (val) {
        case 'pull':
          this.topText = this.topPullText
          break
        case 'drop':
          this.topText = this.topDropText
          this.topIcon = 'base-arrow-d'
          break
        case 'loading':
          this.topText = this.topLoadingText
          this.topIcon = 'base-loading'
          break
      }
    },
    bottomStatus (val) {
      this.$emit('bottom-status-change', val)
      switch (val) {
        case 'pull':
          this.bottomText = this.bottomPullText
          break
        case 'drop':
          this.bottomText = this.bottomDropText
          break
        case 'loading':
          this.bottomText = this.bottomLoadingText
          break
      }
    }
  },
  methods: {
    onTopLoaded () {
      this.translate = 0
      setTimeout(() => {
        this.topStatus = 'pull'
      }, 200)
    },

    onBottomLoaded () {
      this.bottomStatus = 'pull'
      this.bottomDropped = false

      this.$nextTick(() => {
        if (this.scrollEventTarget === window) {
          document.body.scrollTop += 100
        } else {
          this.scrollEventTarget.scrollTop += 100
        }
        this.translate = 0
      })
    },

    getScrollEventTarget (element) {
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

    getScrollTop (element) {
      if (element === window) {
        return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop)
      } else {
        return element.scrollTop
      }
    },

    bindTouchEvents () {
      const el = this.$el
      el.addEventListener('touchstart', (e) => {
        this.handleTouchStart(e)
      })
      el.addEventListener('touchmove', (e) => {
        this.handleTouchMove(e)
      })
      el.addEventListener('touchend', (e) => {
        this.handleTouchEnd(e)
      })
    },
    init () {
      this.topStatus = 'pull'
      this.bottomStatus = 'pull'

      this.topText = this.topPullText

      this.scrollEventTarget = this.getScrollEventTarget(this.$el)
      if (typeof this.bottomMethod === 'function') {
        this.bindTouchEvents()
      }
      if (typeof this.topMethod === 'function') {
        this.bindTouchEvents()
      }
    },
    checkBottomReached () {
      if (this.scrollEventTarget === window) {
        return document.documentElement.scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight
      } else {
        return this.$el.getBoundingClientRect().bottom <= this.scrollEventTarget.getBoundingClientRect().bottom + 1
      }
    },
    handleTouchStart (event) {
      this.startY = event.touches[0].clientY
      this.startScrollTop = this.getScrollTop(this.scrollEventTarget)
      this.bottomReached = false
      if (this.topStatus !== 'loading') {
        this.topStatus = 'pull'
        this.topDropped = false
      }
      if (this.bottomStatus !== 'loading') {
        this.bottomStatus = 'pull'
        this.bottomDropped = false
      }
    },
    handleTouchMove (event) {
      if (this.startY < this.$el.getBoundingClientRect().top && this.startY > this.$el.getBoundingClientRect().bottom) {
        return
      }
      this.currentY = event.touches[0].clientY
      let distance = (this.currentY - this.startY) / this.distanceIndex

      this.direction = distance > 0 ? 'down' : 'up'

      if (
        typeof this.topMethod === 'function' &&
                this.direction === 'down' &&
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

        this.topStatus = this.translate >= this.topDistance ? 'drop' : 'pull'
      }

      if (this.direction === 'up') {
        this.bottomReached = this.bottomReached || this.checkBottomReached()
      }

      if (
        typeof this.bottomMethod === 'function' &&
                this.direction === 'up' &&
                this.bottomReached &&
                this.bottomStatus !== 'loading' &&
                !this.bottomAllLoaded
      ) {
        event.preventDefault()
        event.stopPropagation()

        if (this.maxDistance > 0) {
          this.translate = Math.abs(distance) <= this.maxDistance
            ? this.getScrollTop(this.scrollEventTarget) - this.startScrollTop + distance
            : this.translate
        } else {
          this.translate = this.getScrollTop(this.scrollEventTarget) - this.startScrollTop + distance
        }
        if (this.translate > 0) {
          this.translate = 0
        }
        this.bottomStatus = -this.translate >= this.bottomDistance ? 'drop' : 'pull'
      }
      this.$emit('translate-change', this.translate)
    },
    handleTouchEnd () {
      if (this.direction === 'down' && this.getScrollTop(this.scrollEventTarget) === 0 && this.translate > 0) {
        this.topDropped = true
        if (this.topStatus === 'drop') {
          this.translate = '90'
          this.topStatus = 'loading'
          this.topMethod()
        } else {
          this.translate = '0'
          this.topStatus = 'pull'
        }
      }
      if (this.direction === 'up' && this.bottomReached && this.translate < 0) {
        this.bottomDropped = true
        this.bottomReached = false
        if (this.bottomStatus === 'drop') {
          this.translate = '-90'
          this.bottomStatus = 'loading'
          this.bottomMethod()
        } else {
          this.translate = '0'
          this.bottomStatus = 'pull'
        }
      }
      this.$emit('translate-change', this.translate)
      this.direction = ''
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='less'>
@import url('./loadMore.less');
</style>