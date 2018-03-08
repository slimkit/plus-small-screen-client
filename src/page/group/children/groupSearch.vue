<template>
  <div class="group-search">
    <head-top :append='true' title='搜索圈子'>
      <div slot='append' class="head-top-cancel" @click='cancel'>取消</div>
      <div slot='title' class="head-top-search">
        <v-icon type='base-search' class='head-top-search-icon'></v-icon>
        <input class="head-top-search-input" type="text" v-model='keyword' placeholder="搜索" @keyup.enter="search">
      </div>
    </head-top>
    <div></div>
    <template v-if='showType'>
      <div class="group-search-nav">
        <div class='group-search-nav-item' :class='{ active: searchType === `groups` }' @click='searchType = `groups`'>圈子</div>
        <div class='group-search-nav-item' :class='{ active: searchType === `group-posts` }' @click='searchType = `group-posts`'>帖子</div>
      </div>
    </template>
    <div class="group-search-content" :style='{paddingTop: showType ? ".9rem" : ""}'>
      <div class="group-search-history-list" v-if='showHistory'>
        <div class="group-search-history-item" v-for='(history,index) in historys' :key='`history-${index}`' v-if='history' @click='historyClick(history)'>
          <v-icon type='base-circle-time'></v-icon>
          <div class="group-search-history-item-label">{{ history }}</div>
          <v-icon type='base-clean' @click.native.stop='cleanSearchHistorys(history)'></v-icon>
        </div>
        <div class="group-search-history-item cancel" @click='cleanSearchHistorys' ref='test'>清空搜索历史</div>
      </div>
      <div class="group-search-list">
        <div class="group-search-item" v-for='item in dataList' :key='`search-${item.id}`'>
          <component :is='cur_component' :group='item' :feed='item'></component>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import HeadTop from "@/components/HeadTop";
import groupItem from "../components/groupListItem";
import { GroupFeedItem } from "@/components/feed/feedItem";

const sources = [];
export default {
  name: "groupSearch",
  components: {
    HeadTop
  },

  data() {
    return {
      keyword: "",
      searchType: "groups",
      dataList: []
    };
  },

  computed: {
    showType() {
      return this.dataList.length > 0 || !this.showHistory;
    },
    showHistory() {
      return this.historys.length > 0 && !(this.keyword.length > 0);
    },
    historys() {
      return this.$store.state.SEARCHHISTORY;
    },
    cur_component() {
      return this.searchType === "groups" ? groupItem : GroupFeedItem;
    }
  },
  watch: {
    searchType() {
      this.dataList = [];
      this.search();
    }
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    cleanSearchHistorys(history) {
      this.$store.commit("CLEAN_SEARCH_HISTORY", history);
    },
    historyClick(history) {
      this.keyword = history;
      this.search();
    },
    // 使用_.debounce控制搜索的触发频率
    // 准备搜索
    search: _.debounce(
      function() {
        let that = this;
        // 删除已经结束的请求
        _.remove(sources, n => n.source === null);

        // 取消还未结束的请求
        sources.forEach(function(item) {
          if (item !== null && item.source !== null && item.status === 1) {
            item.status = 0;
            item.source.cancel("取消上一个");
          }
        });

        // 创建新的请求cancelToken,并设置状态请求中
        let sc = {
          source: that.$http.CancelToken.source(),
          status: 1 // 状态1：请求中，0:取消中
        };
        sources.push(sc);

        // 开始搜索数据
        if (that.keyword) {
          const uri = `/plus-group/${that.searchType}?keyword=${that.keyword}`;
          that.$store.commit("ADD_SEARCH_HISTORY", that.keyword);
          that.$http
            .get(uri, {
              cancelToken: sc.source.token
            })
            .then(({ data = [] }) => {
              // 置空请求canceltoken
              sc.source = null;
              that.dataList = [...data];
            })
            .catch(
              ({ response: { data = { message: "搜索失败" } } = {} } = {}) => {
                // 置空请求canceltoken
                sc.source = null;
                that.$Message.error(data);
              }
            );
        }
      },
      500 // 空闲时间间隔设置500ms
    )
  }
};
</script>
<style lang='less'>
@group-search-prefixCls: group-search;
.@{group-search-prefixCls} {
  .head-top-title {
    padding: 0 1.2rem 0 0.3rem;
    width: 100%;
  }
  &-content {
  }
  &-history {
    &-list {
    }
    &-item {
      padding: 0 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ededed;
      /*no*/
      background-color: #fff;
      width: 100%;
      height: 90px;
      font-size: 30px;
      color: #999;
      &.cancel {
        justify-content: center;
        color: #333;
      }
      .v-icon {
        flex: none;
        width: 30px;
        height: 30px;
      }
      &-label {
        flex: 1 1 auto;
        margin: 0 30px;
      }
    }
  }
  &-item {
    & + & {
      margin-top: 10px;
    }
  }
  &-nav {
    padding: 0 30px;
    position: fixed;
    z-index: 100;
    top: 90px;
    padding-top: 0 !important;
    display: flex;
    align-items: center;
    height: 90px;
    width: 100%;
    line-height: 89px;
    border-bottom: 1px solid #ededed;
    /*no*/
    background-color: #fff;
    justify-content: space-around;
    &-item {
      padding: 0 10px;
      font-size: 28px;
      color: #999;
      border-bottom: 3px solid transparent;
      &.active {
        border-color: #59b6d7;
        color: #333;
      }
    }
  }
}
</style>
