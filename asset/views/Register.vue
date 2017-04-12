<template>
  <transition name="slide-left">
    <div class="container">
      <div class="main-content">
        <form role="form" @submit.prevent="register">
          <div class="loginForm">
            <Row :gutter="16" class="formChildrenRow bottom-border">
              <Col span="5">
                <label for="username" class="loginFormTitle">用户名</label>
              </Col>
              <Col span="16">
                <input type="text" autocomplete="off" placeholder="不能以数字开头,不能有特殊字符" v-model.trim="username" id="username" name="username" />
              </Col>
              <Col span="3" class="flexend">
                <i v-on:click="cleanUsername" v-show="isShowUserClean" class="ivu-icon ivu-icon-close-circled"></i>
              </Col>
            </Row>
            <Row :gutter="16" class="formChildrenRow bottom-border">
              <Col span="5">
                <label for="phone" class="loginFormTitle">手机号</label>
              </Col>
              <Col span="10">
                <input type="tel" autocomplete="off" placeholder="输入手机号码" v-model.trim.num="phone" id="phone" name="phone" />
              </Col>
              <Col span="3" class="flexend">
                <i v-on:click="cleanPhone" v-show="isShowClean" class="ivu-icon ivu-icon-close-circled"></i>
              </Col>
              <Col class="text-align-right flexend" span="6">
                <Button 
                  type="text" 
                  @click.native.stop.prevent="getCode" 
                  htmlType="button"
                  size="large"
                  class="text-button nopadding"
                >
                  {{ getCodeText }}
                </Button>
              </Col>
            </Row>
            <Row :gutter="16" class="bottom-border formChildrenRow">
              <Col span="5">
                <label for="code" class="loginFormTitle">验证码</label>
              </Col>
              <Col :span="19">
                <input type="tel" autocomplete="off" placeholder="输入验证码" v-model.trim.num="code" id="code" name="code" />
              </Col>
            </Row>
            <Row :gutter="16" class="formChildrenRow">
              <Col span="5">
                <label for="password" class="loginFormTitle">密码</label>
              </Col>
              <Col span="16">
                <input type="password" autocomplete="off" v-show="isShowPassword" v-model.trim="password" placeholder="请输入6位以上密码" id="password" name="password" />
                <input type="text" autocomplete="off" v-model.trim="passwordText" v-show="isShowPasswordText" value="" placeholder="请输入6位以上密码" />
              </Col>
              <Col span="3" class="flexend">
                <i v-on:click="showPassword" class="ivu-icon" :class="{ 'ivu-icon-eye-disabled': isShowPasswordText, 'ivu-icon-eye': isShowPassword }"></i>
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
          <div class="operation">
           <Row :gutter="16">
              <Col span="24">
                <Button type="primary" :loading="isLoading" htmlType="submit" :disabled="isDisabled" class="loginButton" size="large">注册</Button>
              </Col>
            </Row>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
  import router from '../routers/index';
  import request, { createAPI } from '../utils/request';
  import detecdOS from '../utils/detecdOS';
  import localEvent from '../stores/localStorage';
  import errorCodes from '../stores/errorCodes';
  import deleteObjectItems from '../utils/deleteObjectItems';
  import { getUserInfo } from '../utils/user';
  import { USERS_APPEND } from '../stores/types';

  // 手机号码规则
  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
  const usernameReg = /^[a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9_\u4E00-\u9FA5\uF900-\uFA2D]*$/;
  const codeReg = /^[0-9]{4}$/;
  const register = {
    data: () => ({
      phone: '', // 手机号码 
      password: '', // 密码
      username: '', // 昵称
      code: '', // 手机验证码
      passwordText: '', // 明文密码
      isDisabled: true, // 提交按钮disabled状态
      isShowClean: false, // 是否显示清除手机号按钮
      isShowUserClean: false,
      isShowPasswordText: false, // 是否显示明文密码
      isShowPassword: true, // 是否显示真实密码
      isCanGetCode: false,
      errors: {}, // 错误对象
      isValidCode: false, // 验证码合法性
      isValidPhone: false, // 是否合法手机号
      isValidPassword: false, // 是否合法密码
      isValidUsername: false, // 用户名是否合法
      CodeText: '获取验证码', // 获取验证码按钮文字
      time: 0, // 时间倒计时
      isLoading: false // 登录loading
    }),
    computed: {
      error: function () {
        let errors = Object.values(this.errors);
        return errors[0] || '';
      },
      getCodeText () {
        return this.time == 0 ? '获取验证码' : this.time + '秒后重发';
      }
    },
    methods: {
      // 清理请求错误
      cleanErrors () {
        let errors = this.errors;
        let newErrors = deleteObjectItems(errors, [
          'serverError'
        ]);
        this.errors = Object.assign({}, newErrors);
      },
      checkIsDisabled () {
         return !(this.isValidPassword && this.isValidPhone && this.isValidCode && this.isValidUsername);
      },
      timer () {
        if (this.time > 0) {
          this.isCanGetCode = false;
          this.time -= 1;
          if(this.time == 0) {
            this.isCanGetCode = true;
            return;
          }
          setTimeout(this.timer, 1000)
        }
      },
      cleanPhone () {
        this.phone = '';
      },
      cleanUsername () {
        this.username = '';
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
      // 获取验证码
      getCode () {
        let phone = this.phone;
        let type = 'register';
        this.isCanGetCode = false;
        request.post(createAPI('auth/phone/send-code'), {
            phone,
            type
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then(response => {
          if(response.data.code === 0 || response.data.status) {
            // 删除网络问题
            this.cleanErrors();
            this.time = 60;
            this.timer();
          }
        })
        .catch(({ response: { data = {} } = {} }) => {
          this.isCanGetCode = true;
          const { code = 'xxxx' } = data;
          this.errors = Object.assign({}, this.errors, { serverError: errorCodes[code]});
        })
      },
      // 注册
      register () {
        let { username, phone, code, password } = this;
        let device_code = detecdOS();
        this.isLoading = true;
        this.isDisabled = true;
        request.post(createAPI('auth/register'), {
            name: username,
            phone,
            code,
            password,
            device_code
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then(response => {
          localEvent.setLocalItem('UserLoginInfo', response.data.data);
          this.isLoading = false;
          this.$store.dispatch(USERS_APPEND, cb => getUserInfo(response.data.data.user_id, user => {
            cb(user);
            router.push({ path: 'feeds' });
          }));
          
        })
        .catch(({ response: { data = {} } = {} } ) => {
          this.isDisabled = false;
          const { code = 'xxxx' } = data;
          this.isLoading = false;
          this.errors = Object.assign({}, this.errors, { serverError: errorCodes[code] });
        })
      }
    },
    watch: {
      username: function (newUsername) {
        this.cleanErrors();
        this.isShowUserClean = newUsername.length > 0 ? true : false;
        let errors = this.errors;
        if(!usernameReg.test(newUsername)) {
          this.errors = Object.assign({}, errors, { username: '用户名不能包含特殊符号以及空格'});
          this.isValidUsername = false;
        } else if( newUsername.length > 12 || newUsername.length < 3) {
          this.errors = Object.assign({}, errors, { username: '请输入3-12位用户名'});
          this.isValidUsername = false;
        } else {
          delete errors['username'];
          this.errors = Object.assign({}, errors);
          this.isValidUsername = true;
        }
        this.isDisabled = this.checkIsDisabled();
      },
      phone: function (newPhone) {
        this.cleanErrors();
        this.isShowClean = (newPhone > 0) > 0 ? true : false;
        let errors = this.errors;
        if(!phoneReg.test(newPhone)) {
          this.errors = Object.assign({}, errors, { phone: '请输入正确的手机号码'});
          this.isValidPhone = false;
          this.isCanGetCode = false;
        } else {
          this.isValidPhone = true;
          this.isCanGetCode = true;
          delete errors['phone'];
          this.errors = Object.assign({}, errors);
        }

        this.isDisabled = this.checkIsDisabled();
      },
      password: function (newPassword) {
        this.cleanErrors();
        let errors = this.errors;
        if(newPassword.length < 6) {
          this.errors = Object.assign({}, errors, { password: '密码长度必须大于6位'})
          this.isValidPassword = false;
        } else {
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = Object.assign({}, errors);
        }
        this.passwordText = newPassword;
        this.isDisabled = this.checkIsDisabled();
      },
      passwordText: function (newPasswordText) {
        this.cleanErrors();
        let errors = this.errors;
        if(newPasswordText.length < 6) {
          this.errors = Object.assign({}, errors, { password: '密码长度必须大于6位'})
          this.isValidPassword = false;
        } else {
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = Object.assign({}, errors);
        }
        this.password = newPasswordText;
        this.isDisabled = this.checkIsDisabled();
      },
      code: function (newCode) {
        this.cleanErrors();
        let errors = this.errors;
        if(!codeReg.test(newCode)) {
          this.errors = Object.assign({}, errors, { code: '验证码错误'});
          this.isValidCode = false;
        } else {
          this.isValidCode = true;
          delete errors['code'];
          this.errors = Object.assign({}, errors);
        }
        this.isDisabled = this.checkIsDisabled();
      }
    }
  }

  export default register;

</script>
