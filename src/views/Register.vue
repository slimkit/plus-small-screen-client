<template>
  <div class="container">
    <div class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="5" @click.native="goTo(-1)">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          注册
        </Col>
      </Row>
    </div>
    <div class="main-content">
      <form role="form" @submit.prevent="register">
        <div class="loginForm">
          <Row :gutter="24" class="formChildrenRow bottom-border">
            <Col span="5">
              <label for="username" class="loginFormTitle">用户名</label>
            </Col>
            <Col span="16">
              <input v-focus type="text" maxlength="12" autocomplete="off" placeholder="输入您的用户名" v-model.trim="username" id="username" name="username" />
            </Col>
            <Col span="3" class="flexend">
              <div @click="cleanUsername" v-show="isShowUserClean">
                <CloseIcon height="21" width="21" color="#999" />
              </div>
            </Col>
          </Row>
          <Row :gutter="24" class="formChildrenRow bottom-border">
            <Col span="5">
              <label for="phone" class="loginFormTitle">手机号</label>
            </Col>
            <Col span="14">
              <input type="tel" maxlength="11" autocomplete="off" placeholder="输入手机号码" v-model.trim.num="phone" id="phone" name="phone" />
            </Col>
            <Col span="5" class="flexend">
              <div @click="cleanPhone" v-show="isShowClean">
                <CloseIcon height="21" width="21" color="#999" />
              </div>
            </Col>
          </Row>
          <Row :gutter="24" class="bottom-border formChildrenRow">
            <Col span="5">
              <label for="verifiable_code" class="loginFormTitle">验证码</label>
            </Col>
            <Col :span="11">
              <input type="tel"maxlength="6" autocomplete="off" placeholder="输入验证码" v-model.trim.num="verifiable_code" id="verifiable_code" name="verifiable_code" />
            </Col>
            <Col class="flexend" span="8">
              <Button 
                type="text" 
                @click.native.stop.prevent="getCode" 
                htmlType="button"
                size="large"
                class="text-button nopadding"
                :disabled="!isCanGetCode"
              >
                {{ getCodeText }}
              </Button>
            </Col>
          </Row>
          <Row :gutter="24" class="formChildrenRow">
            <Col span="5">
              <label for="password" class="loginFormTitle">密码</label>
            </Col>
            <Col span="14">
              <input type="password" autocomplete="off" v-show="isShowPassword" v-model.trim="password" placeholder="请输入6位以上密码" id="password" name="password" />
              <input type="text" autocomplete="off" v-model.trim="passwordText" v-show="isShowPasswordText" value="" placeholder="请输入6位以上密码" />
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
                <span style="margin-right: 4px;">注册</span>
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
  import { addAccessToken, createAPI, createOldAPI } from '../utils/request';
  import detecdOS from '../utils/detecdOS';
  import localEvent from '../stores/localStorage';
  import errorCodes from '../stores/errorCodes';
  import deleteObjectItems from '../utils/deleteObjectItems';
  import { getUserInfo, getLoggedUserInfo} from '../utils/user';
  import { USERS_APPEND, MESSAGENOTICE } from '../stores/types';
  import EyeCloseIcon from '../icons/EyeClose';
  import EyeOpenIcon from '../icons/EyeOpen';
  import CloseIcon from '../icons/Close';
  import BackIcon from '../icons/Back';
  import lodash from 'lodash';
  import LoadingWhiteIcon from '../icons/LoadingWhite';
  import { connect } from '../utils/webSocket';
  import { goTo } from '../utils/changeUrl';
  import strLength from '../utils/strLength';

  // 手机号码规则
  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
  const usernameReg = /^[a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9_\u4E00-\u9FA5\uF900-\uFA2D]*$/;
  const codeReg = /^[0-9]{4,6}$/;
  const register = {
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
      username: '', // 昵称
      verifiable_code: '', // 手机验证码
      passwordText: '', // 明文密码
      isDisabled: true, // 提交按钮disabled状态
      isShowClean: false, // 是否显示清除手机号按钮
      isShowUserClean: false,
      isShowPasswordText: false, // 是否显示明文密码
      isShowPassword: true, // 是否显示真实密码
      isCanGetCode: false,
      errors: {}, // 错误对象
      // isValidCode: false, // 验证码合法性
      isValidPhone: false, // 是否合法手机号
      isValidPassword: false, // 是否合法密码
      isValidUsername: true, // 用户名是否合法
      CodeText: '获取验证码', // 获取验证码按钮文字
      time: 0, // 时间倒计时
      isLoading: false, // 登录loading
      isWeiXin: TS_WEB.isWeiXin
    }),
    computed: {
      error: function () {
        let errors = lodash.values(this.errors);
        return errors[0] || '';
      },
      getCodeText () {
        return this.time == 0 ? '获取验证码' : this.time + '秒后重发';
      }
    },
    methods: {
      goTo,
      // 清理请求错误
      cleanErrors () {
        let errors = this.errors;
        let newErrors = deleteObjectItems(errors, [
          'code'
        ]);
        this.errors = { ...newErrors };
      },
      checkIsDisabled () {
         return !(this.isValidPassword && this.isValidPhone  && this.isValidUsername);
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
        this.isCanGetCode = false;
        addAccessToken().post(createAPI('verifycodes/register'), {
            phone
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then( ({ data = {} }) => {
          // 删除网络问题
          this.cleanErrors();
          this.time = 60;
          this.timer();
        })
        .catch(({ response: { data = {} } = {} } ) => {
          this.isCanGetCode = true;
          const { code = 'xxxx' } = data;
          this.isLoading = false;
          this.errors = { ...this.errors, code: errorCodes[code] };
        })
      },
      // 注册
      register () {
        let { username, phone, verifiable_code, password } = this;
        let verifiable_type = 'sms';
        let errors = this.errors;
        // 判断首字符是否为数字
        if(!isNaN(username[0])) {
          this.errors = { ...errors, username: '用户名不能以数字开头' };
          this.isValidUsername = false;
          return false;
        }
        // 判断特殊字符及空格
        if(!usernameReg.test(username)) {
          this.errors = { ...errors, username: '用户名不能包含特殊符号以及空格' };
          this.isValidUsername = false;
          return false;
          // 判断字节数
        } else if( strLength(username) > 48 || strLength(username) < 4) {
          this.errors = { ...errors, username: '用户名不能少于2个中文或4个英文' };
          this.isValidUsername = false;
          return false;
        }
        if(!phoneReg.test(phone)) {
          this.errors = { ...errors, phone: '请输入正确的手机号码' };
          return false;
        }
        if(password.length < 6) {
          this.errors = { ...errors, password: '密码长度必须大于6位' };
          return false;
        }
        let device_code = detecdOS();
        this.isLoading = true;
        this.isDisabled = true;
        addAccessToken().post(createAPI('users'), {
            name: username,
            phone,
            verifiable_code,
            password,
            device_code,
            verifiable_type
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then(({ data = {} }) => {
          window.TS_WEB.currentUserId = data.user_id;
          localEvent.setLocalItem('UserLoginInfo', data);
          this.isLoading = false;
          getLoggedUserInfo().then(user => {
            console.log(user);
            this.$store.dispatch(USERS_APPEND, cb =>{
              cb(user)
            });
            // 设置消息提示查询时间
            let time = 0;
            time = localEvent.getLocalItem('messageFlushTime');
            let nowtime = parseInt(new window.Date().getTime() / 1000);
            if(!time) {
              time = nowtime - 86400;
            }
            let types = 'diggs,comments,follows';
            // 查询新消息
            addAccessToken().get(createOldAPI(`users/flushmessages?key=${types}&time=${time+1}`), {} , {
                validateStatus: status => status === 200
              })
            .then( response => {
              let count = {
                fans: 0,
                diggs: {
                  count: 0,
                  time: '',
                  uids: []
                },
                comments: {
                  count: 0,
                  time: '',
                  uids: []
                },
                notice: 0
              }
              let data = response.data.data;
              for( let index in data ) {
                if(data[index].key === "follows") {
                  count.fans = data[index].count;
                } else if( data[index].key === 'comments') {
                  count.comments.count = data[index].count;
                  count.comments.uids = data[index].uids;
                  count.comments.time = data[index].time;
                } else if( data[index].key === 'diggs') {
                  count.diggs.count = data[index].count;
                  count.diggs.uids = data[index].uids;
                  count.diggs.time = data[index].time;
                } 
              }
              this.$store.dispatch(MESSAGENOTICE, cb => {
                cb(count)
              })
            });
            // 注册im用户， 
            connect();

            router.push({ path: 'feeds' });
          });
        })
        .catch(({ response: { data = {} } = {} } ) => {
          this.isDisabled = false;
          const { code = 'xxxx' } = data;
          this.isLoading = false;
          this.errors = { ...this.errors, code: errorCodes[code] };
        })
      }
    },
    watch: {
      username: function (newUsername) {
        this.cleanErrors();
        this.isShowUserClean = newUsername.length > 0 ? true : false;
        let errors = this.errors;
        delete errors['username'];
        this.errors = { ...errors };
        this.isValidUsername = true;
        this.isDisabled = this.checkIsDisabled();
      },
      phone: function (newPhone) {
        this.cleanErrors();
        this.isShowClean = (newPhone > 0) > 0 ? true : false;
        let errors = this.errors;
        if(!phoneReg.test(newPhone)) {
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
          this.isValidPassword = false;
        } else {
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = { ...errors };
        }
        this.passwordText = newPassword;
        this.isDisabled = this.checkIsDisabled();
      },
      passwordText: function (newPasswordText) {
        this.cleanErrors();
        let errors = this.errors;
        if(newPasswordText.length < 6) {
          this.isValidPassword = false;
        } else {
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = { ...errors };
        }
        this.password = newPasswordText;
        this.isDisabled = this.checkIsDisabled();
      }
      // ,
      // code: function (newCode) {
      //   this.cleanErrors();
      //   let errors = this.errors;
      //   if(!codeReg.test(newCode)) {
      //     this.isValidCode = false;
      //   } else {
      //     this.isValidCode = true;
      //     delete errors['code'];
      //     this.errors = { ...errors };
      //   }
      //   this.isDisabled = this.checkIsDisabled();
      // }
    }
  }

  export default register;

</script>

<style scoped lang="scss">
  input {
    padding: 5px 0
  }
</style>
