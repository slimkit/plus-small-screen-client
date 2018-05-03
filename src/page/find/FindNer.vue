<template>
  <jo-load-more
  key="find-new"
  ref="loadmore"
  @onRefresh="onRefresh"
  @onLoadMore="onLoadMore">
    <user-item v-for="user in users" :user="user" :key="user.id"></user-item>
  </jo-load-more>
</template>

<script>
import { mapState } from "vuex";
import UserItem from "@/components/UserItem.vue";
import { findNearbyUser, getUserInfoById } from "@/api/user.js";
export default {
  name: "find-ner",
  components: {
    UserItem
  },
  computed: {
    ...mapState(["POSITION"]),
    lat() {
      return this.POSITION.lat;
    },
    lng() {
      return this.POSITION.lng;
    }
  },
  data() {
    return {
      users: [],
      page: 1,
      isActive: false
    };
  },
  methods: {
    formateUsers(users) {
      for (let i = 0; i < users.length; i++) {
        getUserInfoById(users[i]["user_id"]).then(user => {
          this.users.push(user);
        });
      }
    },
    onRefresh(callback) {
      this.page = 1;
      findNearbyUser({ lat: this.lat, lng: this.lng }, this.page).then(
        ({ data = [] }) => {
          this.users = [];
          this.formateUsers(data);
          this.page = 2;
          callback(data.length < 15);
        }
      );
    },
    onLoadMore(callback) {
      findNearbyUser({ lat: this.lat, lng: this.lng }, this.page).then(
        ({ data = [] }) => {
          this.page += 1;
          this.formateUsers(data);
          callback(data.length < 15);
        }
      );
    }
  }
};
</script>
