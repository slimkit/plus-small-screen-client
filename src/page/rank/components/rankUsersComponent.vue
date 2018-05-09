<template>
  <div v-if="show" :class="prefixCls">
    <div :class="`${prefixCls}-label`">
      <h6>{{ title }}</h6>
      <div :class="`${prefixCls}-more`" @click="to(listUrl)">
        <span>全部</span>
        <v-icon type='base-arrow-r'></v-icon>
      </div>
    </div>
    <div :class="`${prefixCls}-label`">
      <div @click="to(`/users/${user.id}`)" :class="`${prefixCls}-user`" v-for="user in getShow" :key="user.id">
        <avatar :class="`${prefixCls}-user-avatar`" :user="user" />
        <p class="ellipsis">{{ user.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
const prefixCls = "rank-list-item";
export default {
  name: "rankUsersComponent",
  props: {
    api: {
      required: true
    },
    listUrl: {
      required: true
    },
    title: {
      required: true
    },
    name: {
      required: true
    }
  },

  data() {
    return {
      prefixCls,
      users: []
    };
  },

  computed: {
    /**
     * 是否展示该排行模块
     * @Author   Wayne
     * @DateTime 2018-01-04
     * @Email    qiaobin@zhiyicx.com
     * @return   Boolean
     */
    show() {
      return this.users.length > 0;
    },
    /**
     * 获取前个要被展示的用户
     * @Author   Wayne
     * @DateTime 2018-01-04
     * @Email    qiaobin@zhiyicx.com
     * @return   Array
     */
    getShow() {
      return this.users.slice(0, 5);
    }
  },

  methods: {
    to(path) {
      if (path) {
        this.$router.push({ path });
      }
    },

    getUsers() {
      this.$http
        .get(this.api, {
          validateStatus: status => status === 200
        })
        .then(({ data = [] }) => {
          this.users = [...data];
          this.$store.commit("SAVE_RANK_DATA", { name: this.name, data });
          this.$store.commit("SAVE_USER", data);
        });
    }
  },
  activated() {
    this.getUsers();
  }
};
</script>

<style lang="less">
@rank-list-prefixCls: rank-list-item;

.@{rank-list-prefixCls} {
  background-color: #fff;
  & + & {
    margin-top: 8px;
  }
  &-label {
    &:nth-child(2) {
      height: 194px;
      margin-left: -30px;
      justify-content: flex-start;
    }
    font-size: 26px;
    padding: 0 30px;
    height: 70px;
    line-height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h6 {
      font-size: 30px;
      color: #333;
    }
  }
  &-user {
    font-size: 24px;
    width: calc(~"20% - " 30px);
    margin-left: 30px;
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
    &-avatar {
      width: 100px;
      height: 100px;
      span {
        color: #666;
        width: 100%;
        font-size: 24px;
      }
      img {
        width: 100px;
        height: 100px;
      }
    }
  }
  &-more {
    display: flex;
    align-items: center;
    span {
      margin: 0 5px;
      color: #999;
      font-size: 24px;
    }
    .v-icon {
      width: 24px;
      height: 24px;
      transition: 0.5s ease;
      font-size: 24px;
      color: #999;
    }
  }
}
</style>
