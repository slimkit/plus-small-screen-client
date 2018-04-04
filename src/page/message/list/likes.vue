<template>
  <div :class="`${prefixCls}`">
    <head-top :go-back="true" title='赞过的'></head-top>
    <div></div>
    <div :class="`${prefixCls}-container`">
      <load-more
        :onRefresh='onRefresh'
        :onLoadMore='onLoadMore'
        ref='loadmore'
        :class="`${prefixCls}-loadmore`"
      >
        <div :class="`${prefixCls}-item`" v-if="like.id" v-for="like in likes" :key="like.id">
          <component :is="items[like.likeable_type]" :like="like"></component>
        </div>
      </load-more>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { mapState } from "vuex";
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
  name: "myLikes",
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
  activated() {
    this.$refs.loadmore.noMore = false;
  },
  created() {
    // this.$store.dispatch('GET_MY_LIKED_ALL');
  }
};
</script>
<style lang="less" src="../style.less">
</style>
