<template>
  <div :class="prefixCls">
    <head-top :go-back='cancel' append='true' :title='`${title}资讯排行榜`'>
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
            <p>阅读量：{{ user.extra.count || 0 }}</p>
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
  const prefixCls = 'rankNewsRank'
  const api = '/news/ranks'
  const config = {
    week: {
      vuex: 'rankNewsWeek',
      title: '本周',
      query: 'week'
    },
    today: {
      vuex: 'rankNewsToday',
      'title': '今日',
      query: 'day'
    },
    month: {
      vuex: 'rankNewsMonth',
      title: '本月',
      query: 'month'
    }
  }

  export default {
    components: {
      HeadTop
    },
    name: 'newsList',
    props: {

    },
    data() {
      return {
        users: [],
        prefixCls,
        loading: false,
        title: '', // 标题
        vuex: '', // vuex主键
        query: '' // api查询query
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
        this.to('/rank/news')
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
      },

      getUsers () {
        this.$http.get(
          api,
          {
            params: {
              type: this.query
            }
          },
          {
            validateStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          console.log(data)
        })
      }
    },

    created () {
      let time = this.$route.params.time || 'today'
      this.title = config[time].title
      this.vuex = config[time].vuex
      this.query = config[time].query
      this.users = this.$store.getters.getUsersByType(this.vuex)
      this.getUsers()
    }
  }
</script>

<style lang="less">
  @prefixCls: rankNewsRank;

  .@{prefixCls} {
    &-info {
      width: 90%;
      display: inline-flex;
    }
    &-user-avatar {
      width: 76px;
      height: 76px;
    }
    &-title {
      margin-left: 30px;
      h6 {
        font-size: 30px;
        color: #333;
      }
      p {
        color: #999;
        font-size: 28px;
      }
    }
    &-list {
      padding: 90px 0 0;
      &-item {
        display: flex;
        align-items: center;
        height: 135px;
        padding: 0 29px;
        background: #fff;
        border-bottom: 1px solid #ededed;
        justify-content: space-between;
        .rank {
          &.top {
            color: #59b6d7;
          }
          width: 15%;
          display: inline-flex;
          font-size: 34px;
          color: #999;
        }
      }
    }
  }
</style>