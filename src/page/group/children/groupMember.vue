<template>
  <transition name='router-fadeInRight' mode="out-in">
    <div class="group-member">
      <head-top :title='`成员管理`' :append='true'>
        <div slot='append' class="head-top-cancel" @click='cancel'>取消</div>
        <div slot='title' class="head-top-search">
          <v-icon type='base-search' class='head-top-search-icon'></v-icon>
          <input class="head-top-search-input" type="text" v-model='keyword' placeholder="搜索" @input="search">
        </div>
      </head-top>
      <div class="group-member-search" v-if='(keyword.length+searchList.length) > 0'></div>
      <div class="group-member-lists" v-else>
        <div class="group-member-list  admin">
          <p class="group-member-label">圈管理({{ manager.length }})</p>
          <groupMemberItem :user='user' @update='getMember' @on-delete='getMember' :rule='rule' v-for='(user) in manager' :key='user.id' />
        </div>
        <div class="group-member-list member">
          <p class="group-member-label">成员({{ members.length }})</p>
          <groupMemberItem :user='user' @update='getMember' @on-delete='getMember' :rule='rule' v-for='(user) in members' :key='user.id' />
        </div>
        <div class="group-member-list blacklist">
          <p class="group-member-label">黑名单({{ blacklist.length }})</p>
          <groupMemberItem :user='user' @update='getMember' @on-delete='getMember' :rule='rule' v-for='(user) in blacklist' :key='user.id' />
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import _ from 'lodash'
import HeadTop from '@/components/HeadTop'
import groupMemberItem from '../components/groupMemberItem'
const sources = []
export default {
  name: 'groupMember',
  components: {
    HeadTop,
    groupMemberItem
  },
  data() {
    return {
      groupID: this.$route.params.groupID,
      rule: this.$route.params.rule,
      members: [],
      manager: [],
      blacklist: [],
      keyword: '',
      searchList: []
    }
  },
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    // 使用_.debounce控制搜索的触发频率
    // 准备搜索
    search: _.debounce(function () {
      let that = this
        // 删除已经结束的请求
      _.remove(sources, (n) => n.source === null)

        // 取消还未结束的请求
      sources.forEach(function (item) {
        if (item !== null && item.source !== null && item.status === 1) {
          item.status = 0
          item.source.cancel('取消上一个')
        }
      })

        // 创建新的请求cancelToken,并设置状态请求中
      let sc = {
        source: that.$http.CancelToken.source(),
        status: 1 // 状态1：请求中，0:取消中
      }
      sources.push(sc)

        // 开始搜索数据
      if (that.keyword) {
        that.$http.get(`/plus-group/groups/${that.groupID}/members?keyword=${that.keyword}`, {
          cancelToken: sc.source.token
        }).then(({ data = [] }) => {
            // 置空请求canceltoken
          sc.source = null
        }).catch(({ response: { data = { message: '搜索失败' } } = {} } = {}) => {
            // 置空请求canceltoken
          sc.source = null
          that.$Message.error(data)
        })
      }
    },
      500 // 空闲时间间隔设置500ms
    ),
    async getMember() {
      // GET /groups/:group/members
      if (!this.groupID) {
        return false
      }
      const {
        data: members
      } = await this.$http.get(`/plus-group/groups/${this.groupID}/members?type=member`)
      this.members = members ? [...members] : []
      const {
        data: manager
      } = await this.$http.get(`/plus-group/groups/${this.groupID}/members?type=manager`)
      this.manager = manager ? [...manager] : []
      const {
        data: blacklist
      } = await this.$http.get(`/plus-group/groups/${this.groupID}/members?type=blacklist`)
      this.blacklist = blacklist ? [...blacklist] : []
    }
  },
  mounted() {
    if (!this.groupID) {
      this.$router.go(-1)
      this.$Message.error('发生了一些错误')
    }
    this.getMember()
  }
}

</script>
<style lang='less'>
.group-member {
  .head-top-title {
    left: 33% !important;
  }

  &-label {
    padding: 0 20px;
    height: 70px;
    line-height: 70px;
    background-color: #f4f5f5;
    font-size: 26px;
    color: #999;
  }
}

</style>
