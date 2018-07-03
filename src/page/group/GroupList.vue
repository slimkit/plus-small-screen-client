<template>
  <div class="p-groups">
    <header class="m-box m-aln-center m-justify-bet m-head-top m-pos-f m-main m-bb1">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-shrink1">
        <svg
          class="m-style-svg m-svg-def"
          @click="goBack">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#base-back"/>
        </svg>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-shrink1 m-justify-center m-head-top">
        <span>全部圈子</span>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-shrink1">
        <!--         <svg class="m-style-svg m-svg-def">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-search"></use>
        </svg>
        <svg class="m-style-svg m-svg-def">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#group-add"></use>
        </svg> -->
      </div>
    </header>
    <main style="padding-top: 0.9rem">
      <nav class="m-box m-aln-center m-pos-f m-main m-bb1 p-groups-nav">
        <router-link
          :to="{name: 'groups', query: { type: 'recommend' }}"

          class="m-text-box p-groups-nav-item"
          exact
          replace
          tag="div"
          active-class="active">
          <span>推荐</span>
        </router-link>
        <router-link
          v-for="cate in GROUP_CATES"

          :to="{ name: 'groups', query: { category: cate.id } }"
          :key="cate.id"
          class="m-text-box p-groups-nav-item"
          exact
          replace

          tag="div"
          active-class="active">
          <span class="m-text-cut">{{ cate.name }}</span>
        </router-link>
      </nav>

      <load-more
        ref="loadmore"
        :on-refresh="onRefresh"
        :on-load-more="onLoadMore"
        style="padding-top: 0.9rem">
        <div
          v-for="group in groups"
          :key="group.id"
          class="m-bb1">
          <group-item
            :group="group"
            :show-action="true" />
        </div>
      </load-more>

    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import GroupItem from "./GroupItem.vue";
import { getGroupsByCate } from "@/api/group.js";
export default {
  name: "Groups",
  components: {
    GroupItem
  },
  data() {
    const GROUPS = new Map();
    return {
      GROUPS,
      GROUPChangeTracker: 1
    };
  },
  computed: {
    ...mapState(["GROUP_CATES"]),
    recommend: {
      get() {
        return this.$route.query.type || false;
      },
      set(val) {
        this.$route.query.type = val ? "recommend" : "";
      }
    },
    category() {
      return this.$route.query.category;
    },
    currentUserID() {
      return this.$store.state.CURRENTUSER.id;
    },
    currentType() {
      return this.recommend ? -1 : this.category;
    },
    groups() {
      return this.currentType &&
        this.GROUPChangeTracker &&
        this.GROUPS.has(this.currentType)
        ? Array.from(this.GROUPS.get(this.currentType).values())
        : [];
    }
  },
  watch: {
    currentType(val) {
      val && this.$refs.loadmore.beforeRefresh();
    }
  },
  methods: {
    formateGroups(groups) {
      const map = this.GROUPS.has(this.currentType)
        ? this.GROUPS.get(this.currentType)
        : new Map();
      groups.forEach(group => {
        map.set(group.id, group);
      });
      this.GROUPS.set(this.currentType, map);
      this.GROUPChangeTracker += 1;
    },
    switchCate(cate) {
      this.recommend = false;
      this.$route.query.category = cate.id;
    },
    onRefresh() {
      getGroupsByCate(this.currentType, 15).then((data = []) => {
        this.formateGroups(data);
        this.$refs.loadmore.topEnd(!(data.length < 15));
      });
    },
    onLoadMore() {
      getGroupsByCate(this.currentType, 15, this.groups.length).then(
        (data = []) => {
          this.formateGroups(data);
          this.$refs.loadmore.bottomEnd(data.length < 15);
        }
      );
    }
  }
};
</script>

<style lang="less">
.p-groups-nav {
  padding: 0 30px;
  top: 90px;
  height: 90px;
  flex-wrap: nowrap;
  font-size: 26px;
  color: @text-color3;
  overflow-y: auto;
  &-item {
    flex: 0 0 auto;
    transition: all 0.1s ease;
    & + & {
      margin-left: 50px;
    }
    &.active {
      color: @text-color1;
      font-size: 30px;
    }
  }
}
</style>
