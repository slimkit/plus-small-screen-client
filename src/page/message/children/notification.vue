<template>
    <div :class="`${prefixCls}`">
        <header slot="head" class="m-box m-justify-bet m-aln-center m-head-top m-pos-f m-main">
            <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
                <svg class='m-style-svg m-svg-def' @click='goBack'>
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
                </svg>
            </div>
            <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
                <span>系统通知</span>
            </div>
            <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end">

            </div>
        </header>
        <load-more
                style="padding-top: 0.9rem"
                :onRefresh='onRefresh'
                :onLoadMore='onLoadMore'
                ref='loadmore'
                :class="`${prefixCls}-loadmore`"
        >
            <section :class="`${prefixCls}-item`" v-for="notification in notifications" :key="notification.id">
                <h5>{{ notification.data.content }}</h5>
                <p>{{ notification.created_at | time2tips }}</p>
            </section>
        </load-more>
    </div>
</template>
<script>
import _ from "lodash";
import { getNotifications } from "@/api/message.js";

const prefixCls = "notification";

export default {
  name: "notification",
  data() {
    return {
      prefixCls,
      notifications: []
    };
  },
  methods: {
    /**
     * 下拉刷新
     * @Author   Wayne
     * @DateTime 2018-02-10
     * @Email    qiaobin@zhiyicx.com
     * @return   {[type]}            [description]
     */
    onRefresh() {
      getNotifications().then(({ data }) => {
        this.$refs.loadmore.topEnd(!(data.length < 15));
        this.notifications = data;
      });
    },
    /**
     * 上拉加载
     * @Author   Wayne
     * @DateTime 2018-02-10
     * @Email    qiaobin@zhiyicx.com
     * @return   {[type]}            [description]
     */
    onLoadMore() {
      const { length: offset = 0 } = this.notifications;
      getNotifications(offset).then(({ data }) => {
        this.$refs.loadmore.bottomEnd(data.length < 15);
        this.notifications = _.unionBy([...this.notifications, ...data]);
      });
    }
  },

  created() {
    this.$http.put("/user/notifications/all");
  }
};
</script>
<style lang="less">
</style>
