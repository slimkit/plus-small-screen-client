<template>
  <div
    :class="`${prefix}`"

    style="transform:translate(0,0)"
    @mousedown="startDrag"

    @touchstart="startDrag"
    @mousemove.stop="onDrag"

    @touchmove.stop="onDrag"
    @mouseup="stopDrag"
    @touchend="stopDrag"
    @mouseleave="stopDrag" >
    <!-- 顶部 -->
    <div
      ref="head"
      :class="`${prefix}-head ${prefix}-head-box`"
      :style="{transform: `translateY(${ tY - topBarHeight }px)`, transitionDuration}">
      <slot name="head">
        <div
          v-if="refreshing"
          :class="`${prefix}-loading ${prefix}-icon`">
          <span/>
          <span/>
          <span/>
          <span/>
          <span/>
          <span/>
          <span/>
          <span/>
          <span/>
          <span/>
          <span/>
          <span/>
        </div>
        <i
          v-else
          :class="`${prefix}-icon`"
          :style="{ transform: `rotate(${topStatus ? '180deg' : '0'})` }">↓</i>
        <span>{{ topTxt }}</span>
      </slot>
    </div>
    <!-- 内容 -->
    <div
      :class="`${prefix}-main`"
      :style="{transform: `translateY(${tY}px)`, transitionDuration }">
      <slot/>
      <!-- 底部 -->
      <div
        v-if="bottomStatus > 0 && showBottom"
        :class="`${prefix}-foot status-${bottomStatus}`"
        @click="beforeLoadMore">
        <slot name="foot">
          <div
            v-if="bottomStatus === 1"
            :class="`${prefix}-loading ${prefix}-icon`">
            <span/>
            <span/>
            <span/>
            <span/>
            <span/>
            <span/>
            <span/>
            <span/>
            <span/>
            <span/>
            <span/>
            <span/>
          </div>
          <span>{{ bottomTxt }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
const prefix = "jo-loadmore";
/**
 * 获取页面可滚动的节点 <是否产生垂直方向的滚动条>
 * @author jsonleex <jsonlseex@163.com>
 * @param  {Object -> Node} el
 * @return {Object -> Node}
 */
function getScrollTarget(el) {
  while (
    el &&
    el.nodeType === 1 &&
    el.tagName !== "HTML" &&
    el.tagName !== "BODY"
  ) {
    const overflowY = document.defaultView.getComputedStyle(el).overflowY;
    if (overflowY === "scroll" || overflowY === "auto") {
      return el;
    }
    el = el.parentNode;
  }
  return document.documentElement;
}
export default {
  name: "JoLoadMore",
  props: {
    topDistance: {
      type: Number,
      default: 0
    },
    noAnimation: {
      type: Boolean,
      default: false
    },
    autoLoad: {
      type: Boolean,
      default: true
    },
    showBottom: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      prefix,
      // 用于计算 scrollTop 的节点
      scrollTarget: null,

      dY: 0,
      startY: 0,
      pulling: false,
      dragging: false,

      noMore: false,
      loading: false,
      refreshing: false,

      topBarHeight: 0,

      isTop: true,
      topTxt: "下拉刷新",
      bottomTxt: "点击加载更多"
    };
  },
  computed: {
    maxDistance() {
      return this.topDistance > 0 ? this.topDistance : this.topBarHeight * 1.5;
    },
    tY() {
      return this.noAnimation ? 0 : 80 * Math.atan(this.dY / 200);
    },
    transitionDuration() {
      return this.pulling ? "0s" : "200ms";
    },
    topStatus() {
      return this.refreshing ? 2 : this.tY > this.maxDistance ? 1 : 0;
    },
    bottomStatus() {
      return this.refreshing ? 0 : this.loading ? 1 : this.noMore ? 2 : 3;
    }
  },
  watch: {
    topStatus(val) {
      this.topTxt = ["下拉刷新", "释放更新", "正在刷新"][val];
    },
    bottomStatus(val) {
      this.bottomTxt = ["", "加载中...", "--没有更多--", "点击加载更多"][val];
    }
  },
  mounted() {
    this.scrollTarget = getScrollTarget(this.$el);
    this.topBarHeight = this.$refs.head.clientHeight;
    if (this.autoLoad && !this.isFulled()) {
      this.beforeRefresh();
    }
  },
  methods: {
    // Touch start
    startDrag(e) {
      e = e.changedTouches ? e.changedTouches[0] : e;
      // 加载中 || 刷新中 || 不在顶部 禁止 pull
      if (this.loading || this.refreshing || this.scrollTarget.scrollTop > 0)
        return;
      this.topBarHeight = this.$refs.head.clientHeight;
      this.$emit("onPullStart");
      this.dragging = true;
      this.startY = e.pageY;
    },
    // Move
    onDrag(e) {
      const $e = e.changedTouches ? e.changedTouches[0] : e;
      // move 的距离
      const offsetY = $e.pageY - this.startY;
      // 是否为下拉操作
      const isPull = offsetY > 0;

      if (this.dragging && isPull && window.scrollY <= 0) {
        // 阻止 原生滚动 事件
        e.preventDefault();

        this.dY = offsetY;
        this.pulling = true;
        this.$emit("onPull", this.dY);
      }
    },
    // Touch end
    stopDrag() {
      this.dragging = false;
      this.pulling = false;

      this.$emit("onPullEnd");

      this.tY > this.maxDistance && window.scrollY <= 0
        ? this.beforeRefresh()
        : (this.dY = 0);
    },
    beforeRefresh() {
      this.dY = Math.tan(this.topBarHeight / 80) * 200;

      if (this.refreshing) return;

      this.noMore = false;
      this.refreshing = true;

      this.$emit("onRefresh", (noMore = false) => {
        this.afterRefresh(noMore);
      });
    },
    afterRefresh(noMore) {
      this.dY = 0;
      this.noMore = noMore;
      this.refreshing = false;
      this.$emit("afterRefresh");

      this.$nextTick(() => {
        noMore ||
          (this.showBottom &&
            this.autoLoad &&
            !this.isFulled() &&
            this.beforeLoadMore());
      });
    },
    beforeLoadMore() {
      if (this.loading || this.refreshing || this.noMore) return;
      this.loading = true;
      this.$emit("onLoadMore", (noMore = false) => {
        this.afterLoadMore(noMore);
      });
    },
    afterLoadMore(noMore) {
      this.noMore = noMore;
      this.loading = false;
      this.$emit("afterLoadMore");

      this.$nextTick(() => {
        noMore || (this.autoLoad && !this.isFulled() && this.beforeLoadMore());
      });
    },
    isFulled() {
      return (
        this.$el.getBoundingClientRect().bottom >=
        this.scrollTarget.clientHeight
      );
    }
  }
};
</script>
<style lang="less">
@prefix: jo-loadmore;
.@{prefix} {
  position: relative;
  &-head,
  &-foot {
    width: 100%;
  }
  &-head {
    position: fixed;
    top: 0;
    z-index: 0;

    &-box {
      height: 45px; /*no*/
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7c7c7c;
      font-size: 0.28rem;
      > span {
        vertical-align: middle;
        margin-left: 0.2rem;
      }
      i {
        font-style: normal;
        transition: all 0.3s ease;
      }
    }
  }
  &-foot {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.status-2 {
      color: #ccc;
    }
  }
  &-main {
    background-color: inherit;
  }
  &-loading {
    position: relative;
    display: table;
    width: 44px;
    height: 44px;
    overflow: hidden;
    span {
      animation: loading-fade-dark 1.1s infinite linear;
      position: absolute;
      left: 50%;
      bottom: 4px;
      margin-left: -1px;
      width: 2px;
      height: 8px;
      border-radius: 2px; /* no */
      transform-origin: center -8px;
      &:nth-child(1) {
        animation-delay: 0s;
        transform: rotate(0);
      }
      &:nth-child(2) {
        animation-delay: 0.1s;
        transform: rotate(30deg);
      }
      &:nth-child(3) {
        animation-delay: 0.2s;
        transform: rotate(60deg);
      }
      &:nth-child(4) {
        animation-delay: 0.3s;
        transform: rotate(90deg);
      }
      &:nth-child(5) {
        animation-delay: 0.4s;
        transform: rotate(120deg);
      }
      &:nth-child(6) {
        animation-delay: 0.5s;
        transform: rotate(150deg);
      }
      &:nth-child(7) {
        animation-delay: 0.6s;
        transform: rotate(180deg);
      }
      &:nth-child(8) {
        animation-delay: 0.7s;
        transform: rotate(210deg);
      }
      &:nth-child(9) {
        animation-delay: 0.8s;
        transform: rotate(240deg);
      }
      &:nth-child(10) {
        animation-delay: 0.9s;
        transform: rotate(270deg);
      }
      &:nth-child(11) {
        animation-delay: 1s;
        transform: rotate(300deg);
      }
      &:nth-child(12) {
        animation-delay: 1.1s;
        transform: rotate(330deg);
      }
    }
  }
}
@keyframes loading-fade-dark {
  0% {
    background-color: #5c5c5c;
  }
  100% {
    background-color: rgba(255, 255, 255, 0);
  }
}
</style>
