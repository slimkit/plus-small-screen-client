<template>
  <div :class="`${prefixCls}`">
    <ul class="entry__group padding">
      <router-link v-for="item in system" tag='li' class="entry__item" :key="item.url" :to='item.url'>
        <div :style="`background-color: ${item.bgColor}; border-radius: 100%`">
          <svg class='entry__item--prepend'>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="`#${item.icon}`"></use>
          </svg>
        </div>
        <div :class="`${prefixCls}-users`">
          <h5>{{ item.title }}</h5>
          <p>{{ computedGetter(item.placeholder) }}</p>
        </div>
        <div :class="`${prefixCls}-time`">
          <h5 v-if="computedGetter(item.time) !== '' && item.time">{{ (computedGetter(item.time)) || '' | time2tips }}</h5>
          <h5 v-else></h5>
          <span :class="`${prefixCls}-time-count`" v-if="computedGetter(item.count) !== 0">{{ computedGetter(item.count) }}</span>
        </div>
      </router-link>
    </ul>
  </div>
</template>
<script>
import { mapState } from "vuex";
const prefixCls = "msg";

export default {
  name: "msg",
  data() {
    return {
      prefixCls,
      system: {
        system: {
          title: "系统消息",
          placeholder: "sPlaceholder",
          icon: "message-likes",
          hanBadge: 0,
          url: "/message/notification",
          bgColor: "#59b6d7",
          count: "sCount",
          time: "sTime"
        },
        comments: {
          title: "评论的",
          placeholder: "cPlaceholder",
          icon: "message-comments",
          hanBadge: 0,
          url: "/message/comments",
          bgColor: "#59b6d7",
          count: "cCount",
          time: "cTime"
        },
        diggs: {
          title: "赞过的",
          placeholder: "dPlaceholder",
          icon: "message-likes",
          hanBadge: 0,
          url: "/message/likes",
          bgColor: "#fe8f90",
          count: "dCount",
          time: "dTime"
        },
        audits: {
          title: "审核",
          placeholder: "aPlaceholder",
          icon: "msg-error",
          hanBadge: 0,
          url: "/message/audits/feedcomments",
          bgColor: "#fbb12a",
          count: "aCount"
        }
      }
    };
  },
  methods: {
    computedGetter(key) {
      return this[key];
    }
  },

  computed: {
    ...mapState({
      msg: state => state.MESSAGE.UNREAD_COUNT.msg,
      notification: state => state.MESSAGE.UNREAD_COUNT.notification
    }),

    // 新消息提示
    has_msg() {
      return (
        this.msg.audits.count + this.msg.comments.count + this.msg.diggs.count >
        0
      );
    },
    cPlaceholder() {
      return this.msg.comments.placeholder;
    },
    dPlaceholder() {
      return this.msg.diggs.placeholder;
    },
    aPlaceholder() {
      return this.msg.audits.placeholder;
    },
    sPlaceholder() {
      return "系统通知";
    },
    cTime() {
      return this.msg.comments.time;
    },
    dTime() {
      return this.msg.diggs.time;
    },
    sTime() {
      return "";
    },
    cCount() {
      return this.msg.comments.count;
    },
    dCount() {
      return this.msg.diggs.count;
    },
    aCount() {
      return (
        this.msg.audits.feedCommentCount +
        this.msg.audits.groupJoinCount +
        this.msg.audits.groupPostCommentCount +
        this.msg.audits.groupPostCount +
        this.msg.audits.newsCommentCount
      );
    },
    sCount() {
      return 0;
    }
  },

  created() {}
};
</script>
