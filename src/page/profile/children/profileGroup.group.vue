<template>
    <div>
        <div class="profile-group-nav">
            <div class='profile-group-nav-item' :class='{active: curType === type}' v-for='({ label, type },index) in navs' :key='`profile-group-nav-${index}`' @click='curType = type'>{{ label }}</div>
        </div>
        <div>
            <groupItem :role='true' v-for='group in dataList' v-if='group.id' :key='`profile-group-${group.id}`' :group='group'></groupItem>
        </div>
    </div>
</template>
<script>
import groupItem from "@/page/group/components/groupListItem";
export default {
  name: "profileGroup_groups",
  components: {
    groupItem
  },
  data() {
    return {
      curType: "join",
      navs: [
        {
          type: "join",
          label: "我加入的"
        },
        {
          type: "audit",
          label: "待审核的"
        }
      ],

      dataList: []
    };
  },
  watch: {
    curType() {
      this.getData();
    }
  },

  methods: {
    getData() {
      this.$http
        .get(`/plus-group/user-groups?type=${this.curType}`)
        .then(({ data = [] }) => {
          this.dataList = data;
        });
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style lang='less'>
</style>
