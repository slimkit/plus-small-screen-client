<template>
  <div class="container">
    <!-- <header class="header">
      <el-row justify="start" type="flex" align="middle">
        <el-col :span="3" class="close back">
          <i class="el-icon-close"></i>
        </el-col>
        <el-col :span="17"><div class="grid-content bg-purple-light title ">登录</div></el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light right-top-button">
            <router-link to="/register">注册</router-link>
          </div>
        </el-col>
      </el-row>
    </header> -->
    <div class="main-content">
      <form role="form" @submit.prevent="submit">
        <div class="loginForm">
          <el-row class="bottom-border formChildrenRow" justify="start" type="flex" align="middle">
            <el-col :span="4" offset="1">
              <label for="phone" :class="loginFormTitle">手机号</label>
            </el-col>
            <el-col :span="16">
              <input type="tel" autocomplete="off" placeholder="请输入手机号" v-model.number.trim="phone" id="phone" name="phone" value="{{ phone }}" />
            </el-col>
            <el-col :span="1" offset="1">
              <i v-on:click="cleanPhone" v-show="isShowClean" class="el-icon-circle-close"></i>
            </el-col>
          </el-row>
          <el-row class="formChildrenRow" justify="start" type="flex" align="middle">
            <el-col :span="4" offset="1">
              <label for="password" :class="loginFormTitle">密码</label>
            </el-col>
            <el-col :span="16">
              <input type="password" v-show="isShowPassword" v-model.trim="password" placeholder="请输入6位以上密码" id="password" name="password" />
              <input type="text"  v-model.trim="passwordText" v-show="isShowPasswordText" value="" placeholder="请输入6位以上密码" />
            </el-col>
            <el-col :span="1" offset="1">
              <i v-on:click="showPassword" :class="{ 'el-icon-arrow-up': isShowPasswordText, 'el-icon-arrow-down': isShowPassword }"></i>
            </el-col>
          </el-row>
        </div>
        <div id="notice">
          <el-row justify="start" type="flex" align="middle">
            <el-col :span="22" offset="1">
              <p class="notice error">{{ error }}</p>
            </el-col>
          </el-row>
        </div>
        <div :class="operation">
         <el-row justify="start" type="flex" align="middle">
            <el-col :span="22" offset="1">
              <el-button type="primary" native-type="submit" :loading="isLoading" :disabled="isDisabled" class="loginButton" size="large">登录</el-button>
            </el-col>
          </el-row>
        </div>
      </form>
      <div class="otherOperation">
        <el-row justify="start" type="flex">
          <el-col :span="12" offset="1">
            <router-link to="/register">
              注册账号
            </router-link>
          </el-col>
          <el-col :span="10">
            <router-link style="float: right" to="/findpassword">
              找回密码
            </router-link>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import request, { createAPI } from '../utils/request';
  import localEvent from '../stores/localStorage';
  import router from '../routers/index';
  import detecdOS from '../utils/detecdOS';
  import errorCodes from '../stores/errorCodes';
  import deleteObjectItems from '../utils/deleteObjectItems';

  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
  const login = {
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
          this.errors = Object.assign({}, this.errors, { phone: '请输入正确的手机号码' });
          this.isValidPhone = false;
        } else {
          let errors = this.errors;
          this.isValidPhone = true;
          delete errors['phone'];
          this.errors = Object.assign({}, errors);
        }
        this.isDisabled = this.checkIsDisabled()
      },
      password: function (newPassword) {
        this.cleanErrors();
        if(newPassword.length < 6) {
          this.errors = Object.assign({}, this.errors, { password: '密码长度必须大于6位' })
          this.isValidPassword = false;
        } else {
          let errors = this.errors;
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = Object.assign({}, errors);
        }
        this.passwordText = newPassword;
        this.isDisabled = this.checkIsDisabled()
      },
      passwordText: function (newPasswordText) {
        this.cleanErrors();
        if(newPasswordText.length < 6) {
          this.errors = Object.assign({}, this.errors, { password: '密码长度必须大于6位' })
          this.isValidPassword = false;
        } else {
          let errors = this.errors;
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = Object.assign({}, errors);
        }
        this.password = newPasswordText;
        this.isDisabled = this.checkIsDisabled();
      }
    },
    computed: {
      error: function () {
        let errors = Object.values(this.errors);
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
        this.errors = Object.assign({}, newErrors);
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
          let errors = {};
          this.errors = Object.assign({}, errors);
          localEvent.setLocalItem('UserLoginInfo', response.data.data);
          setTimeout(() => {
            router.push({ path: 'feeds' })
          }, 500);
        })
        .catch(({ response: { data = {} } = {} } ) => {
          this.isDisabled = false;
          const { code = 'xxxx' } = data;
          this.isLoading = false;
          this.errors = Object.assign({}, this.errors, { code: errorCodes[code] });
        });
      }
    }
  };

  export default login;

</script>
