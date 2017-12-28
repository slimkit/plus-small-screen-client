<template>
  <div class="user-home">
    <head-top :go-back='goBack' :append='true' :title='user.name' :transparent='topTranparent'>
      <div class="user-home-share" slot='append'>
        <v-icon type='base-share'></v-icon>
      </div>
    </head-top>
    <!-- user info  -->
    <div class="user-home-info">
      <div class="user-home-info-box">
        <div class="user-home-bgcover" :style='bg_cover'>
          <v-avatar sex='user.sex' :badeg='verified.icon' :src='user.avatar' class='user-home-avatar' size='large'></v-avatar>
          <h2 class='user-home-name'>{{ user.name }}</h2>
          <div class="user-home-number">
            <p>粉丝数
              <span>{{ followers_count }}</span>
            </p>
            <p>关注
              <span>{{ followings_count }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="user-home-info-box txt">
        <p class="user-home-verified" v-if='verified'>认证:
          <span>{{ verified.description }}</span>
        </p>
        <p class="user-home-location" v-if='location'>地址:
          <span>{{ location }}</span>
        </p>
        <p class="user-home-bio" v-if='bio'>简介:
          <span>{{ bio }}</span>
        </p>
        <div class="user-home-tag">
          <div class="user-home-tag-item" v-for='tag in tags' v-if='tag.id' :key='`user-tag-${tag.id}`'>
            {{ tag.name }}
          </div>
        </div>
      </div>
    </div>
    <!-- user info END -->
    <!-- user feeds -->
    <div class="user-home-feeds">
      <div class="user-home-feeds-label">
        <span>{{ feeds_length }}个动态</span>
        <div class="user-home-feeds-filter-wrap">
          <div class="user-home-feeds-filter" @click='showFilter'>
            <span>{{ filterType.label }}</span>
            <v-icon type='base-filter-list'></v-icon>
          </div>
          <div class="user-home-feeds-filter-select" v-show='filterShow' @click='showFilter'>
            <div class="user-home-feeds-filter-option" :class='{active: option.type === filterType.type}' v-for='option in filterTypes' @click='selectFilterType(option)'>
              <span>{{ option.label }}</span>
              <v-icon type='base-checked'></v-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="user-home-feeds-list">
        <feed-item :isPay='!!(feed.paid_node)' v-for='feed in feeds' :no_user='true' v-if='feed.id' :key='`user-feed-${feed.id}`' :feed='feed'></feed-item>
      </div>
    </div>
    <!-- user feeds END -->
    <!-- user action -->
    <!-- user action -->
  </div>
</template>
<script>
import { formatNum } from '@/util/'
import HeadTop from '@/components/HeadTop'
import { FeedItem } from '@/components/feed/feedItem'
const filterTypes = [{
  type: '',
  label: '全部动态'
}, {
  type: 'paid',
  label: '付费动态'
}, {
  type: 'pinned',
  label: '置顶动态'
}]
export default {
  name: 'userHome',
  components: {
    HeadTop,
    FeedItem
  },
  data() {
    return {
      user: {
        tags: [],
        feeds: [],
        ...this.$store.getters.getUserById(this.$route.params.Uid)
      },
      filterTypes,
      scrollTop: 0,
      filterShow: false,
      filterType: filterTypes[0]
    }
  },
  computed: {
    Uid() {
      return this.$route.params.Uid
    },
    followers_count() {
      return formatNum((this.user.extra || {}).followers_count || 0)
    },
    followings_count() {
      return formatNum((this.user.extra || {}).followings_count || 0)
    },
    bg_cover() {
      const bg = this.user.bg
      return bg ? {
        'background-image': `url(${bg})`
      } : {}
    },
    verified() {
      const verified = this.user.verified
      const { description, icon } = verified || {}
      return verified ? {
        description,
        icon
      } : false
    },
    location() {
      return this.user.location || false
    },
    bio() {
      return this.user.bio || '这家伙很懒. 什么也没留下'
    },
    feeds_length() {
      return (this.user.extra || {}).feeds_count || 0
    },
    tags() {
      return this.user.tags
    },
    feeds() {
      return this.user.feeds
    },

    topTranparent() {
      return !(this.scrollTop > 110)
    }
  },
  watch: {
    filterType() {
      this.getUserFeeds()
    }
  },
  methods: {
    /**
     * 触发一个刷新 同步用户数据
     *     同时更新 vuex 中的数据
     * @author jsonleex <jsonlseex@163.com>
     */
    updateUserData(cb) {
      this.$http.get(`/users/${this.Uid}`).then(({ data = {} }) => {
        this.user = Object.assign({}, this.user, data)
        cb && cb()
      }).catch(err => {
        const { response: { data = { message: '获取用户数据失败' } } = {} } = err
        this.$Message.error(data)
      })
    },

    getUserTags(cb) {
      this.$http.get(`/users/${this.Uid}/tags`).then(({ data = [] }) => {
        this.user.tags = [...data]
        cb && cb()
      })
    },

    getUserFeeds(cb) {
      const params = { type: 'users', user: this.Uid }
      if (this.filterType.type) {
        params.screen = this.filterType.type
      }
      this.$http.get('/feeds', {
        params
      }).then(({ data = [] } = {}) => {
        this.user = Object.assign({}, this.user, { feeds: data['feeds'] })
        cb && cb()
      })
    },

    init() {
      this.updateUserData(this.getUserFeeds(this.getUserTags(() => {
        this.$store.commit('SAVE_USER', this.user)
      })))
    },

    goBack() {
      this.$router.go(-1)
    },

    selectFilterType(type) {
      this.filterType = type
    },

    showFilter() {
      this.filterShow = !this.filterShow
    }
  },
  activated() {
    if (this.user.id !== this.Uid) {
      this.init()
      // this.$route.meta.toTop = true
    }
  },
  mounted() {
    this.init()
    this.$el.addEventListener('scroll', (e) => {
      this.scrollTop = this.$el.scrollTop
    })
  }
}

</script>
<style lang='less'>
@user-home-prefix: user-home;
.@{user-home-prefix} {
  height: 100vh;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  &-info {
    padding-top: 0 !important;
  }
  &-info-box.txt {
    background-color: #fff;
    padding: 30px 20px;
    p {
      font-size: 26px;
      color: #999;
      margin-bottom: 18px;
      &.@{user-home-prefix}-verified {
        color: #ff9400;
      }
      span {
        margin-left: 5px;
        /*no*/
      }
    }
  }
  &-bgcover {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 375px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('../../images/user_home_default_cover.png');
  }

  &-avatar {
    margin-bottom: 15px;
  }

  &-name {
    font-size: 32px;
    color: #fff;
    margin-bottom: 20px;
  }

  &-number {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    font-size: 20px;
    color: #fff;
    p+p {
      margin-left: 50px;
    }
    span {
      margin-left: 12px;
    }
  }
  &-tag {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-bottom: -10px;
    &-item {
      padding: 0 15px;
      height: 36px;
      line-height: 36px;
      font-size: 20px;
      color: #666;
      text-align: center;
      border-radius: 18px;
      background-color: rgba(102, 102, 102, .1);
      margin-bottom: 10px;
      margin-left: 10px;
    }
  }
  &-feeds {
    &-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 70px;
      background-color: #f4f5f5;
      font-size: 26px;
      color: #999;
    }

    &-filter {
      &-wrap {
        height: 100%;
        position: relative;
        z-index: 10;
        line-height: 70px;
      }
      &-select {
        position: absolute;
        bottom: 0;
        right: 0;
        background-color: #fff;
        transform: translateY(100%);
        border-radius: 8px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, .1);
      }
      &-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        width: 200px;
        height: 150/2px;
        &+& {
          border-top: 1px solid #ededed;
        }
        .v-icon {
          visibility: hidden;
          width: 20px;
          height: 20px;
        }
        &.active {
          color: #666;
          .v-icon {
            visibility: visible;
          }
        }
      }
      display: flex;
      align-items: center;
      .v-icon {
        margin-left: 15px;
        width: 36px;
        height: 30px;
      }
    }
  }
}

</style>
