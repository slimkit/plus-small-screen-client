<template>
  <div :class="prefixCls">
    <head-top :go-back='cancel' append='true' title='社区签到排行榜'>
      <div slot='append'>
        
      </div>
    </head-top>
    <div :class="`${prefixCls}-list`">
      <div :class="`${prefixCls}-list-item`" v-for="(user, index) in users" :key="user.id">
        <span :class="{ top: index < 3 }" class="rank">{{ index + 1 }}</span>
        <div :class="`${prefixCls}-info`" @click="to(`/user/${user.id}`)">
          <v-avatar :class="`${prefixCls}-user-avatar`" :src='user.avatar' :sex='user.sex'></v-avatar>
          <div :class="`${prefixCls}-title`">
            <h6>{{ user.name }}</h6>
            <p>累计签到：{{ user.extra.checkin_count || 0 }}</p>
          </div>
        </div>
        <template>
            <v-icon :type='`base-${isFollow(user.id)}`' class='find-item-follow-icon' @click.native='followUser(user.id)'></v-icon>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import HeadTop from '../../../components/HeadTop'
  const prefixCls = 'rankItem'
  export default {
    components: {
      HeadTop
    },
    name: 'checkinList',
    props: {

    },
    data() {
      return {
        users: [],
        prefixCls,
        loading: false
      }
    },

    computed: {
  
    },

    methods: {
      isFollow (id) {
        let user = this.$store.getters.getUserById(id)
        const { follower = false, following = false } = user
        return follower && following
          ? 'eachFollow' : (follower ? 'follow' : 'unFollow')
      },
      cancel () {
        this.to('/rank/users')
      },
      to(path) {
        path = typeof path === 'string' ? { path } : path
        if (path) {
          this.$router.push(path)
        }
      },
      followUser (id) {
        if (this.loading) return
        this.loading = true
        let user = this.$store.getters.getUserById(id)
        this.$store.dispatch('FOLLOW_USER', {
          id,
          status: this.isFollow(id)
        }).then(({ status, follower }) => {
          user.follower = follower
          this.$store.commit('SAVE_USER', user)
          this.loading = false
        }).catch((err) => {
          const { response: { data = { message: '操作失败' } } = {} } = err

          this.loading = false
          this.$Message.error(data)
          this.loading = false
        })
      }
    },

    created () {
      this.users = this.$store.getters.getUsersByType('rankCheckin')
    }
  }
</script>

<style lang="less" src="../style.less">
  
</style>
