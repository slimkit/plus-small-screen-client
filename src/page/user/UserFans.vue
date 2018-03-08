<template lang="html">
  <div class="user-fans">
    <head-top :go-back='true'>
      <div slot='nav' class="head-top-nav">
        <router-link class='head-top-nav-item' exact replace :to="navTo('followers')">粉丝</router-link>
        <router-link class='head-top-nav-item' exact replace :to="navTo('followings')">关注</router-link>
      </div>
    </head-top>
    <load-more
    ref='loadmore'
    :onRefresh='onRefresh'
    :onLoadMore='onLoadMore'
    class="user-fans--list"
    >
      <user-item
      v-for='user in userList'
      v-if='user.id'
      :user='user'
      :key='`user-item-${user.id}`'
      ></user-item>
    </load-more>
  </div>
</template>
<script>
import UserItem from "@/components/UserItem";
export default {
  name: "UserFans",
  components: {
    UserItem
  },
  data() {
    return {
      userList: [],
      refreshData: []
    };
  },
  computed: {
    userID() {
      return this.$route.params.userID;
    },
    type() {
      const { type } = this.$route.query;

      return type || "followers";
    }
  },
  watch: {
    type() {
      this.userList = [];
      this.$refs.loadmore.beforeRefresh();
    },
    refreshData(val) {
      if (val.length > 0) {
        this.userList = Object.assign([], this.userList, val);
      }
    }
  },
  methods: {
    navTo(type) {
      return {
        path: `/user/${this.userID}/fans`,
        query: {
          type
        }
      };
    },
    onRefresh() {
      // /users/:user/followers
      this.refreshData = [];
      this.$http
        .get(`/users/${this.userID}/${this.type}`)
        .then(({ data = [] }) => {
          if (data.length > 0) {
            this.refreshData = data;
          }
          this.$refs.loadmore.topEnd(!(data.length < 20));
        });
    },
    onLoadMore() {
      this.$http
        .get(`/users/${this.userID}/${this.type}`, {
          params: {
            limit: 15,
            offset: this.userList.length
          }
        })
        .then(({ data = [] }) => {
          if (data.length > 0) {
            this.userList = this.userList.concat(data);
          }
          this.$refs.loadmore.bottomEnd(data.length < 15);
        });
    }
  }
};
</script>

<style lang="css">
</style>
