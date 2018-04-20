<template>
  <load-more
  key="find-pop"
  ref="loadmore"
  :onRefresh="onRefresh"
  :onLoadMore="onLoadMore">
    <find-item v-for="user in users" :user="user" :key="user.id"></find-item>
  </load-more>
</template>
<script>
import findItem from "./FindItem.vue";
import { findUserByType } from "@/api/user.js";
export default {
  name: "find-pop",
  components: {
    findItem
  },
  data() {
    return {
      users: []
    };
  },
  methods: {
    onRefresh() {
      findUserByType("populars").then(({ data: users } = {}) => {
        users && (this.users = users);
        this.$refs.loadmore.topEnd(!(users.length < 15));
      });
    },
    onLoadMore() {
      findUserByType("populars", {
        offset: this.users.length
      }).then(({ data: users }) => {
        this.users = [...this.users, ...users];
        this.$refs.loadmore.bottomEnd(users.length < 15);
      });
    }
  },
  mounted() {}
};
</script>
