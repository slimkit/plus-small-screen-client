<template>
  <div class="systemSetting">
    <div class="commonHeader" v-if="!isWeiXin" >
      <Row :gutter="24">
        <Col span="5" style="display: flex; justify-content: flex-start" @click.native="goTo(-1)">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          设置
        </Col>
        <Col span="5" style="display: flex;">
        </Col>
      </Row>
    </div>
    <!-- 入口菜单 -->
    <div :class="$style.entry">
      <Row :gutter="24" :class="$style.entryMenu" @click.native="changeUrl('/users/password')">
        <Col span="22">
          修改密码
        </Col>
        <Col span="2" :class="$style.rightIcon">
          <RightArrowIcon height="18" width="18" color="#999" />
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.entryMenu" @click.native="comfirmCleanCache">
        <Col span="22" @click="comfirmCleanCache">
          清理缓存
        </Col>
        <Col span="2" :class="$style.rightIcon">
          <RightArrowIcon height="18" width="18" color="#999" />
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.entryMenu">
        <Col span="22">
          关于我们
        </Col>
        <Col span="2" :class="$style.rightIcon">
          <RightArrowIcon height="18" width="18" color="#999" />
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.entryMenu" @click.native="comfirmLogout">
        <Col span="22" style="color: #59b6d7;">
          退出登录
        </Col>
        <Col span="2" :class="$style.rightIcon">
          <RightArrowIcon height="18" width="18" color="#999" />
        </Col>
      </Row>
    </div>
    <!-- 弹出框 -->
    <Comfirm v-if="comfirm.isShowComfirm" @cannel="cannel" @increment="comfirm.method" :comfirm-content="comfirm.context"></Comfirm>
  </div>
</template>
<script>
  import router from '../routers/index';
  import { changeUrl } from '../utils/changeUrl';
  import localEvent from '../stores/localStorage';
  import Comfirm from '../utils/Comfirm';
  import { NOTICE, CLEANUSERFEEDS } from '../stores/types';
  import BackIcon from '../icons/Back';
  import RightArrowIcon from '../icons/RightArrow';

  const systemSetting = {
    components: {
      Comfirm,
      BackIcon,
      RightArrowIcon
    },
    data: () => ({
      comfirm: {
        isShowComfirm: false,
        method: '',
        context: ''
      },
      isWeiXin: TS_WEB.isWeiXin
    }),
    methods: {
      changeUrl,
      goTo (num) {
        router.go(num);
      },
      cannel () {
        this.comfirm = {
          isShowComfirm: false,
          method: '',
          context: ''
        }
      },
      comfirmLogout () {
        this.comfirm = {
          isShowComfirm: true,
          method: this.logout,
          context: '确定退出登录'
        }
      },
      comfirmCleanCache () {
        this.comfirm = {
          isShowComfirm: true,
          method: this.cleanCache,
          context: '确定清理缓存'
        }
      },
      cleanCache () {
        let login = localEvent.getLocalItem('UserLoginInfo');
        localEvent.clearLocalAll();
        localEvent.setLocalItem('UserLoginInfo', login);
        this.$store.dispatch(NOTICE, cb => {
          cb({
            time: 1500,
            status: true,
            text: '清理成功'
          });
        });
        this.cannel();
      },
      logout () {
        if(TS_WEB.webSocket){
          TS_WEB.webSocket.close();
        }
        this.cannel();
        this.$store.dispatch(CLEANUSERFEEDS);
        this.$storeLocal.set('UserLoginInfo', {});
        this.changeUrl('/login');
      }
    }
  }

  export default systemSetting;
</script>
<style scope lang="scss">
  .systemSetting-header {
    height: 45px;
    border-bottom: 1px #ddd solid;
    .ivu-row {
      width: 100%;
    }
    .ivu-row, .ivu-col {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        height: 100%;
      }
      a {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        padding: 5px 0;
      }
    }
  }
  .systemSetting-background-color {
    background-color: #fff;
  }
</style>
<style lang="scss" module>
  .entry {
    background-color: #fff;
    .entryMenu {
      height: 50px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ededed;
      &:last-child {
        border-bottom: none;
      }
      .rightIcon {
        display: flex!important;
        justify-content: flex-end!important;
      }
    }
  }
</style>
