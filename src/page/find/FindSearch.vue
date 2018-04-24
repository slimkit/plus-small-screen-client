<template>
  <transition
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutLeft">
    <div class="m-box-model m-pos-f p-search-user">
      <header class="m-pos-f m-box m-aln-center m-justify-bet m-main m-bb1">
        <div class="m-flex-grow1 m-flex-shrink1 m-flex-base0">
          <div class="m-search-box">
            <svg class="m-style-svg m-svg-def">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-search"></use>
            </svg>
            <!-- input[type=search] 使用 form 标签包裹起来，呼出键盘的enter才会有搜索按钮 -->
            <form action="#" onsubmit="return false">
              <input
                type="search"
                @blur="onBlur"
                @focus="onFocus"
                v-model="keyword"
                placeholder="搜索"
                @input="searchUserByKey"
                @keyup.enter="searchUserByKey" >
            </form>
          </div>
        </div>
        <div class="m-flex-grow0 m-flex-shrink0">
          <a @click.stop="goBack">取消</a>
        </div>
      </header>

      <main class="m-flex-grow1 m-flex-shrink1 p-search-user-body" style="padding-top: 0.95rem">
        <load-more v-show="showRec" ref="loadmoreRecs" :on-refresh="fetchRecs">
          <user-item :user="user" :key="user.id" v-for="user in recs" />          
        </load-more>
        <load-more v-show="users.length > 0" :noTranslateAnimation="true" style="margin-top: -40px;" ref="loadmore" :on-load-more="onLoadMore">
          <user-item :user="user" :key="user.id" v-for="user in users" />          
        </load-more>
        <div v-if="noData" class="placeholder m-no-find"></div>
      </main>
    </div>
  </transition>
</template>
<script>
import _ from "lodash";
import UserItem from "@/components/UserItem.vue";
import { findUserByType, searchUserByKey } from "@/api/user.js";
export default {
  name: "search-user",
  components: {
    UserItem
  },
  data() {
    return {
      show: true,
      users: [],
      recs: [],
      isFocus: false,
      noData: false,
      keyword: ""
    };
  },
  computed: {
    showRec() {
      return this.keyword.length === 0 && !this.isFocus;
    }
  },
  methods: {
    goBack() {
      this.keyword = "";
      this.isFocus = false;
      this.$router.go(-1);
    },
    searchUserByKey: _.throttle(function() {
      searchUserByKey(this.keyword).then(({ data }) => {
        this.users = data;
        this.noData = data.length === 0 && this.keyword.length > 0;
      });
    }, 1e3),
    onLoadMore() {
      searchUserByKey(this.keyword, this.users.length).then(({ data }) => {
        this.users = [...this.users, ...data];
        this.$refs.loadmore.bottomEnd(data.length < 15);
      });
    },
    onFocus() {
      this.isFocus = true;
      this.noData = false;
    },
    onBlur() {
      this.isFocus = false;
    },
    fetchRecs() {
      findUserByType("recommends").then(({ data }) => {
        this.recs = data;
        this.$refs.loadmoreRecs.topEnd(!(data.length < 15));
      });
    }
  }
};
</script>

<style lang="less">
.p-search-user {
  z-index: 100;
  background-color: #f4f5f6;
  animation-duration: 0.3s;
  header {
    padding: 20px 30px;
    bottom: initial;
  }
  .m-search-box {
    margin-right: 30px;
  }
  .p-search-user-body {
    overflow-y: auto;
  }
  .m-no-find {
    width: 100vw;
    height: 100vh;
    position: fixed;
  }
}
</style>
