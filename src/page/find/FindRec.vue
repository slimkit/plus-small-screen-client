<template>
  <load-more
  key="find-rec"
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
      findUserByType("find-by-tags").then(({ data: users } = {}) => {
        users && (this.users = users);
        this.$refs.loadmore.topEnd(!(users.length < 15));
      });
    },
    onLoadMore() {
      findUserByType("find-by-tags", {
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
