<template>
  <div class="group-permissions">
    <head-top :go-back='true' title='发帖权限设置'></head-top>
    <div class="group-permissions-list">
      <div class="group-permissions-list-item" v-for='option in options' @click='postData(option.val)' :key="option.label">
        <span>{{ option.label }}</span>
        <v-icon type='base-checked' width='.32' height='.32' color='#70b0ad' v-if='curSelect === option.val'></v-icon>
      </div>
    </div>
  </div>
</template>
<script>
import HeadTop from "@/components/HeadTop";
export default {
  name: "groupPermissions",
  components: {
    HeadTop
  },
  data() {
    return {
      options: [
        {
          label: "所有成员",
          val: 3
        },
        {
          label: "仅圈主",
          val: 1
        },
        {
          label: "仅圈主和管理员",
          val: 2
        }
      ],
      curSelect: 3
    };
  },
  methods: {
    async postData(val) {
      // PATCH /groups/:group/permissions
      let params;
      switch (val) {
        case 3:
          params = ["member", "administrator", "founder"];
          break;
        case 1:
          params = ["founder"];
          break;
        case 2:
          params = ["administrator", "founder"];
          break;
      }

      const { status } = await this.$http.patch(
        `/plus-group/groups/${this.$route.params.groupID}/permissions`,
        {
          permissions: params
        }
      );

      status === 204 && (this.curSelect = val);
    },
    async initData() {
      const { data: { permissions } } = await this.$http.get(
        `/plus-group/groups/${this.$route.params.groupID}`
      );
      this.curSelect = permissions.split(",").length;
    }
  },
  mounted() {
    this.initData();
  }
};
</script>
<style lang='less'>
.group-permissions {
  &-list {
    &-item {
      padding: 0 20px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 30px;
      color: #333;
      background-color: #fff;
      border-bottom: 1px solid #ededed;
      /*no*/
    }
  }
}
</style>
