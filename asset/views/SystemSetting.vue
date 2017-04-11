<template>
  <div class="systemSetting">
    <div class="systemSetting-header systemSetting-background-color">
      <Row :gutter="16">
        <Col span="3" style="display: flex; justify-content: flex-start">
          <i @click="goTo(-1)" class="ivu-icon ivu-icon-android-arrow-back" style="width: 100%; height: 100%; display: flex; align-items: center;"></i>
        </Col>
        <Col span="18" style="font-size: 18px;">
          设置
        </Col>
        <Col span="3" style="display: flex;">
        </Col>
      </Row>
    </div>
    <!-- 入口菜单 -->
    <div :class="$style.entry">
      <Row :gutter="16" :class="$style.entryMenu">
        <div style="width: 100%" @click="changeUrl('/users/password')">
          <Col span="22">
            修改密码
          </Col>
          <Col span="2" :class="$style.rightIcon">
            <Icon type="ios-arrow-right"></Icon>
          </Col>
        </div>
      </Row>
      <Row :gutter="16" :class="$style.entryMenu">
        <div style="width: 100%" @click="comfirmCleanCache">
          <Col span="22" @click="comfirmCleanCache">
            清理缓存
          </Col>
          <Col span="2" :class="$style.rightIcon">
            <Icon type="ios-arrow-right"></Icon>
          </Col>
        </div>
      </Row>
      <Row :gutter="16" :class="$style.entryMenu">
        <Col span="22">
          关于我们
        </Col>
        <Col span="2" :class="$style.rightIcon">
          <Icon type="ios-arrow-right"></Icon>
        </Col>
      </Row>
      <Row :gutter="16" :class="$style.entryMenu">
        <div style="width: 100%" @click="comfirmLogout">
          <Col span="22" style="color: #59b6d7;">
            退出登录
          </Col>
          <Col span="2" :class="$style.rightIcon">
            <Icon type="ios-arrow-right"></Icon>
          </Col>
        </div>
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
  import { NOTICE } from '../stores/types';

  const systemSetting = {
    components: {
      Comfirm
    },
    data: () => ({
      comfirm: {
        isShowComfirm: false,
        method: '',
        context: ''
      }
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
          context: '确定退出登陆'
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
        this.cannel();
        localEvent.clearLocalAll();
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
      border-bottom: 1px solid #e2e3e3;
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
