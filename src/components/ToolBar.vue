<template>
  <div :class="$style.tabbar">
    <Row :class="$style.toolBar" class="menu">
      <Col :span="5" :class="$style.menuItem">
        <router-link class="router-link" to="/feeds">
          <HomeIcon height="26" width="26" color="#999" />
          <i>首页</i>
        </router-link>
      </Col>
      <Col :span="5" :class="$style.menuItem">
        <router-link class="router-link" to="/discover">
          <!-- <Badge dot> -->
            <DiscoverIcon height="26" width="26" color="#999" />
            <i>发现</i>
          <!-- </Badge> -->
        </router-link>
      </Col>
      <Col :span="4" :class="$style.menuItem" class="plus-parent">
          <PlusIcon @click.native="showPost" height="34" width="34" color="#fff" />
      </Col>
      <Col :span="5" :class="$style.menuItem">
        <router-link class="router-link" to="/users/message">
          <Badge dot>
            <MessageIcon height="26" width="26" color="#999" />
            <i>消息</i>
          </Badge>
        </router-link>
      </Col>
      <Col :span="5" :class="$style.menuItem">
        <router-link class="router-link" to="/users/profile">
          <Badge dot>
            <MeIcon height="26" width="26" color="#999" />
            <i>我</i>
          </Badge>
        </router-link>
      </Col>
    </Row>
  </div>
</template>

<script>
  import router from '../routers/index';
  import { SHOWPOST } from '../stores/types';
  import HomeIcon from '../icons/Home';
  import DiscoverIcon from '../icons/Discover';
  import MessageIcon from '../icons/Message';
  import MeIcon from '../icons/Me';
  import PlusIcon from '../icons/Plus';

  export default {
    components: {
      HomeIcon,
      DiscoverIcon,
      MessageIcon,
      MeIcon,
      PlusIcon
    },
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
      line-height: 1!important;
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
        font-size: 12px;
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
        line-height: 1.5;
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
    text-align: center;
    svg {
      margin: 0 auto;
    }
  }
  .router-link-active {
    border-bottom: none;
    color: #59b6d7;
    svg {
      fill: #59b6d7;
      &:before {
        color: #59b6d7;
      }
    }
  }
</style>
