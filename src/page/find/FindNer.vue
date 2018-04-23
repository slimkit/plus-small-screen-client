<template>
  <load-more
  key="find-new"
  ref="loadmore"
  :onRefresh="onRefresh"
  :onLoadMore="onLoadMore">
    <find-item v-for="user in users" :user="user" :key="user.id"></find-item>
  </load-more>
</template>

<script>
import { mapState } from "vuex";
import FindItem from "./FindItem.vue";
import { findNearbyUser, getUserInfoById } from "@/api/user.js";
export default {
  name: "find-ner",
  components: {
    FindItem
  },
  computed: {
    ...mapState(["POSITION"]),
    lat() {
      return this.POSITION.lat;
    },
    lng() {
      return this.POSITION.lng;
    },
    users() {
      /**
       * Vue 暂时没有实现监听 Map Set, 手动触发更新
       */
      return this.USERSChangeTracker && [...this.USERS];
    }
  },
  data() {
    const USERS = new Set();
    return {
      USERSChangeTracker: 1,
      USERS,
      page: 1,
      isActive: false
    };
  },
  activated() {
    this.isActive = true;
  },
  deactivated() {
    this.isActive = false;
  },
  methods: {
    async formateUser(id) {
      const user = await getUserInfoById(id);
      this.USERS.add(user);
      this.USERSChangeTracker += 1;
    },
    onRefresh() {
      this.page = 1;
      findNearbyUser({ lat: this.lat, lng: this.lng }, this.page).then(
        ({ data = [] }) => {
          data.forEach(({ user_id }) => {
            this.formateUser(user_id);
          });
          this.page = 2;
          this.$refs.loadmore.topEnd(!(data.length < 15));
        }
      );
    },
    onLoadMore() {
      findNearbyUser({ lat: this.lat, lng: this.lng }, this.page).then(
        ({ data = [] }) => {
          data.forEach(user => {
            this.formateUser(user.user_id);
          });
          this.page += 1;
          this.$refs.loadmore.bottomEnd(data.length < 15);
        }
      );
    }
  }
};
</script>
