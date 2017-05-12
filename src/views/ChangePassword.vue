<template>
  <div class="changePassword">
    <div class="commonHeader">
      <Row :gutter="16">
        <Col span="3" style="display: flex; justify-content: flex-start" @click.native="goTo(-1)">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="18" class="title-col">
          修改密码
        </Col>
        <Col span="3" style="display: flex;">
          <Button type="text" @click="changePassword" :disabled="!isDisabled">更改</Button>
        </Col>
      </Row>
    </div>
    <div class="changePassword-content changePassword-bakcground-color" :class="$style.entry">
      <Row :gutter="16" :class="$style.entryMenu">
        <Col span="6">
          旧密码
        </Col>
        <Col span="15">
          <input type="password"  size="large" v-show="isShowOldPassword" v-model.trim="oldPassword" placeholder="旧密码" id="password" name="password" />
        </Col>
        <Col span="3">
          <CloseIcon v-show="showOldIcon" height="21" width="21" color="#999" @click.native="cleanOldPassword" />
        </Col>
      </Row>
      <Row :gutter="16" :class="$style.entryMenu">
        <Col span="6">
          新密码
        </Col>
        <Col span="15">
          <input type="password"  size="large" v-show="isShowNewPassword" v-model.trim="newPassword" placeholder="新密码" id="password" name="password" />
          <input type="text"  v-model.trim="newPassword" v-show="!isShowNewPassword" value="" placeholder="确认新密码" />
        </Col>
        <Col span="3">
          <EyeOpenIcon @click.native="handleShowNewPassword" v-show="!isShowNewPassword" height="21" width="21" color="#999" />
          <EyeCloseIcon @click.native="handleShowNewPassword" v-show="isShowNewPassword" height="21" width="21" color="#999" />
        </Col>
      </Row>
      <Row :gutter="16" :class="$style.entryMenu">
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
      <Row :gutter="16">
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
  import { goTo } from '../utils/changeUrl';
  import BackIcon from '../icons/Back';
  import CloseIcon from '../icons/Close';
  import EyeOpenIcon from '../icons/EyeOpen';
  import EyeCloseIcon from '../icons/EyeClose';

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
      error: ''
    }),
    computed: {
      isDisabled () {
        return (this.oldPassword.length > 5) 
                && (this.oldPassword.length < 16) 
                && (this.newPassword.length > 5) 
                && (this.newPassword.length < 16) 
                && (this.newPassword === this.repeatNewPassword);
      },
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
    watch: {

    },
    methods: {
      goTo,
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
        let password = this.oldPassword;
        let new_password = this.newPassword;
        let repeat_password = this.repeatNewPassword;
        if(password.length < 6) {
          this.error = '旧密码长度不能小于6';
          return;
        }
        if(new_password.length < 6) {
          this.error = '新密码长度不能小于6';
          return;
        }
        if(new_password !== repeat_password) {
          this.error = '新密码长度不能小于6';
          return;
        }
        addAccessToken().patch(createAPI('users/password'),{
            password,
            new_password
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then(response => {
          let data = response.data;
          if(data.status || data.code == 0)
          {
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
          }
        })
        .catch( error => {
          let data = error.response.data;
          if(data.code === 1006) {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                show: true,
                time: 1500,
                status: false,
                text: '原密码错误'
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
