<template>
  <div :class="`${prefixCls}`">
    <head-top :go-back='true' title='评论的'></head-top>
    <div></div>
    <div :class="`${prefixCls}-container`">
      <load-more
        :onRefresh='onRefresh'
        :onLoadMore='onLoadMore'
        ref='loadmore'
        :class="`${prefixCls}-loadmore`"
      >
        <div :class="`${prefixCls}-item`" v-for="comment in comments" :key="`comment-key-${comment.id}`"><component :is="items[comment.commentable_type]" :comment="comment"></component></div>
      </load-more>
    </div>
  </div>
</template>
<script>
/**
 * 消息-评论列表
 */
import { mapState } from "vuex";
import feedItem from "../children/comments/feedItem";
import newsItem from "../children/comments/newsItem";
import productItem from "../children/comments/productItem";
import questionItem from "../children/comments/questionItem";
import groupPostItem from "../children/comments/groupPostItem";
import questionAnswerItem from "../children/comments/questionAnswerItem";
import _ from "lodash";

const prefixCls = "msgList";
const items = {
  news: newsItem,
  feeds: feedItem,
  product: productItem,
  questions: questionItem,
  "group-posts": groupPostItem,
  "question-answers": questionAnswerItem
};
const commentType = {
  feeds: {
    title: "动态",
    url: "/feed/"
  },
  "question-answers": {
    title: "回答",
    url: "/question-answers/"
  },
  news: {
    title: "头条",
    url: "/news/"
  },
  questions: {
    title: "问题",
    url: "/questions/"
  }
};
export default {
  name: "myComments",
  data: () => ({
    prefixCls,
    commentType,
    items,
    refreshData: []
  }),
  computed: {
    ...mapState({
      comments: state => state.MESSAGE.MY_COMMENTED
    })
  },
  watch: {
    refreshData(data) {
      if (data.length > 0) {
        this.$store.commit("SAVE_MY_COMMENTED", {
          type: "new",
          data
        });
      }
    }
  },
  methods: {
    // 刷新服务
    onRefresh() {
      console.log(1);
      this.refreshData = [];
      this.$http
        .get("/user/comments", {
          validateStatus: s => s === 200
        })
        .then(({ data }) => {
          if (data.length > 0) {
            this.refreshData = data;
          }
          this.$nextTick(this.$refs.loadmore.topEnd);
        });
    },

    // loadmore
    onLoadMore() {
      const { id = 0 } = _.last(this.comments) || {};
      this.$http
        .get(
          "/user/comments",
          { params: { after: id } },
          { validateStatus: s => s === 200 }
        )
        .then(({ data }) => {
          this.$store.commit("SAVE_MY_COMMENTED", {
            type: "more",
            data
          });
          this.$nextTick(this.$refs.loadmore.bottomEnd(data.length < 15));
        });
    }
  },
  activated() {
    this.$refs.loadmore.noMore = false;
  },
  created() {
    // 获取第一次消息
    // this.onRefresh();
  }
};
</script>
<style lang="less" src="../style.less">
</style>
