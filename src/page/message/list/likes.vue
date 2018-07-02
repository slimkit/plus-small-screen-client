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
        <span>收到的赞</span>
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
        :class="`${prefixCls}-loadmore`"
      >
        <div 
          v-for="like in likes" 
          v-if="like.id" 
          :class="`${prefixCls}-item`" 
          :key="like.id">
          <component 
            :is="items[like.likeable_type]" 
            :like="like"/>
        </div>
      </load-more>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { mapState } from "vuex";
import { resetUserCount } from "@/api/message.js";
import feedItem from "../children/likes/feedItem";
import newsItem from "../children/likes/newsItem";
import productItem from "../children/likes/productItem";
import groupPostItem from "../children/likes/groupPostItem";
import questionAnswerItem from "../children/likes/questionAnswerItem";

const prefixCls = "msgList";
const items = {
  news: newsItem,
  feeds: feedItem,
  product: productItem,
  "group-posts": groupPostItem,
  "question-answers": questionAnswerItem
};
export default {
  name: "MyLikes",
  data: () => ({
    prefixCls,
    refreshData: [],
    items
  }),
  watch: {
    refreshData(val) {
      if (val.length > 0) {
        this.$store.commit("SAVE_MY_LIKED", {
          type: "new",
          data: val
        });
      }
    }
  },
  methods: {
    // 刷新服务
    onRefresh() {
      this.refreshData = [];
      this.$http
        .get("/user/likes", {
          validateStatus: s => s === 200
        })
        .then(({ data }) => {
          // 判断与现有数据的id的对比,加入新数据
          if (data.length > 0) {
            this.refreshData = data;
          }
          this.$refs.loadmore.topEnd(!(data.length < 15));
        });
    },

    // loadmore
    onLoadMore() {
      const { id = 0 } = _.last(this.likes) || {};
      this.$http
        .get(
          "/user/likes",
          { params: { after: id } },
          { validateStatus: s => s === 200 }
        )
        .then(({ data }) => {
          if (data.length === 0) {
            this.$refs.loadmore.bottomEnd(true);
            return false;
          }
          this.$store.commit("SAVE_MY_LIKED", { type: "more", data });
          this.$refs.loadmore.bottomEnd(data.length < 15);
        });
    }
  },
  computed: {
    ...mapState({
      likes: state => state.MESSAGE.MY_LIKED || []
    })
  },
  created() {
    resetUserCount("liked");
  }
};
</script>
<style lang="less" src="../style.less">
</style>
