<template>
<div class="group">
  <!-- header -->
  <Row :gutter="24"
       class="group-header">
    <Col span="4"
         @click.native="changeUrl(`/discover`)">
    <back-icon height="21"
               width="21"
               color="#999"></back-icon>
    </Col>
    <Col span="16"
         class="nav">
    <Col class="nav-link"
         :span="8">
    <router-link to="/group/list/mine">我加入的</router-link>
    </Col>
    <Col class="nav-link"
         :span="8">
    <router-link to="/group/list/all">全部圈子</router-link>
    </Col>
    </Col>
    <Col span="4"></Col>
  </Row>
  <!-- /header -->
  <div class="group-content">
    <router-view></router-view>
  </div>
</div>

</template>

<script>
// icon
import BackIcon from '../../icons/Back';

import { changeUrl } from '../../utils/changeUrl';

export default {
  name: 'group',
  components: {
    BackIcon
  },
  data() {
    return ({

    })
  },
  methods: {
    changeUrl
  }
}

</script>

<style lang="scss">
.group {
  overflow: hidden;
  .group-content {
    padding-top: 46px;
    min-height: 100%;
  }
  .group-header {
    width: 100%;
    height: 46px;
    line-height: 45px;
    background-color: #fff;
    border-bottom: 1px #ededed solid;
    position: fixed;
    z-index: 2;
    .nav {
      align-items: center;
      .nav-link {
        padding: 0 !important;
        width: 50%;
      }
      a {
        font-size: 14px;
        display: block;
        text-align: center;
        height: 45px;
        line-height: 44px;
        color: #999;
        &[class*='active'] {
          color: #333;
        }
      }
    }
  }
  .group-nodatas {
    width: 100%;
    height: auto;
    >img {
      display: block;
      margin: 20%;
      width: 60%;
    }
  }
  .no-more {
    padding: 10px;
    text-align: center;
  }
  .col-back--icon {
    display: flex;
    justify-content: flex-start;
    align-items: center
  }
  .mint-loadmore-bottom {
    margin-bottom: -50px;
  }
}
</style>
