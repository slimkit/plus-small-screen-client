<template>
  <div :class='`${prefixCls}`'>
    <section :class='[`${prefixCls}-wrap`, { "dropped": topDropped || bottomDropped}]' :style="{ 'transform': transform }">
      <div :class='`${prefixCls}-head`' ref='head'>
        <slot name='head'>
          <span>{{ topText }}</span>
        </slot>
      </div>
      <slot></slot>
      <div :class='`${prefixCls}-foot`'>
        <slot name='foot'>
          <span>{{ bottomText }}</span>
        </slot>
      </div>
    </section>
  </div>
</template>
<script>
const prefixCls = "v-loadmore";
export default {
  name: "vLoadmore",
  props: {
    onRefresh: {
      type: Function,
      default: undefined
    },
    bottomMethod: {
      type: Function
    },
    topPullText: {
      type: String,
      default: "下拉刷新"
    },
    topDropText: {
      type: String,
      default: "释放更新"
    },
    topLoadingText: {
      type: String,
      default: "加载中..."
    },

    bottomPullText: {
      type: String,
      default: "上拉加载更多"
    },
    bottomDropText: {
      type: String,
      default: "释放加载"
    },
    bottomLoadingText: {
      type: String,
      default: "加载中..."
    },
    noMore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls,

      topText: "",
      topStatus: "",
      bottomText: "",
      bottomStatus: "",

      startY: 0,
      currentY: 0,

      direction: "",

      translate: 0,
      startScrollTop: 0,
      scrollEventTarget: null,

      topDropped: false,
      bottomDropped: false,
      bottomReached: false
    };
  },
  computed: {
    maxDistance() {
      return this.$refs.head.offsetHeight * 2;
    },
    transform() {
      return this.translate === 0
        ? null
        : "translate3d(0, " + this.translate + "px, 0)";
    }
  },

  watch: {
    topStatus(val) {
      switch (val) {
        case "pull":
          this.topText = this.topPullText;
          break;
        case "drop":
          this.topText = this.topDropText;
          break;
        case "loading":
          this.topText = this.topLoadingText;
          break;
      }
    },

    bottomStatus(val) {
      switch (val) {
        case "pull":
          this.bottomText = this.bottomPullText;
          break;
        case "drop":
          this.bottomText = this.bottomDropText;
          break;
        case "loading":
          this.bottomText = this.bottomLoadingText;
          break;
      }
      this.bottomText = this.noMore ? "没有更多" : this.bottomText;
    }
  },

  methods: {
    getScrollEventTarget(element) {
      let currentNode = element;
      while (
        currentNode &&
        currentNode.tagName !== "HTML" &&
        currentNode.tagName !== "BODY" &&
        currentNode.nodeType === 1
      ) {
        let overflowY = document.defaultView.getComputedStyle(currentNode)
          .overflowY;
        if (overflowY === "scroll" || overflowY === "auto") {
          return currentNode;
        }
        currentNode = currentNode.parentNode;
      }
      return window;
    },

    getScrollTop(element) {
      if (element === window) {
        return Math.max(
          window.pageYOffset || 0,
          document.documentElement.scrollTop
        );
      } else {
        return element.scrollTop;
      }
    },

    checkBottomReached() {
      if (this.scrollEventTarget === window) {
        return (
          (document.documentElement.scrollTop || document.body.scrollTop) +
            document.documentElement.clientHeight >=
          document.body.scrollHeight
        );
      } else {
        return (
          this.$el.getBoundingClientRect().bottom <=
          this.scrollEventTarget.getBoundingClientRect().bottom + 1
        );
      }
    },

    handleTouchStart(/*e*/) {
      this.startY = event.touches[0].clientY;
      this.startScrollTop = this.getScrollTop(this.scrollEventTarget);
      this.bottomReached = false;
      if (this.topStatus !== "loading") {
        this.topStatus = "pull";
        this.topDropped = false;
      }
    },

    handleTouchMove() {
      if (
        this.startY < this.$el.getBoundingClientRect().top &&
        this.startY > this.$el.getBoundingClientRect().bottom
      ) {
        return;
      }
      this.currentY = event.touches[0].clientY;
      let distance = this.currentY - this.startY;
      if (distance > this.maxDistance / 2) {
        this.direction = "down";
      } else if (distance < -this.maxDistance / 2) {
        this.direction = "up";
      }
      if (
        this.direction === "down" &&
        typeof this.onRefresh === "function" &&
        this.getScrollTop(this.scrollEventTarget) === 0 &&
        this.topStatus !== "loading"
      ) {
        event.preventDefault();
        event.stopPropagation();

        if (this.maxDistance > 0) {
          this.translate =
            distance <= this.maxDistance
              ? distance - this.startScrollTop
              : this.translate;
        } else {
          this.translate = distance - this.startScrollTop;
        }

        if (this.translate < 0) {
          this.translate = 0;
        }

        this.topStatus =
          this.translate >= this.maxDistance * 2 / 3 ? "drop" : "pull";
      }

      // if (this.direction === 'up') {
      //   this.bottomReached = this.bottomReached || this.checkBottomReached()
      // }

      // if (
      //   typeof this.bottomMethod === 'function' &&
      //   this.direction === 'up' &&
      //   this.bottomReached &&
      //   this.bottomStatus !== 'loading' &&
      //   !this.noMore
      // ) {
      //   event.preventDefault()
      //   event.stopPropagation()
      //   if (this.maxDistance > 0) {
      //     this.translate = Math.abs(distance) <= this.maxDistance ? this.getScrollTop(this.scrollEventTarget) - this.startScrollTop + distance : this.translate
      //   } else {
      //     this.translate = this.getScrollTop(this.scrollEventTarget) - this.startScrollTop + distance
      //   }
      //   if (this.translate > 0) {
      //     this.translate = 0
      //   }
      //   this.bottomStatus = -this.translate >= this.maxDistance / 2 ? 'drop' : 'pull'
      // }

      this.$emit("translate-change", this.translate);
    },

    handleTouchEnd() {
      if (
        this.direction === "down" &&
        this.getScrollTop(this.scrollEventTarget) === 0 &&
        this.translate > 0
      ) {
        this.topDropped = true;
        if (this.topStatus === "drop") {
          this.translate = this.maxDistance / 2;
          this.topStatus = "loading";
          this.onRefresh(this.onRefreshed);
        } else {
          this.translate = 0;
          this.topStatus = "pull";
        }
      }
      if (this.direction === "up" && this.bottomReached && this.translate < 0) {
        this.bottomDropped = true;
        this.bottomReached = false;
        if (this.bottomStatus === "drop") {
          this.translate = -this.maxDistance / 2;
          this.bottomStatus = "loading";
          this.bottomMethod(this.onRefreshed);
        } else {
          this.translate = "0";
          this.bottomStatus = "pull";
        }
      }
      this.direction = "";
    },

    bindTouchEvents() {
      this.$el.addEventListener("touchstart", this.handleTouchStart);
      this.$el.addEventListener("touchmove", this.handleTouchMove);
      this.$el.addEventListener("touchend", this.handleTouchEnd);
    },

    init() {
      this.topStatus = "pull";
      this.bottomStatus = "pull";
      this.topText = this.topPullText;
      this.scrollEventTarget = this.getScrollEventTarget(this.$el);
      if (typeof this.onRefresh === "function") {
        this.bindTouchEvents();
      }
    },

    onRefreshed() {
      this.translate = 0;
      this.$nextTick(() => {
        this.topStatus = "pull";
      });
    },

    onBottomLoaded() {
      this.bottomStatus = "pull";
      this.bottomDropped = false;
      this.$nextTick(() => {
        if (this.scrollEventTarget === window) {
          document.body.scrollTop += this.maxDistance / 2;
        } else {
          this.scrollEventTarget.scrollTop += this.maxDistance / 2;
        }
        this.translate = 0;
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang='less' src='./loadMore.less'>
</style>
