<template>
  <div>
    <head-top>
      <div slot='nav' class="head-top-nav">
        <router-link class='head-top-nav-item' to="/feed/new">最新</router-link>
        <router-link class='head-top-nav-item' to="/feed/hot">热门</router-link>
        <router-link class='head-top-nav-item' to="/feed/follow">关注</router-link>
      </div>
    </head-top>
    <div v-load-more="loaderMore" type="2">
      <feed-item v-for='feed in feeds' channel='feed' :feed='feed' :key='`feed-${feed_type}-${feed.id}`'></feed-item>
      <div class="load-more--bottom" v-if='showLoading'>加载中...</div>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import { FeedItem } from '@/components/feed/feedItem'
import { oneOf } from '../../util/'
import HeadTop from '../../components/HeadTop'
import FootGuide from '../../components/FootGuide'

/* 有效类型 */
const types = ['new', 'hot', 'follow']

export default {
  name: 'feedIndex',
  components: {
    HeadTop,
    FeedItem,
    FootGuide
  },
  data() {
    return {
      feed_type: this.$route.params.type,

      ad: [], // 广告
      feeds: [], // 动态
      pinned: [], // 置顶

      maxId: 0,

      preventRepeatReuqest: false, // 到达底部加载数据，防止重复加载
      showBackStatus: false, // 显示返回顶部按钮
      showLoading: true, // 显示加载动画
      touchend: false // 没有更多数据
    }
  },
  watch: {
    $route({ params: { type } }) {
      /* 判断路由是否变化 */
      if (oneOf(type, types) && type !== this.feed_type) {}
    }
  },
  methods: {

    // 到达底部加载更多数据
    async loaderMore() {
      if (this.touchend) {
        return
      }
      // 防止重复请求
      if (this.preventRepeatReuqest) {
        return
      }
      this.showLoading = true
      this.preventRepeatReuqest = true

      const params = {
        type: this.feed_type,
        limit: 15,
        after: this.maxId
      }

      const {
        data: {
          ad,
          feeds,
          pinned
        } = {}
      } = await this.$http.get('/feeds', { params })
      this.ad = ad ? [...this.ad, ...ad] : this.ad
      this.feeds = feeds ? [...this.feeds, ...feeds] : this.feeds
      this.pinned = pinned ? [...this.pinned, ...pinned] : this.pinned
      this.maxId = feeds.length ? feeds[feeds.length - 1].id : this.maxId
      this.showLoading = false
      // 当获取数据小于20，说明没有更多数据，不需要再次请求数据
      if (feeds.length < 15) {
        this.touchend = true
        return false
      }
      this.preventRepeatReuqest = false
    },

    async initData() {
      const {
        data: {
          ad,
          feeds,
          pinned
        } = {}
      } = await this.$http.get('/feeds', {
        params: {
          type: this.feed_type,
          limit: 15
        }
      })

      this.ad = ad ? [...ad] : []
      this.feeds = feeds ? [...feeds] : []
      this.pinned = pinned ? [...pinned] : []
      this.maxId = feeds.length ? feeds[feeds.length - 1].id : 0

      this.showLoading = false
      if (feeds.length < 15) {
        this.touchend = true
      }
    }
  },
  /**
   * 组件内 路由守卫
   *     确保 feed_type 为有效值
   *         @author jsonleex <jsonleex@163.com>
   */
  beforeRouteEnter({ path, params: { type } }, from, next) {
    types.indexOf(type) > -1 ? next() : next({ path: '/feed/new' })
  },
  created() {
    this.initData()
  },
  mounted() {},
  beforeDestroy() {
    this.$store.commit('SAVE_FEED_TYPE', '')
  }
}

</script>
<style lang="less">
  .load-more--bottom{
    height: 90px;
    line-height: 90px;
    text-align: center;
    font-size: 32px;
  }
</style>
