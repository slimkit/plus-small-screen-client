<template>
  <div class="changePassword">
    <div class="commonHeader">
      <Row :gutter="24">
        <Col span="5" style="display: flex; justify-content: flex-start" @click.native="goTo(-1)">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          修改密码
        </Col>
        <Col span="5" class="header-end-col">
          <Button type="text" @click="changePassword" :disabled="!isDisabled">更改</Button>
        </Col>
      </Row>
    </div>
    <div class="changePassword-content changePassword-bakcground-color" :class="$style.entry">
      <Row :gutter="24" :class="$style.entryMenu">
        <Col span="6">
          旧密码
        </Col>
        <Col span="15">
          <input type="text"  size="large" v-show="isShowOldPassword" v-model.trim="oldPassword" placeholder="旧密码" id="password" name="password" />
        </Col>
        <Col span="3">
          <CloseIcon v-show="showOldIcon" height="21" width="21" color="#999" @click.native="cleanOldPassword" />
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.entryMenu">
        <Col span="6">
          新密码
        </Col>
        <Col span="15">
          <input type="password"  size="large" v-show="isShowNewPassword" v-model.trim="newPassword" placeholder="新密码" id="password" name="password" />
          <input type="text"  v-model.trim="newPassword" v-show="!isShowNewPassword" value="" placeholder="新密码" />
        </Col>
        <Col span="3">
          <EyeOpenIcon @click.native="handleShowNewPassword" v-show="!isShowNewPassword" height="21" width="21" color="#999" />
          <EyeCloseIcon @click.native="handleShowNewPassword" v-show="isShowNewPassword" height="21" width="21" color="#999" />
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.entryMenu">
        <Col span="6">
          确认密码
        </Col>
        <Col span="15">
          <input type="password"  size="large" v-show="isShowRepeatPassword" v-model.trim="repeatNewPassword" placeholder="确认新密码" id="repeatPassword" name="repeatPassword" />
          <input type="text"  v-model.trim="repeatNewPassword" v-show="!isShowRepeatPassword" value="" placeholder="确认新密码" />
        </Col>
        <Col span="3">
          <EyeOpenIcon @click.native="handleShowRepeatPassword" v-show="!isShowRepeatPassword" height="21" width="21" color="#999" />
          <EyeCloseIcon @click.native="handleShowRepeatPassword" v-show="isShowRepeatPassword" height="21" width="21" color="#999" />
        </Col>
      </Row>
    </div>
    <div id="notice">
      <Row :gutter="24">
        <Col span="24">
          <p class="notice error">{{ error }}</p>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
  import { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import { NOTICE } from '../stores/types';
  import { goTo, changeUrl } from '../utils/changeUrl';
  import BackIcon from '../icons/Back';
  import CloseIcon from '../icons/Close';
  import EyeOpenIcon from '../icons/EyeOpen';
  import EyeCloseIcon from '../icons/EyeClose';

  import { CLEANUSERFEEDS } from '../stores/types';
  import formatError from '../utils/errorTips';
  import localEvent from '../stores/localStorage';

  const changePassword = {
    components: {
      BackIcon,
      CloseIcon,
      EyeOpenIcon,
      EyeCloseIcon
    },
    data: () => ({
      oldPassword: '',
      newPassword: '',
      repeatNewPassword: '',
      isShowOldPassword: true,
      isShowNewPassword: true,
      isShowRepeatPassword: true,
      isDisabled: true,
      error: ''
    }),
    computed: {
      // isDisabled () {
      //   return (this.oldPassword.length > 5) 
      //           && (this.newPassword.length > 5) 
      //           && (this.newPassword.length > 5) 
      //           && (this.newPassword.length < 16) 
      //           && (this.newPassword === this.repeatNewPassword);
      // },
      showOldIcon () {
        return this.oldPassword.length > 0;
      },
      showNewIcon () {
        return this.newPassword.length > 0;
      },
      showRepeatIcon () {
        return this.repeatNewPassword.length > 0;
      }
    },
    methods: {
      goTo,changeUrl,
      cleanOldPassword () {
        this.oldPassword = '';
      },
      handleShowNewPassword () {
        this.isShowNewPassword = !this.isShowNewPassword;
      },
      handleShowRepeatPassword () {
        this.isShowRepeatPassword = !this.isShowRepeatPassword;
      },
      changePassword () {
        let old_password = this.oldPassword;
        let password = this.newPassword;
        let password_confirmation = this.repeatNewPassword;
        if(password.length < 6) {
          this.error = '旧密码长度不能小于6';
          return false;
        }
        if(password.length < 6) {
          this.error = '新密码长度不能小于6';
          return false;
        }
        if(password !== password_confirmation) {
          this.error = '两次输入密码不匹配';
          return false;
        }
        addAccessToken().put(createAPI('user/password'),{
            old_password,
            password,
            password_confirmation
          }
        )
        .then(response => {
          const { status = 0, data = { tips: "未知数据"} } = response;
          if(status && status === 204){
            this.$store.dispatch(NOTICE, cb => {
              cb({
                show: true,
                time: 1500,
                status: true,
                text: '密码修改成功'
              });
            });
            this.oldPassword = '';
            this.newPassword = '';
            this.repeatNewPassword = '';

            // 密码修改成功后 // 1. 清除localLoginInfo 并 退回至登录页面 // 2. 直接退出

            // 1.
            // localEvent.clearLocalItem('localLoginInfo');
            // this.changeUrl('/login');

            // 2.
            if(TS_WEB.webSocket){
              TS_WEB.webSocket.close();
            }
            this.$store.dispatch(CLEANUSERFEEDS);
            localEvent.setLocalItem('UserLoginInfo', {});
            this.changeUrl('/login');
          }
        })
        .catch( error => {
          console.log(error);
          const { response = {} } = error;
          const { status = 0, data = {error: "修改密码失败，未知错误"}} = response;
          if( status && status === 422){
            this.$store.dispatch(NOTICE, cb => {
              cb({
                show: true,
                time: 1500,
                status: false,
                text: formatError(data).join("")
              });
            });
          }
        });
      }
    }
  };

  export default changePassword;
</script>
<style scope lang="scss">
  .changePassword-header {
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
  .changePassword-background-color {
    background-color: #fff;
  }
  input {
    width: 100%;
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
