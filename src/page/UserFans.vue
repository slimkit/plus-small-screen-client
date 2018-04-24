<template>
  <div class="p-user-fans">
    <nav class="m-box m-head-top m-lim-width m-pos-f m-main m-bb1">
      <div class="m-box m-aln-center m-flex-shrink0 ">
        <svg class="m-style-svg m-svg-def" @click="goBack">
          <use xlink:href="#base-back"></use>
        </svg>
      </div>
      <ul class="m-box m-flex-grow1 m-aln-center m-justify-center m-flex-base0 m-head-nav">
        <router-link tag="li" :to="`/user/${userID}/followers`" active-class="active" exact replace>
          <a>粉丝</a>
        </router-link>
        <router-link tag="li" :to="`/user/${userID}/followings`" active-class="active" exact replace>
          <a>关注</a>
        </router-link>
      </ul>
      <div class="m-box m-justify-end"></div>
    </nav>
    <main style="padding-top: 0.9rem">
      <load-more
      ref='loadmore'
      :onRefresh='onRefresh'
      :onLoadMore='onLoadMore'>
        <user-item
        v-for='user in users'
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
import { getUserFansByType } from "@/api/user.js";
export default {
  name: "UserFans",
  components: {
    UserItem
  },
  data() {
    const followers = new Map();
    const followings = new Map();
    return {
      followers,
      followings,
      preUID: 0,
      USERSChangeTracker: 1
    };
  },
  computed: {
    userID() {
      return ~~this.$route.params.userID;
    },
    type() {
      return this.$route.params.type;
    },
    param() {
      return {
        limit: 15,
        type: this.type,
        uid: this.userID
      };
    },
    users() {
      return (
        this.isCurrentView &&
        this.type &&
        this.USERSChangeTracker &&
        Array.from(this.$data[this.type].values())
      );
    }
  },
  watch: {
    type(val) {
      this.isCurrentView && val && this.$refs.loadmore.beforeRefresh();
    }
  },
  activated() {
    this.isCurrentView = true;

    // 判断是否清空上一次的数据
    this.userID === this.preUID ||
      (this.followers.clear(), this.followings.clear());
    this.$refs.loadmore.beforeRefresh();
    this.preUID = this.userID;
  },
  deactivated() {
    this.isCurrentView = false;
  },
  methods: {
    formatedUsers(users) {
      users.forEach(user => {
        this.$store.commit("SAVE_USER", user);
        this.$data[this.type].set(user.id, user);
        this.USERSChangeTracker += 1;
      });
    },
    onRefresh() {
      getUserFansByType(this.param).then(({ data }) => {
        this.formatedUsers(data);
        this.$refs.loadmore.topEnd(!(data.length < this.param.limit));
      });
    },
    onLoadMore() {
      getUserFansByType({ ...this.param, offset: this.users.length }).then(
        ({ data = [] }) => {
          this.formatedUsers(data);
          this.$refs.loadmore.bottomEnd(data.length < this.param.limit);
        }
      );
    }
  }
};
</script>
