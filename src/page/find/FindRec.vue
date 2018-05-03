<template>
  <jo-load-more
  key="find-rec"
  ref="loadmore"
  @onRefresh="onRefresh"
  @onLoadMore="onLoadMore">
    <user-item v-for="user in users" :user="user" :key="user.id"></user-item>
  </jo-load-more>
</template>
<script>
import UserItem from "@/components/UserItem.vue";
import { findUserByType } from "@/api/user.js";
export default {
  name: "find-pop",
  components: {
    UserItem
  },
  data() {
    return {
      users: []
    };
  },
  methods: {
    onRefresh(callback) {
      findUserByType("find-by-tags").then(({ data: users } = {}) => {
        users && (this.users = users);
        callback(users.length < 15);
      });
    },
    onLoadMore(callback) {
      findUserByType("find-by-tags", {
        offset: this.users.length
      }).then(({ data: users }) => {
        this.users = [...this.users, ...users];
        callback(users.length < 15);
      });
    }
  }
};
</script>
