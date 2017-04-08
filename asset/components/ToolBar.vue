<template>
  <div :class="$style.tabbar">
    <Row :class="$style.toolBar" class="menu">
      <Col :span="5" :class="$style.menuItem">
        <router-link class="router-link" to="/feeds">
          <Icon type="ios-home-outline"></Icon>
          <i>首页</i>
        </router-link>
      </Col>
      <Col :span="5" :class="$style.menuItem">
        <router-link class="router-link" to="/discover">
          <Icon type="android-globe"></Icon>
          <i>发现</i>
        </router-link>
      </Col>
      <Col :span="4" :class="$style.menuItem" class="plus-parent">
          <i @click="showPost" class="ivu-icon ivu-icon-ios-plus-empty" :class="$style.plus"></i>
      </Col>
      <Col :span="5" :class="$style.menuItem">
        <router-link class="router-link" to="/message">
          <Icon type="ios-chatboxes-outline"></Icon>
          <i>消息</i>
        </router-link>
      </Col>
      <Col :span="5" :class="$style.menuItem">
        <router-link class="router-link" to="/profile">
          <Icon type="ios-person-outline"></Icon>
          <i>我</i>
        </router-link>
      </Col>
    </Row>
  </div>
</template>

<script>
    import router from '../routers/index';
    import { SHOWPOST } from '../stores/types';

    export default {
      methods: {
        showPost () {
          this.$store.dispatch(SHOWPOST, cb => {
            cb({
              show: true
            })
          })
        }
      }
    }
</script>

<style lang="scss" module>
    .toolBar {
      position: fixed!important;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 54px!important;
      background-color: #363844;
      z-index: 4!important;
    }
    .plus {
      &:before {
        font-size: 50px!important;
        color: #fff;
      }
    }
    .menuItem {
      height: 100%!important;
      display: flex!important;
      justify-content: center;
      align-items:center;
      color: #707c81;
      flex-wrap: wrap;
      padding: 2px 0;
      i {
        font-style: normal;
        font-size: 16px;
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
        &:before {
            font-size: 24px;
        }
      }
    }
</style>
<style lang="scss" scoped>
  .plus-parent {
    background-color: #59b6d7;
    padding: 0;
  }
  .router-link {
    color: #999;
  }
  .router-link-active {
    border-bottom: none;
    color: #59b6d7;
    i {
      color: #59b6d7;
      &:before {
        color: #59b6d7;
      }
    }
  }
</style>
