<template>
  <div class="container">
    <div class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="5" @click.native="goTo(-1)">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="16" class="title-col">
          {{reg_type}}注册
        </Col>
        <Col span="3" style="color: #59b6d7; padding-left: 0">
          <span @click="changeType">{{reg_type === "手机" ? "邮箱" : "手机"}}</span>
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
              <div @click="username = ''" v-show="username.length > 0">
                <CloseIcon height="21" width="21" color="#999" />
              </div>
            </Col>
          </Row>
          <Row v-if="verifiable_type === 'sms'" :gutter="24" class="formChildrenRow bottom-border">
            <Col span="5">
              <label for="phone" class="loginFormTitle">手机号</label>
            </Col>
            <Col span="14">
              <input type="tel" maxlength="11" autocomplete="off" placeholder="输入手机号码" v-model.trim.num="phone" id="phone" name="phone" />
            </Col>
            <Col span="5" class="flexend">
              <div @click="phone = ''" v-show="phone.length > 0">
                <CloseIcon height="21" width="21" color="#999" />
              </div>
            </Col>
          </Row>
          <Row v-else :gutter="24" class="formChildrenRow bottom-border">
            <Col span="5">
              <label for="email" class="loginFormTitle">邮箱</label>
            </Col>
            <Col span="14">
              <input type="email" autocomplete="off" placeholder="输入邮箱账号" v-model.trim.num="email" id="email" name="email" />
            </Col>
            <Col span="5" class="flexend">
              <div @click="email = ''" v-show="email.length > 0">
                <CloseIcon height="21" width="21" color="#999" />
              </div>
            </Col>
          </Row>
          <Row :gutter="24" class="bottom-border formChildrenRow">
            <Col span="5">
              <label for="verifiable_code" class="loginFormTitle">验证码</label>
            </Col>
            <Col :span="11">
              <input type="tel" maxlength="6" autocomplete="off" placeholder="输入验证码" v-model.trim.num="verifiable_code" id="verifiable_code" name="verifiable_code" />
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
              <input v-if="isShowPassword" type="password" autocomplete="off" v-model.trim="password" placeholder="请输入6位以上密码" id="password" name="password" />
              <input v-else type="text" autocomplete="off" v-model.trim="password" placeholder="请输入6位以上密码" id="password" name="password" />
            </Col>
            <Col span="5" class="flexend">
              <div @click="isShowPassword = !isShowPassword">
                <EyeCloseIcon v-if="isShowPassword" height='21' width="21" />
                <EyeOpenIcon v-else height='21' width="21" />
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
  import lodash from 'lodash';
  import router from '../routers/index';
  import { USERS_APPEND, MESSAGENOTICE } from '../stores/types';

  import BackIcon from '../icons/Back';
  import CloseIcon from '../icons/Close';
  import EyeOpenIcon from '../icons/EyeOpen';
  import EyeCloseIcon from '../icons/EyeClose';
  import LoadingWhiteIcon from '../icons/LoadingWhite';

  import PlusMessageBundle from '../utils/es';
  import detecdOS from '../utils/detecdOS';
  import { goTo } from '../utils/changeUrl';
  import strLength from '../utils/strLength';
  import { connect } from '../utils/webSocket';
  import { getUserInfo, getLoggedUserInfo} from '../utils/user';
  import { addAccessToken, createAPI, createOldAPI } from '../utils/request';

  // 手机号码规则
  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
  // 邮箱验证
  const emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  // 用户名验证
  const usernameReg = /^[a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9_\u4E00-\u9FA5\uF900-\uFA2D]*$/;
  // 验证码
  const codeReg = /^[0-9]{4,6}$/;

  // 验证方式
  const SMS = "sms", // 手机
        EMAIL = "mail"; // 邮箱

  const register = {
    components: {
      BackIcon,
      CloseIcon,
      EyeOpenIcon,
      EyeCloseIcon,
      LoadingWhiteIcon,
    },
    data: () => ({
      phone: '', // 手机号码 
      email: '', // 邮箱 
      password: '', // 密码
      username: '', // 昵称
      verifiable_code: '', // 手机验证码
      verifiable_type: SMS,
      reg_type: "手机",

      isShowPassword: true, // 是否显示真实密码
      isCanGetCode: false,

      errors: {}, // 错误对象
      error: "", // 错误提示
      errorKey: "", // 错误类型
      // isValidCode: false, // 验证码合法性

      isValidEmail: false, // 邮箱号验证
      isValidPhone: false, // 是否合法手机号
      isValidUsername: false, // 用户名是否合法
      isValidPassword: false, // 是否合法密码

      CodeText: '获取验证码', // 获取验证码按钮文字

      time: 0, // 时间倒计时

      isLoading: false, // 登录loading
      isDisabled: true,

      isWeiXin: TS_WEB.isWeiXin
    }),
    computed: {
      getCodeText () {
        return this.time == 0 ? '获取验证码' : this.time + '秒后重发';
      }
    },
    methods: {
      goTo,

      clearError(key){
        key = key || this.errorKey;
        let errors = this.errors;
        if(errors[key]){
          delete errors[key];
          this.errors = { ...errors };
        }
      },
      timer () {

        this.isCanGetCode = false;
        this.time--;

        return this.time > 0 ?
          setTimeout(this.timer, 1000):
          this.isCanGetCode = true;
      },

      changeType(){
        this.verifiable_type = (this.verifiable_type === SMS) ?
          EMAIL : SMS;
      },

      // 获取验证码
      getCode () {
        this.isCanGetCode = false;
        const phone = this.phone,
              email = this.email;
        let param = {
          phone,
          email
        };

        (this.verifiable_type === SMS) ? delete param.email : delete param.phone;

        addAccessToken().post(createAPI('verifycodes/register'), param,
          {
            validateStatus: status => status === 202
          }
        )
        .then(() => {
          this.time = 60;
          this.timer();
        })
        .catch( ({response:{ status = null, data:{ errors = {} } = {}} = {}}) => {
          this.isCanGetCode = true;
          this.isLoading = false;
          if( status === 500 ) {
            this.errors = { phone: '网络错误,请联系管理员', ...this.errors };
            return;
          }
          if( status === 422) {
            this.errors = { ...errors, ...this.errors };
          }
        })
      },

      checkIsDisabled(){
        return !((this.isValidPassword && this.isValidUsername) ? ((this.verifiable_type === SMS) ? this.isValidPhone : this.isValidEmail) : false);
      },

      // 注册
      register () {
        this.clearError();
        this.isLoading = true;
        this.isDisabled = true;

        const { username, phone, email, verifiable_code, password, verifiable_type } = this._data;

        let errors = this.errors;

        // 判断特殊字符及空格
        if(!usernameReg.test(username)) {
          this.errors = { name: '用户名不能包含特殊符号以及空格', ...this.errors };
          this.isValidUsername = false;
          return this.isLoading = false;
        }

        // 判断首字符是否为数字
        if(!isNaN(username[0])) {
          this.errors = { name: '用户名不能以数字开头', ...this.errors };
          this.isValidUsername = false;
          return this.isLoading = false;
        }
        
        // 判断字节数
        if( strLength(username) > 48 || strLength(username) < 4) {
          this.errors = { name: '用户名不能少于2个中文或4个英文', ...this.errors };
          this.isValidUsername = false;
          return this.isLoading = false;
        }

        // 手机号
        if( verifiable_type === SMS && !phoneReg.test(phone)) {
          this.errors = { phone: '请输入正确的手机号码', ...this.errors };
          return this.isLoading = false;
        }

        // 邮箱
        if( verifiable_type !== SMS && !emailReg.test(email)) {
          this.errors = { email: '请输入正确的邮箱号码', ...this.errors };
          return this.isLoading = false;
        }

        // 密码长度
        if(password.length < 6) {
          this.errors = { password: '密码长度必须大于6位', ...this.errors };
          return this.isLoading = false;
        }

        // 获取设备码
        let device_code = detecdOS();

        let param = {
            name: username,
            phone,
            email,
            verifiable_code,
            password,
            device_code,
            verifiable_type
          };

          this.verifiable_type === SMS ?
        delete param.email : delete param.phone;

        addAccessToken().post(createAPI('users'), param ,
          {
            validateStatus: status => status === 201
          }
        )
        .then(({ data:{ token } = {} }) => {

          this.$storeLocal.set('UserLoginInfo', { token });
          
          this.isLoading = false;

          getLoggedUserInfo().then(user => {

            window.TS_WEB.currentUserId = user.id;
            
            // 注册成功，保存用户信息至本地
            this.$storeLocal.set('UserLoginInfo', { token, user_id: user.id });

            // 注册成功，保存用户信息至 vuex
            this.$store.dispatch(USERS_APPEND, cb =>{
              cb(user);
            });

            // 设置消息提示查询时间
            let time = this.$storeLocal.get('messageFlushTime') || 0;
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

            // 注册成功 跳转至 feeds 
            router.push({ path: 'feeds' });
          });
        })
        .catch(({ response: { data:{ errors = { other: "未知错误" }} = {} } = {} } ) => {
          this.isDisabled = false;
          this.isLoading = false;
          this.errors = { ...errors };
        })
      }
    },
    watch: {
      errors: function(val){
        const Messageable = PlusMessageBundle(val);
        this.error = Messageable.getMessage();
        this.errorKey = Messageable.getInputKey();
      },
      verifiable_type: function(val){
        if(val === SMS){
          this.email = "";
          this.reg_type = "手机";
        }else{
          this.phone = "";
          this.reg_type = "邮箱";
        }
      },
      username: function (newUsername) {
        this.clearError("name");
        this.isDisabled = true

        this.isValidUsername = usernameReg.test(newUsername);

        this.isDisabled = this.checkIsDisabled();
      },
      phone: function (newPhone) {
        this.clearError("phone");
        this.isDisabled = true

        if(!phoneReg.test(newPhone)) {
          this.isValidPhone = false;
          this.isCanGetCode = false;
        } else {
          this.isValidPhone = true;
          this.isCanGetCode = true;
        }

        this.isDisabled = this.checkIsDisabled();
      },
      email: function (newEmail) {
        this.clearError("email");
        this.isDisabled = true

        if(!emailReg.test(newEmail)) {
          this.isValidEmail = false;
          this.isCanGetCode = false;
        } else {
          this.isValidEmail = true;
          this.isCanGetCode = true;
        }

        this.isDisabled = this.checkIsDisabled();
      },
      password: function (newPassword) {
        this.clearError("password");
        this.isDisabled = true

        if(newPassword.length < 6) {
          this.isValidPassword = false;
        } else {
          this.isValidPassword = true;
        }

        this.isDisabled = this.checkIsDisabled();
      }
    }
  }

  export default register;

</script>

<style scoped lang="scss">
  input {
    padding: 5px 0
  }
</style>
