<template>
    <div class="page-find">
        <head-top :go-back='goBack' title='true' :append='true'>
            <div class="find-top-append ellipsis" slot='append' @click='to(`/location`)'>
                <v-icon type='find-location'></v-icon>{{ cur_txt }}
            </div>
            <div class="head-search" slot='title' @click='to(`/search_user`)'>
                <v-icon type='base-search'></v-icon> 搜索
            </div>
        </head-top>
        <div class="find-nav">
            <router-link tag='div' class='find-nav-item' to='/find/pop'>热门</router-link>
            <router-link tag='div' class='find-nav-item' to='/find/new'>最新</router-link>
            <router-link tag='div' class='find-nav-item' to='/find/rec'>推荐</router-link>
            <router-link tag='div' class='find-nav-item' to='/find/nearby'>附近</router-link>
        </div>
        <div class="find-content">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </div>
</template>
<script>
import HeadTop from "@/components/HeadTop";
export default {
  name: "findIndex",
  components: {
    HeadTop
  },
  data() {
    return {};
  },
  computed: {
    location() {
      const location = this.$store.state.LOCATION || {};
      if (JSON.stringify(location) === "{}") {
        this.$store.dispatch("GET_LOCATION");
      }
      return location;
    },

    cur_txt() {
      const { label = "" } = this.location;
      return (
        (label.length > 5
          ? `${label.slice(0, 2)}…${label.slice(-2)}`
          : label) || "选择城市"
      );
    }
  },
  methods: {
    goBack() {
      this.to("/discover");
    },
    to(patch) {
      if (patch) {
        this.$router.push(patch);
      }
    }
  }
};
</script>
<style lang='less'>
.page-find .find-top-append {
  width: 160px;
  font-size: 24px;
  color: #333;
  text-align: left;
  white-space: nowrap;
}

.head-search {
  position: relative;
  left: -13%;
  width: 100%;
  height: 54px;
  background-color: #ededed;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #999;
  font-size: 24px;
  padding: 12px;
  .v-icon {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }
}

.find-nav {
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
  justify-content: center;
  &-item {
    padding: 0 10px;
    font-size: 28px;
    color: #999;
    border-bottom: 3px solid transparent;
    & + & {
      margin-left: 90px;
    }

    &.router-link-active {
      border-color: #59b6d7;
      color: #333;
    }
  }
}

.find-content {
  padding-top: 180px;
  min-height: 100vh;
  position: relative;
  background-color: #fff;
}
</style>
