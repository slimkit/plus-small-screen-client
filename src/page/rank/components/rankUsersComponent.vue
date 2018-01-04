<template>
  <div :class="prefixCls">
     <div :class="`${prefixCls}-title-label`">
        <h6>{{ title }}</h6>
        <div :class="`${prefixCls}-more`" @click="to(listUrl)">
          <span>全部</span>
          <v-icon type='base-arrow-r'></v-icon>
        </div>
     </div>
  </div>
</template>

<script>
  const prefixCls = 'rank-list-item'
  export default {
    name: 'rankUsersComponent',
    props: {
      api: {
        required: true
      },
      listUrl: {
        required: true
      },
      title: {
        required: true
      }
    },

    data () {
      return {
        prefixCls
      }
    },

    methods: {
      to(path) {
        if (path) {
          this.$router.push({ path })
        }
      }
    }
  }
</script>

<style lang="less">
  @rank-list-prefixCls: rank-list-item;

  .@{rank-list-prefixCls} {
    &-title-label {
      font-size: 26px;
      padding: 0 30px;
      border-bottom: 1px solid #ededed;
      /*no*/
      height: 70px;
      line-height: 68px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      h6 {
        font-size: 30px;
      }
    }
    &-more {
      display: flex;
      align-items: center;
      span {
        margin: 0 5px;
        color: #999;
      }
      .v-icon {
        width: 24px;
        height: 24px;
        transition: .5s ease;
        font-size: 24px;
        color: #999;
      }
    }
  }
</style>