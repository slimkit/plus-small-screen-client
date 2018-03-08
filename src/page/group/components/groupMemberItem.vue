<template>
  <div class="group-member-item" v-if='userInfo.id'>
    <div class="group-member-item-info">
      <v-avatar :src='userInfo.avatar' :sex='userInfo.sex'></v-avatar>
      <span class="group-member-name">{{userInfo.name}}</span>
      <span :class="['group-member-role', user.role]" v-if='user.role !== "member"'>{{ role }}</span>
    </div>
    <div class="group-member-action" v-if='actions'>
      <div class="group-member-action-list" v-if='showAction'>
        <div class="group-member-action-item" @click='action.action' v-for="action in actions" :key="action.label">{{ action.label }}</div>
      </div>
      <v-icon type='feed-more' color='#b3b3b3' @click.native='showActions'></v-icon>
    </div>
  </div>
</template>
<script>
import { oneOf } from "@/util";
const rules = ["member", "administrator", "founder"];
export default {
  name: "groupMemberItem",
  props: {
    user: Object,
    groupID: {
      type: [Number, String],
      default() {
        return this.$route.params.groupID;
      }
    },
    rule: {
      type: String,
      validator(val) {
        return oneOf(val, rules);
      },
      required: true
    }
  },
  data() {
    return {
      showAction: false
    };
  },
  computed: {
    role() {
      const role = this.user.role;
      switch (role) {
        case "member":
          return false;
        case "administrator":
          return "管理员";
        case "founder":
          return "圈主";
      }
    },
    userInfo() {
      return this.user.user;
    },
    actions() {
      const that = this;
      let res = [];
      switch (this.rule) {
        case "member":
          return false;
        case "administrator":
          switch (that.user.role) {
            case "member":
              res = [
                {
                  label: "移除圈子",
                  action() {
                    that.deleteMember();
                  }
                },
                {
                  label: that.user.disabled ? "移除黑名单" : "加入黑名单",
                  action() {
                    that.addToBlockList();
                  }
                }
              ];
              break;
            case "administrator":
              return false;
          }
          break;
        case "founder":
          switch (that.user.role) {
            case "member":
              res = [
                {
                  label: "设置圈管理",
                  action() {
                    that.setManger();
                  }
                },
                {
                  label: "移除圈子",
                  action() {
                    that.deleteMember();
                  }
                },
                {
                  label: that.user.disabled ? "移除黑名单" : "加入黑名单",
                  action() {
                    that.addToBlockList();
                  }
                }
              ];
              break;
            case "administrator":
              res = [
                {
                  label: "移除圈管理",
                  action() {
                    that.setManger();
                  }
                }
              ];
              break;
          }
          break;
      }

      return res;
    }
  },
  methods: {
    showActions() {
      this.showAction = !this.showAction;
    },
    // 设置/移除管理员
    async setManger() {
      // /groups/:group/managers/:member
      const method = this.user.role === "administrator" ? "delete" : "put";
      const { status } = await this.$http({
        method,
        url: `/plus-group/groups/${this.groupID}/managers/${this.user.id}`
      });
      // 待处理 父级数据更新
      if (status === 201) {
        this.showActions();
        this.$emit("update");
      }

      if (status === 204) {
        this.showActions();
        this.$emit("update");
      }
    },

    async deleteMember() {
      // DELETE /groups/:group/managers/:member
      const { status } = await this.$http.delete(
        `/plus-group/groups/${this.groupID}/members/${this.user.id}`
      );
      if (status === 204) {
        this.$emit("on-delete", this.user);
      }
    },
    async addToBlockList() {
      // PUT /groups/:group/blacklist/:member
      const method = this.user.disabled ? "delete" : "put";
      const { status } = await this.$http({
        method,
        url: `/plus-group/groups/${this.groupID}/blacklist/${this.user.id}`
      });
      // 待处理 父级数据更新
      if (status === 201) {
        this.showActions();
        this.$emit("update");
      }

      if (status === 204) {
        this.showActions();
        this.$emit("update");
      }
    }
  }
};
</script>
<style lang='less'>
.group-member {
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 135px;
    background-color: #fff;
    &-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    & + & {
      border-top: 1px solid #ededed;
      /*no*/
    }
  }
  &-role {
    padding: 0 15px;
    height: 32px;
    border-radius: 16px;
    font-size: 20px;
    color: #fff;
    background-color: #ccc;
    &.founder {
      background-color: #fca308;
    }
  }
  &-action {
    display: flex;
    position: relative;
    font-size: 24px;
    color: #666;
    height: 100%;
    align-items: center;
    &-list {
      position: absolute;
      left: -100%;
      transform: translateX(-100%);
      min-width: 175px;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    }
    &-item {
      padding: 0 25px;
      height: 75px;
      line-height: 75px;
      text-align: center;
      & + & {
        border-top: 1px solid #ededed;
      }
    }
  }
  &-name {
    flex: 1 1 auto;
    margin: 0 30px;
    font-size: 34px;
    color: #333;
  }
}
</style>
