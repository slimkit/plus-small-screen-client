<template>
  <div :class="`${prefixCls}`">
    <ul class="entry__group padding">
      <router-link v-for="item in system" tag='li' class="entry__item" :key="item.url" :to='item.url'>
        <div>
          <svg >
            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="`#${item.icon}`"></use>
          </svg>
        </div>
        <div :class="`${prefixCls}-users`">
          <h5>{{ item.title }}</h5>
          <p>{{ computedGetter(item.placeholder) }}</p>
        </div>
        <div :class="`${prefixCls}-time`">
          <h5 
            v-if="computedGetter(item.time) !== '' && item.time"
          >
            {{ (computedGetter(item.time)) || '' | time2tips }}
          </h5>
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
          icon: "message-tongzhi",
          hanBadge: 0,
          url: "/message/notification",
          bgColor: "#59b6d7",
          count: "sCount",
          time: "sTime"
        },
        comments: {
          title: "评论的",
          placeholder: "cPlaceholder",
          icon: "message-pinglun",
          hanBadge: 0,
          url: "/message/comments",
          bgColor: "#59b6d7",
          count: "cCount",
          time: "cTime"
        },
        diggs: {
          title: "赞过的",
          placeholder: "dPlaceholder",
          icon: "message-zan",
          hanBadge: 0,
          url: "/message/likes",
          bgColor: "#fe8f90",
          count: "dCount",
          time: "dTime"
        },
        audits: {
          title: "审核",
          placeholder: "aPlaceholder",
          icon: "message-shenghe",
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
      newMsg: state => state.MESSAGE.NEW_UNREAD_COUNT,
      sCount: state => state.MESSAGE.NEW_UNREAD_COUNT.system
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
      return this.aCount ? "你有未审核的信息请及时处理" : "没有未审核的申请";
    },
    sPlaceholder() {
      return this.msg.system.placeholder;
    },
    cTime() {
      return this.msg.comments.time;
    },
    dTime() {
      return this.msg.diggs.time;
    },
    sTime() {
      return this.msg.system.time;
    },
    cCount() {
      return this.newMsg.commented;
    },
    dCount() {
      return this.newMsg.liked;
    },
    aCount() {
      return (
        ~~this.newMsg["feed-comment-pinned"] +
        ~~this.newMsg["news-comment-pinned"] +
        ~~this.newMsg["post-comment-pinned"] +
        ~~this.newMsg["post-pinned"] +
        ~~this.newMsg["group-join-pinned"]
      );
    }
  },

  created() {}
};
</script>
