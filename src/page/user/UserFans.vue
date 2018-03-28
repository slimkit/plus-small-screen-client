<template lang="html">
  <div class="user-fans">
    <nav class="m-box m-head-top m-justify-bet m-lim-width m-pos-f m-main m-bb1">
      <div class="m-box m-aln-center">
        <svg class='m-style-svg m-svg-def' @click='goBack'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <ul class="m-box m-flex-grow1 m-flex-shrink0 m-aln-center m-justify-center m-flex-base0 m-head-nav">
        <router-link tag="li" :to="navTo('followers')" active-class="active" exact>
          <a>粉丝</a>
        </router-link>
        <router-link tag="li" :to="navTo('followings')" active-class="active" exact>
          <a>关注</a>
        </router-link>
      </ul>
      <div class="m-box m-justify-end"></div>
    </nav>
    <main style="padding-top: 0.9rem">
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
    </main>
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
