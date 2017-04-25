<template>
  <transition name="slide-left">
    <div class="container">
      <!-- <header class="header">
        <Row justify="start" type="flex" align="middle">
          <Col :span="3" class="close back">
            <i class="el-icon-close"></i>
          </Col>
          <Col :span="17"><div class="grid-content bg-purple-light title ">登录</div></Col>
          <Col :span="4">
            <div class="grid-content bg-purple-light right-top-button">
              <router-link to="/register">注册</router-link>
            </div>
          </Col>
        </Row>
      </header> -->
      <div class="main-content">
        <form role="form" @submit.prevent="submit">
          <div class="loginForm">
            <Row  class="bottom-border formChildrenRow" :gutter="16">
              <Col span="5">
                <label for="phone">手机号</label>
              </Col>
              <Col span="16">
                <input type="tel" size="large" autocomplete="off" placeholder="请输入手机号" v-model.number.trim="phone" id="phone" name="phone" />
              </Col>
              <Col span="3" class="flexend">
                <!-- <i @click="cleanPhone" v-show="isShowClean" class="ivu-icon ivu-icon-close-circled"></i> -->
                <div @click="cleanPhone" v-show="isShowClean">
                  <CloseIcon width="21" height="21" color="#999" />
                </div>
              </Col>
            </Row>
            <Row class="formChildrenRow" :gutter="16" >
              <Col span="5">
                <label for="password">密码</label>
              </Col>
              <Col span="16">
                <input type="password"  size="large" v-show="isShowPassword" v-model.trim="password" placeholder="请输入6位以上密码" id="password" name="password" />
                <input type="text"  v-model.trim="passwordText" v-show="isShowPasswordText" value="" placeholder="请输入6位以上密码" />
              </Col>
              <Col span="3" class="flexend">
                <!-- i @click="showPassword" class="ivu-icon" :class="{ 'ivu-icon-eye-disabled': isShowPasswordText, 'ivu-icon-eye': isShowPassword }"></i> -->
                <div @click="showPassword" v-show="isShowPasswordText">
                  <EyeOpenIcon height="21" width="21" color="#999" />
                </div>
                <div @click="showPassword" v-show="isShowPassword">
                  <EyeCloseIcon height="21" width="21" color="#999" />
                </div>
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
          <div>
           <Row :gutter="16" >
              <Col span="24">
                <Button type="primary" htmlType="submit" :loading="isLoading" :disabled="isDisabled" class="loginButton" size="large">登录</Button>
              </Col>
            </Row>
          </div>
        </form>
        <div class="otherOperation">
          <Row :gutter="16" >
            <Col span="12" >
              <router-link to="/register">
                注册账号
              </router-link>
            </Col>
            <Col span="12">
              <router-link style="float: right" to="/findpassword">
                找回密码
              </router-link>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import request, { createAPI } from '../utils/request';
  import localEvent from '../stores/localStorage';
  import router from '../routers/index';
  import detecdOS from '../utils/detecdOS';
  import errorCodes from '../stores/errorCodes';
  import deleteObjectItems from '../utils/deleteObjectItems';
  import { getUserInfo } from '../utils/user';
  import { USERS_APPEND } from '../stores/types';
  import defaultAvatar from '../statics/images/defaultAvatarx2.png';
  import EyeCloseIcon from '../icons/EyeClose';
  import EyeOpenIcon from '../icons/EyeOpen';
  import CloseIcon from '../icons/Close';
  import lodash from 'lodash';


  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
  const login = {
    components: {
      EyeCloseIcon,
      EyeOpenIcon,
      CloseIcon
    },
    data: () => ({
      phone: '', // 手机号码 
      password: '', // 密码
      passwordText: '', // 明文密码
      isDisabled: true, // 提交按钮disabled状态
      isValidPhone: false, // 是否合法手机号
      isValidPassword: false, // 是否合法密码
      isShowClean: false, // 是否显示清除手机号按钮
      isShowPasswordText: false, // 是否显示明文密码
      isShowPassword: true, // 是否显示真实密码
      errors: {}, // 错误对象
      isLoading: false // 登录loading
    }),
    watch: {
      phone: function (newPhone) {
        this.isShowClean = (newPhone > 0) > 0 ? true : false;
        this.cleanErrors();
        if(!phoneReg.test(newPhone)) {
          this.errors = { ...this.errors, phone: '请输入正确的手机号码' };
          this.isValidPhone = false;
        } else {
          let errors = this.errors;
          this.isValidPhone = true;
          delete errors['phone'];
          this.errors = { ...errors };
        }
        this.isDisabled = this.checkIsDisabled()
      },
      password: function (newPassword) {
        this.cleanErrors();
        if(newPassword.length < 6) {
          this.errors = { ...this.errors, password: '密码长度必须大于6位' };
          this.isValidPassword = false;
        } else {
          let errors = this.errors;
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = { ...errors };
        }
        this.passwordText = newPassword;
        this.isDisabled = this.checkIsDisabled()
      },
      passwordText: function (newPasswordText) {
        this.cleanErrors();
        if(newPasswordText.length < 6) {
          this.errors = { ...this.errors, password: '密码长度必须大于6位' };
          this.isValidPassword = false;
        } else {
          let errors = this.errors;
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = { ...errors };
        }
        this.password = newPasswordText;
        this.isDisabled = this.checkIsDisabled();
      }
    },
    computed: {
      error: function () {
        let errors = lodash.values(this.errors);
        return errors[0] || '';
      }
    },
    methods: {
      // 清理服务端错误信息
      cleanErrors () {
        let errors = this.errors;
        let newErrors = deleteObjectItems(errors, [
          'code'
        ]);
        this.errors = { ...newErrors };
      },
      checkIsDisabled () {
         return !(this.isValidPassword && this.isValidPhone);
      },
      cleanPhone () {
        this.phone = '';
      },
      showPassword () {
        if(this.isShowPassword) {
          this.isShowPassword = false;
          this.isShowPasswordText = true;
        } else {
          this.isShowPassword = true;
          this.isShowPasswordText = false;
        }
      },
      submit () {
        console.log(this.$route);
        let redirect = this.$route.query.redirect ? this.$route.query.redirect : 'feeds';
        console.log(redirect);
        // return;
        let { phone, password } = this;
        let device_code = detecdOS();
        this.isLoading = true;
        this.isDisabled = true;
        request.post(createAPI('auth'), {
            phone,
            password,
            device_code
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then(response => {
          this.errors = {};
          localEvent.setLocalItem('UserLoginInfo', response.data.data);
          getUserInfo(response.data.data.user_id, 30, user => {
            localEvent.setLocalItem('user_' + response.data.data.user_id, user);
            router.push({ path: redirect });
          });
        })
        .catch(({ response: { data = {} } = {} } ) => {
          this.isDisabled = false;
          const { code = 'xxxx' } = data;
          this.isLoading = false;
          this.errors = { ...this.errors, code: errorCodes[code] };
        });
      }
    }
  };

  export default login;

</script>
