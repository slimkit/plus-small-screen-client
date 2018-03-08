<template>
  <div :class="`${prefixCls}`">
    <head-top>
      <div slot='nav' class="head-top-tabs-nav">
        <router-link class='head-top-tabs-nav-item' to="/message/msg">
          <v-badge :dot="has_msg">消息</v-badge>
        </router-link>
        <router-link class='head-top-tabs-nav-item' to="/message/charts">
          <v-badge :dot='notification'>聊天</v-badge>
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
      // 新消息提示
      has_msg: state => ((state.MESSAGE.UNREAD_COUNT.msg.diggs.count +
        state.MESSAGE.UNREAD_COUNT.msg.comments.count +
        state.MESSAGE.UNREAD_COUNT.msg.audits.feedCommentCount +
        state.MESSAGE.UNREAD_COUNT.msg.audits.groupJoinCount +
        state.MESSAGE.UNREAD_COUNT.msg.audits.groupPostCommentCount +
        state.MESSAGE.UNREAD_COUNT.msg.audits.groupPostCount +
        state.MESSAGE.UNREAD_COUNT.msg.audits.newsCommentCount
      ) > 0),
      notification: state => state.MESSAGE.UNREAD_COUNT.notification
    })
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