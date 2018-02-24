<template>
  <div :class="`${prefixCls}`">
    <head-top :go-back='true' title='系统消息'></head-top>
    <div></div>
    <load-more
      :onRefresh='onRefresh'
      :onLoadMore='onLoadMore'
      ref='loadmore'
      :class="`${prefixCls}-loadmore`"
    >
      <section :class="`${prefixCls}-item`" v-for="notification in notifications">
        <h5>{{ notification.data.content }}</h5>
        <p>{{ notification.created_at | time2tips }}</p>
      </section>
    </load-more>
  </div>
</template>
<script>
  import _ from 'lodash';
  const prefixCls = 'notification'

  export default {
    name: 'notification',
    data () {
      return {
        prefixCls,
        notifications: []
      }
    },
    methods: {
      /**
       * 下拉刷新
       * @Author   Wayne
       * @DateTime 2018-02-10
       * @Email    qiaobin@zhiyicx.com
       * @return   {[type]}            [description]
       */
      onRefresh () {
        this.$http.get(
          `/user/notifications`,
          {
            validateStatus: s => s === 200
          }
        )
        .then(({ data }) => {
          this.$refs.loadmore.topEnd(!(data.length < 15));
          this.notifications = _.unionBy([ ...data, ...this.notifications ]);
        })
      },
      /**
       * 上拉加载
       * @Author   Wayne
       * @DateTime 2018-02-10
       * @Email    qiaobin@zhiyicx.com
       * @return   {[type]}            [description]
       */
      onLoadMore () {
        const { length: offset = 0 } = this.notifications;
        this.$http.get(
          `/user/notifications`,
          {
            params: {
              offset
            }
          },
          {
            validateStatus: s => s === 200
          }
        )
        .then(({ data }) => {
          this.$refs.loadmore.bottomEnd(data.length < 15);
          this.notifications = _.unionBy([ ...this.notifications, ...data ]);
        })
      },

      getNotifications () {
        this.$http.get(
          `/user/notifications`,
          {
            validateStatus: s => s === 200
          }
        )
        .then(({ data }) => {
          this.notifications = data;
        })
      }
    },

    computed: {
      unreadNotifications () {
        // 类似
      }
    },

    created () {
      // this.getNotifications();
    }
  }

</script>
<style lang="less">
  
</style>
