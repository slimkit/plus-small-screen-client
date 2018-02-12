<template>
  <div :class="`${prefixCls}`">
    <head-top>
      <div slot='nav' class="head-top-tabs-nav">
        <router-link class='head-top-tabs-nav-item' to="/message/msg">
          <v-badge :dot="has_msg">消息</v-badge>
        </router-link>
        <router-link class='head-top-tabs-nav-item' to="/message/notification">
          <v-badge :dot='notification'>通知</v-badge>
        </router-link>
      </div>
    </head-top>
    <router-view></router-view>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import HeadTop from '../../components/HeadTop'
import FootGuide from '../../components/FootGuide'
import { mapState } from 'vuex'
const prefixCls = 'message'
export default {
  name: 'messageIndex',
  data () {
    return {
      prefixCls
    }
  },
  computed: {
    ...mapState({
      msg: state => state.MESSAGE.UNREAD_COUNT.msg,
      notification: state => state.MESSAGE.UNREAD_COUNT.notification
    }),

    // 新消息提示
    has_msg () {
      return (this.msg.audits.count + this.msg.comments.count + this.msg.diggs.count) > 0
    }
  },
  methods: {
  },
  // 挂载完成后,请求新的消息
  beforeMount () {
    this.$store.dispatch('GET_UNREAD_COUNT')
  },
  components: {
    HeadTop,
    FootGuide
  }
}
</script>
<style lang="less" src="./style.less"></style>