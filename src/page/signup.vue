<template>
  <div :class="`${prefixCls}`">
    <head-top :title='`${_$type.label}注册`' :append='true' :go-back='true'>
      <div 
      slot='append' 
      class="c_59b6d7" 
      @click='changeType'
      >{{ _$type.label2 }}</div>
    </head-top>
    <div :class="`${prefixCls}--main`">
      <div class="signup-form--row">
        <label class="signup-form--row-prepend" for="username">用户名</label>
        <input id="username" v-model.trim='name' type="text" placeholder="输入2-8位用户名" maxlength="8">
        <span class="signup-form--row-append">
          <svg v-show='name.length > 0' @click='name = ""'>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-clean"></use>
          </svg>
        </span>
      </div>

      <div class="signup-form--row" v-if='verifiable_type === "sms"'>
        <label class="signup-form--row-prepend" for="phone">手机号</label>
        <input id="phone" v-model.trim.number='phone' type="number" maxlength="11" placeholder="输入11位手机号" oninput="if(value.length>11)value=value.slice(0,11)">
        <span 
        class="signup-form--row-append c_59b6d7" 
        :class='{ disabled: phone.length < 11 }'
        @click='getCode'
        >{{ codeText }}</span>
      </div>

      <div class="signup-form--row" v-if='verifiable_type === "mail"'>
        <label class="signup-form--row-prepend" for="mail">邮箱</label>
        <input id="mail" type="email" v-model.trim='email' placeholder="输入邮箱地址">
        <span 
        class="signup-form--row-append c_59b6d7" 
        :class='{ disabled: email.length < 4 }'
        @click='getCode'
        >{{ codeText }}</span>
      </div>

      <div class="signup-form--row">
        <label class="signup-form--row-prepend" for="code">验证码</label>
        <input id="code" type="text" v-model.trim='verifiable_code' placeholder="输入4-6位验证码" maxlength="6">
        <span class="signup-form--row-append">
          <svg v-show='verifiable_code.length > 0' @click='verifiable_code = ""'>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-clean"></use>
          </svg>
        </span>
      </div>

      <div class="signup-form--row">
        <label class="signup-form--row-prepend" for="psw">密码</label>
        <input id="psw" v-if='eye' type="text" v-model.trim='password' placeholder="输入6位以上登录密码">
        <input id="psw" v-else type="password" v-model.trim='password' placeholder="输入6位以上登录密码">
        <span class="signup-form--row-append">
          <svg @click='eye = !eye'>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="`#eye-${eye ? 'open' : 'close'}`"></use>
          </svg>
        </span>
      </div>
      <!-- {{ error | plusMessageAnalyze }} -->
      <div class="signup-form--error ellipsis"></div>
    </div>
      <button class="signup-form--submit-btn" :disabled='disabled' @click='signIn'>
        <span>注册</span>
        <svg v-if='loading' class="rotate">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-loading"></use>
        </svg>
      </button>
  </div>
</template>
<script>
function strLength(str) {
  let totalLength = 0;
  let i = 0;
  let charCode;
  for (; i < str.length; i++) {
    charCode = str.charCodeAt(i);
    if (charCode < 0x007f) {
      totalLength = totalLength + 1;
    } else if (charCode >= 0x0080 && charCode <= 0x07ff) {
      totalLength += 2;
    } else if (charCode >= 0x0800 && charCode <= 0xffff) {
      totalLength += 3;
    }
  }
  return totalLength;
}
const prefixCls = "signup";
const SMS = "sms"; // 手机
const EMAIL = "mail"; // 邮箱

// 手机号码规则
const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
// 邮箱验证
const emailReg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
// 用户名验证
const usernameReg = /^[a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9_\u4E00-\u9FA5\uF900-\uFA2D]*$/;
// 验证码
// const codeReg = /^[0-9]{4,6}$/;

export default {
  name: "signup",
  data() {
    return {
      prefixCls,
      eye: false,
      error: "",
      loading: false,

      name: "",
      email: "",
      phone: "",
      countdown: 0,
      password: "",
      verifiable_type: SMS,
      verifiable_code: ""
    };
  },
  computed: {
    codeText() {
      return this.countdown > 0 ? `${this.countdown}后重发` : "获取验证码";
    },
    canGetCode() {
      return (
        (this.phone.length === 11 || this.email.length > 4) &&
        this.countdown === 0
      );
    },
    disabled() {
      const {
        name,
        phone,
        email,
        password,
        verifiable_code: verifiableCode,
        verifiable_type: verifiableType
      } = this.$data;

      const res = [name, password, verifiableCode, verifiableType].every(
        i => i !== ""
      );

      return !(res && (phone.length === 11 || email.length > 4));
    },
    _$type: {
      get() {
        let label = "";
        let label2 = "";
        switch (this.verifiable_type) {
          case SMS:
            label = "手机";
            label2 = "邮箱";
            break;
          case EMAIL:
            label = "邮箱";
            label2 = "手机";
            break;
        }
        return {
          value: this.verifiable_type,
          label,
          label2
        };
      },
      set(val) {
        this.verifiable_type = val;
      }
    }
  },
  methods: {
    countDown() {
      const t = setInterval(() => {
        if (--this.countdown <= 0) {
          this.countdown = 0;
          clearInterval(t);
        }
      }, 1000);
    },
    getCode() {
      if (!this.canGetCode) return;
      const phone = this.phone;
      const email = this.email;
      let param = {
        phone,
        email
      };
      this.verifiable_type === SMS ? delete param.email : delete param.phone;
      this.$http
        .post("verifycodes/register", param, {
          validateStatus: status => status === 202
        })
        .then(() => {
          this.countdown = 60;
          this.countDown();
          this.$Message.success("发送验证码成功");
          this.error = "";
        })
        .catch(
          ({
            response: { status = null, data: { errors = {} } = {} } = {}
          }) => {
            if (status === 500) {
              this.error = { message: "网络错误,请联系管理员" };
              return;
            }
            if (status === 422) {
              this.error = errors;
            }
            setTimeout(() => {
              this.error = "";
            }, 3000);
          }
        );
    },
    signIn() {
      const {
        name,
        phone,
        email,
        password,
        verifiable_code: verifiableCode,
        verifiable_type: verifiableType
      } = this.$data;

      // 判断特殊字符及空格
      if (!usernameReg.test(name)) {
        this.$Message.error({ name: "用户名不能包含特殊符号以及空格" });
        return;
      }

      // 判断首字符是否为数字
      if (!isNaN(name[0])) {
        this.$Message.error({ name: "用户名不能以数字开头" });
        return;
      }

      // 判断字节数
      if (strLength(name) > 48 || strLength(name) < 4) {
        this.$Message.error({ name: "用户名不能少于2个中文或4个英文" });
        return;
      }

      // 手机号
      if (verifiableType === SMS && !phoneReg.test(phone)) {
        this.$Message.error({ phone: "请输入正确的手机号码" });
        return;
      }

      // 邮箱
      if (verifiableType !== SMS && !emailReg.test(email)) {
        this.$Message.error({ email: "请输入正确的邮箱号码" });
        return;
      }

      // 密码长度
      if (password.length < 6) {
        this.$Message.error({ password: "密码长度必须大于6位" });
        return;
      }

      let param = {
        name,
        phone,
        email,
        verifiable_code: verifiableCode,
        password,
        verifiable_type: verifiableType,
        validateStatus: s => s === 201
      };
      this.loading = true;
      verifiableType === SMS ? delete param.email : delete param.phone;
      this.$http
        .post("users", param)
        .then(({ data: { token } = {} }) => {
          if (token) {
            this.loading = false;
            this.$Message.success("注册成功, 请登陆");
            this.$router.push("/signin");
          }
        })
        .catch(({ response: { data: { errors = {} } = {} } = {} }) => {
          this.$Message.error(errors);
        });
    },
    changeType() {
      switch (this.verifiable_type) {
        case SMS:
          this._$type = EMAIL;
          break;
        case EMAIL:
          this._$type = SMS;
          break;
      }
    }
  }
};
</script>
<style lang='less' src='./style/signup.less'>
</style>
