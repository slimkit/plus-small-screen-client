<template>
  <div :class="`${prefixCls}`">
    <header 
      slot="head" 
      class="m-box m-justify-bet m-aln-center m-head-top m-pos-f m-main m-bb1">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg 
          class="m-style-svg m-svg-def" 
          @click="goBack">
          <use 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            xlink:href="#base-back"/>
        </svg>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
        <span>系统通知</span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end"/>
    </header>
    <load-more
      ref="loadmore"
      :on-refresh="onRefresh"
      :on-load-more="onLoadMore"
      :class="`${prefixCls}-loadmore`"
      style="padding-top: 0.9rem"
    >
      <section 
        v-for="notification in notifications" 
        :key="notification.id" 
        class="m-box m-aln-st m-main m-bb1 notification-item">
        <h5 class="m-flex-grow1 m-flex-shrink1">{{ notification.data.content }}</h5>
        <p class="m-flex-grow0 m-flex-shrink0">{{ notification.created_at | time2tips }}</p>
      </section>
    </load-more>
  </div>
</template>
<script>
import _ from "lodash";
import { getNotifications } from "@/api/message.js";

const prefixCls = "notification";

export default {
  name: "Notification",
  data() {
    return {
      prefixCls,
      notifications: []
    };
  },

  created() {
    this.$http.put("/user/notifications/all");
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
  }
};
</script>
<style lang="less">
.notification-item {
  padding: 30px;
  h5 {
    color: #333;
    font-size: 30px;
    font-weight: 400;
  }
  p {
    margin-left: 30px;
    color: #999;
    font-size: 24px;
  }
}
</style>
