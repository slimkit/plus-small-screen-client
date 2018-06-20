<template>
  <div class="p-group">
    <header class="m-box m-aln-center m-justify-bet m-head-top m-pos-f m-main m-bb1">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-shrink1">
        <svg class="m-style-svg m-svg-def" @click="goBack">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-shrink1 m-justify-center m-head-top">
        <span>圈子</span>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-shrink1">
        <!-- <router-link to="group/search" tag='svg' class="m-style-svg m-svg-def">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-search"></use>
        </router-link>
        <router-link to="group/new" tag='svg' class="m-style-svg m-svg-def">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#group-add"></use>
        </router-link> -->
      </div>
    </header>

    <main style="padding-top: 0.9rem">
      <router-link :to="{ name: 'groups', query: { type: 'recommend' } }" class="m-box m-aln-center m-justify-bet m-main mt10 group-label m-bb1">
        <h2><strong>{{ groupTotalNumber }}</strong>个兴趣小组，等待你的加入！</h2>
        <svg class="m-style-svg m-svg-def m-entry-append">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
      <!-- 我加入的 -->
      <div class="m-box-model">
        <router-link
          tag="div"
          :to="`/users/${currentUserID}/group`"
          class="m-box m-aln-center m-justify-bet m-main mt10 group-label m-bb1 m-bt1 m-pos-stick">
          <span>我加入的</span>
          <div class="m-box m-aln-center m-justify-end">
            <span>查看全部</span>
            <svg class="m-style-svg m-svg-def m-entry-append">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
            </svg>
          </div>
        </router-link>
        <ul class="group-list">
          <li v-for="group in groups" :key="`mygroup-${group.id}`">
            <group-item :group="group" />
          </li>
        </ul>
      </div>

      <!-- 推荐圈子 -->
      <div class="m-box-model" v-if="recGroups.length > 0">
        <div class="m-box m-aln-center m-justify-bet m-main mt10 group-label m-bb1 m-bt1 m-pos-stick">
          <span>热门推荐</span>
          <div class="m-box m-aln-center m-justify-end" @click="fetchRecGroups">
            <svg class="m-style-svg m-svg-small" :style='{ transform: `rotate(${clickCount}turn)` }'>
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-refresh"></use>
            </svg>
            <span style="margin-left: 0.05rem">换一批</span>
          </div>
        </div>
        <ul class="group-list">
          <li v-for="group in recGroups" :key="`recgroup-${group.id}`">
            <group-item :group="group" />
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>
<script>
import GroupItem from "./GroupItem.vue";
import { getGroupTotalNumber, getMyGroups, getRecGroups } from "@/api/group.js";
export default {
  name: "group",
  components: {
    GroupItem
  },
  data() {
    const myGroups = new Map();
    return {
      myGroups,
      recGroups: [],
      clickCount: 0,
      groupTotalNumber: 1,

      fetchRecing: false,
      myGroupChangeTracker: 0
    };
  },
  computed: {
    currentUserID() {
      return this.$store.state.CURRENTUSER.id;
    },
    groups() {
      return this.myGroupChangeTracker && [...this.myGroups.values()];
    }
  },
  mounted() {
    getGroupTotalNumber().then(count => {
      this.groupTotalNumber = count;
    });
  },
  methods: {
    formateGroups(groups) {
      groups.forEach(group => {
        this.myGroups.set(group.id, group);
        this.myGroupChangeTracker += 1;
      });
    },
    fetchMyGroups() {
      getMyGroups().then(groups => {
        this.formateGroups(groups);
      });
    },
    fetchRecGroups() {
      if (this.fetchRecing) return;
      this.fetchRecing = true;
      getRecGroups().then(groups => {
        this.recGroups = groups;
        this.clickCount += 1;
        this.fetchRecing = false;
      });
    }
  },
  created() {
    this.fetchMyGroups();
    this.fetchRecGroups();
  },
  activated() {}
};
</script>

<style lang="less">
.p-group {
  .group-label {
    font-size: 24px;
    color: @text-color3;
    padding: 20px;
    strong {
      font-size: 40px;
      color: #f4504d;
    }

    .m-svg-small {
      transition: transform 0.5s ease;
    }

    &.m-pos-stick {
      position: sticky;
      top: 90px;
      z-index: 9;
    }
  }

  .group-list {
    li {
      border-top: 1px solid @border-color; /*no*/
    }
  }
}
</style>
