<template>
  <div class="container">
    <div class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="5" @click.native="goTo(-1)">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          忘记密码
        </Col>
      </Row>
    </div>
    <div class="main-content">
      <form role="form" @submit.prevent="submit">
        <div class="loginForm">
          <Row :gutter="24" class="formChildrenRow bottom-border">
            <Col span="5">
              <label for="phone" class="loginFormTitle">手机号</label>
            </Col>
            <Col span="14">
              <input v-focus type="tel" maxlength="12" autocomplete="off" placeholder="输入手机号码" v-model.trim.num="phone" id="phone" name="phone" />
            </Col>
            <Col span="5" class="flexend">
              <div @click="cleanPhone" v-show="isShowClean">
                <CloseIcon height="21" width="21" color="#999" />
              </div>
            </Col>
          </Row>
          <Row :gutter="24" class="formChildrenRow bottom-border">
            <Col span="5">
              <label for="code" class="loginFormTitle">验证码</label>
            </Col>
            <Col span="11">
              <input type="tel" maxlength="6" autocomplete="off" placeholder="4-6位数字" v-model.number.trim="code" id="code" name="code" />
            </Col>
            <Col class="flexend" span="8" >
              <Button 
                type="text" 
                @click.native="getCode" 
                htmlType="button" 
                :disabled="!isCanGetCode" 
                size="large"
                class="text-button nopadding"
              >
                {{ getCodeText }}
              </Button>
            </Col>
          </Row>
          <Row :gutter="24" class="formChildrenRow">
            <Col span="5">
              <label for="password" class="loginFormTitle">新密码</label>
            </Col>
            <Col span="14">
              <input type="password" v-show="isShowPassword" v-model.trim="password" placeholder="登录密码至少6位" id="password" name="password" />
              <input type="text"  v-model.trim="passwordText" v-show="isShowPasswordText" value="" placeholder="登录密码至少6位" />
            </Col>
            <Col span="5" class="flexend">
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
          <Row :gutter="24">
            <Col span="24">
              <p class="notice error">{{ error }}</p>
            </Col>
          </Row>
        </div>
        <div class="operation">
         <Row :gutter="24">
            <Col span="24">
              <Button type="primary" htmlType="submit" :disabled="isDisabled" class="loginButton" size="large">
                <span style="margin-right: 4px;">确认</span>
                <LoadingWhiteIcon v-show="isLoading" height="20" width="20" />
              </Button>
            </Col>
          </Row>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import router from '../routers/index';
  import request, { createAPI } from '../utils/request';
  import detecdOS from '../utils/detecdOS';
  import localEvent from '../stores/localStorage';
  import errorCodes from '../stores/errorCodes';
  import deleteObjectItems from '../utils/deleteObjectItems';
  import EyeCloseIcon from '../icons/EyeClose';
  import EyeOpenIcon from '../icons/EyeOpen';
  import CloseIcon from '../icons/Close';
  import BackIcon from '../icons/Back';
  import lodash from 'lodash';
  import LoadingWhiteIcon from '../icons/LoadingWhite';
  import { NOTICE } from '../stores/types';
  import { goTo } from '../utils/changeUrl';

  // 手机号码规则
  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
  const codeReg = /^[0-9]{4,6}$/;
  const findPassword = {
    components: {
      EyeCloseIcon,
      EyeOpenIcon,
      CloseIcon,
      LoadingWhiteIcon,
      BackIcon
    },
    data: () => ({
      phone: '', // 手机号码 
      password: '', // 密码
      code: '', // 手机验证码
      passwordText: '', // 明文密码
      isDisabled: true, // 提交按钮disabled状态
      isShowClean: false, // 是否显示清除手机号按钮
      isShowPasswordText: false, // 是否显示明文密码
      isShowPassword: true, // 是否显示真实密码
      isCanGetCode: false,
      errors: {}, // 错误对象
      isValidCode: false, // 验证码合法性
      isValidPhone: false, // 是否合法手机号
      isValidPassword: false, // 是否合法密码
      CodeText: '获取验证码', // 获取验证码按钮文字
      time: 0, // 时间倒计时
      isLoading: false, // 登录loading
      isWeiXin: TS_WEB.isWeiXin
    }),
    methods: {
      goTo,
      // 清理请求错误
      cleanErrors () {
        let errors = this.errors;
        let newErrors = deleteObjectItems(errors, [
          'serverError'
        ]);
        this.errors = { ...this.errors, ...newErrors };
      },
      checkIsDisabled () {
         return !(this.isValidPassword && this.isValidPhone && this.isValidCode);
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
        let type = 'change';
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
          this.errors = { ...this.errors, serverError: errorCodes[code] };
        })
      },
      submit () {
        let { phone, code, password } = this;
        if(!phoneReg.test(phone)) {
          this.errors = { ...errors, phone: '请输入正确的手机号码' };
          return false;
        }
        if(!codeReg.test(code)) {
          this.errors = { ...errors, code: '验证码为4-6位数字' };
          return false;
        }
        if(password.length < 6) {
          this.errors = { ...errors, password: '密码长度必须大于6位' };
          return false;
        }
        this.isLoading = true;
        this.isDisabled = true;
        request.patch(createAPI('auth/forgot'), {
            phone,
            code,
            password
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then(response => {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              show: true,
              status: true,
              time: 1500,
              text: '密码重置成功'
            })
          });
          this.phone = '';
          this.password = '';
          this.code = '';
          this.passwordText = '';
          this.isDisabled = true;
          this.isLoading = false;
          this.time = 0;
          this.isCanGetCode = false;
        })
        .catch(({ response: { data = {} } = {} } ) => {
          this.isDisabled = false;
          const { code = 'xxxx' } = data;
          this.isLoading = false;
          this.errors = { ...this.errors, serverError: errorCodes[code] };
        })
      }
    },
    computed: {
      error: function () {
        let errors = lodash.values(this.errors);
        return errors[0] || '';
      },
      getCodeText () {
        return this.time == 0 ? '获取验证码' : this.time + '秒后重发';
      }
    },
    watch: {
      phone: function (newPhone) {
        this.cleanErrors();
        this.isShowClean = (newPhone > 0) > 0 ? true : false;
        let errors = this.errors;
        if(!phoneReg.test(newPhone)) {
          // this.errors = { ...errors, phone: '请输入正确的手机号码' };
          this.isValidPhone = false;
          this.isCanGetCode = false;
        } else {
          this.isValidPhone = true;
          this.isCanGetCode = true;
          delete errors['phone'];
          this.errors = { ...errors };
        }

        this.isDisabled = this.checkIsDisabled();
      },
      password: function (newPassword) {
        this.cleanErrors();
        let errors = this.errors;
        if(newPassword.length < 6) {
          // this.errors = { ...errors, password: '密码长度必须大于6位' };
          this.isValidPassword = false;
        } else {
          this.isValidPassword = true;
          delete errors['password'];
          this.errors =  { ...errors };
        }
        this.passwordText = newPassword;
        this.isDisabled = this.checkIsDisabled();
      },
      passwordText: function (newPasswordText) {
        this.cleanErrors();
        let errors = this.errors;
        if(newPasswordText.length < 6) {
          // this.errors = { ...errors, password: '密码长度必须大于6位' };
          this.isValidPassword = false;
        } else {
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = { ...errors };
        }
        this.password = newPasswordText;
        this.isDisabled = this.checkIsDisabled();
      },
      code: function (newCode) {
        this.cleanErrors();
        let errors = this.errors;
        if(!codeReg.test(newCode)) {
          // this.errors = { ...errors, code: '验证码为4-6位数字' };
          this.isValidCode = false;
        } else {
          this.isValidCode = true;
          delete errors['code'];
          this.errors = { ...errors };
        }
        this.isDisabled = this.checkIsDisabled();
      }
    }
  }

  export default findPassword;

</script>
