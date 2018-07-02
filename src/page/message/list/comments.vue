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
        <span>收到的评论</span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end"/>
    </header>
    <div 
      :class="`${prefixCls}-container`" 
      style="padding-top: 0.9rem">
      <load-more
        ref="loadmore"
        :on-refresh="onRefresh"
        :on-load-more="onLoadMore"
        :class="`${prefixCls}-loadmore`">
        <div 
          v-for="comment in comments" 
          :class="`${prefixCls}-item`" 
          :key="`comment-key-${comment.id}`"><component 
            :is="items[comment.commentable_type]" 
            :comment="comment"/></div>
      </load-more>
    </div>
  </div>
</template>
<script>
/**
 * 消息-评论列表
 */
import { mapState } from "vuex";
import { resetUserCount } from "@/api/message.js";
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
  name: "MyComments",
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
  created() {
    resetUserCount("commented");
  },
  methods: {
    // 刷新服务
    onRefresh() {
      this.refreshData = [];
      this.$http
        .get("/user/comments", {
          validateStatus: s => s === 200
        })
        .then(({ data }) => {
          if (data.length > 0) {
            this.refreshData = data;
          }
          this.$nextTick(() => {
            this.$refs.loadmore.topEnd(!(data.length < 15));
          });
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
          this.$nextTick(() => {
            this.$refs.loadmore.bottomEnd(data.length < 15);
          });
        });
    }
  }
};
</script>
<style lang="less" src="../style.less">
</style>
