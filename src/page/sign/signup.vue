<template>
  <transition
    enter-active-class="animated bounceInRight"
    leave-active-class="animated bounceOutLeft">
    <div class="p-signup">
      <header class="m-box m-aln-center m-head-top m-pos-f m-main m-bb1">
        <div class="m-box m-aln-center m-flex-grow1 m-flex-base0">
          <svg class="m-style-svg m-svg-def" @click="goBack">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
          </svg>
        </div>
        <div class="m-box m-aln-center m-justify-center m-flex-grow1 m-flex-base0 m-head-top-title">
          <span>{{ _$type.label }}注册</span>
        </div>
        <div class="m-box m-aln-center m-justify-end m-flex-grow1 m-flex-base0">
          <a @click.prevent="changeType">{{ _$type.label2 }}</a>
        </div>
      </header>
      <main style="padding-top: 0.9rem">
        <div class="m-form-row m-main">
          <label for="username">用户名</label>
          <div class="m-input">
            <input type="text" id="username" v-model.trim='name' placeholder="用户名不能低于2个中文或4个英文" maxlength="8">
          </div>
          <svg @click="name = ''" v-show="name.length > 0" class="m-style-svg m-svg-def">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-clean"></use>
          </svg>
        </div>
        <div class="m-form-row m-main" v-if='verifiable_type === "sms"'>
          <label for="phone">手机号</label>
          <div class="m-input">
            <input id="phone" type="number" v-model='phone' pattern="[0-9]*" oninput="value=value.slice(0, 11)" placeholder="输入11位手机号">
            <!-- maxlength="11" -->
          </div>
          <span class="code-text" :class='{ disabled: phone.length < 11 || countdown > 0 }' @click='getCode'>
            {{ codeText }}
          </span>
        </div>
        <div class="m-form-row m-main" v-if='verifiable_type === "mail"'>
          <label for="email">邮箱</label>
          <div class="m-input">
            <input id="email" type="email" v-model.trim='email' placeholder="输入邮箱地址">
          </div>
          <span class="code-text" :class='{ disabled: email.length < 4 || countdown > 0 }' @click='getCode'>
            {{ codeText }}
          </span>
        </div>
        <div class="m-form-row m-main">
          <label for="code">验证码</label>
          <div class="m-input">
            <input id="code" type="number" pattern="[0-9]*" v-model='verifiable_code' oninput="value=value.slice(0, 6)" placeholder="输入4-6位验证码" />
          </div>
          <svg @click="verifiable_code = ''" v-show="verifiable_code.length > 0" class="m-style-svg m-svg-def">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-clean"></use>
          </svg>
        </div>

        <div class="m-form-row m-main">
          <label for="password">密码</label>
          <div class="m-input">
            <input v-if="eye" type="text" id="password" maxlength='16' v-model="password" placeholder="输入6位以上登录密码" />
            <input v-else id="password" maxlength='16' type="password" v-model="password" placeholder="输入6位以上登录密码" />
          </div>
          <svg class="m-style-svg m-svg-def" @click="eye=!eye">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href='`#eye-${eye?"open":"close"}`'></use>
          </svg>
        </div>
        <div class="m-box m-aln-center m-text-box m-form-err-box">
          <span>{{ error | plusMessageFirst }}</span>
        </div>
        <div class="m-form-row" style="border: 0">
          <button :disabled="loading||disabled" class="m-long-btn m-signin-btn" @click="signIn">
            <svg v-if="loading" class="m-style-svg m-svg-def">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-loading"></use>
            </svg>
            <span v-else>注册</span>
          </button>
        </div>
      </main>
      <footer>
        <router-link to="/signup/protocol" class="register-protocol">
          点击注册即代表同意《ThinkSNS+用户使用协议》
        </router-link>
      </footer>
    </div>
  </transition>
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
const phoneReg = /^1[3-9]\d{9}$/;
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
      return this.countdown > 0 ? `${this.countdown}s后重发` : "获取验证码";
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

      // 判断首字符是否为数字
      if (!isNaN(name[0])) {
        this.$Message.error({ name: "用户名不能以数字开头" });
        return;
      }

      // 判断特殊字符及空格
      if (!usernameReg.test(name)) {
        this.$Message.error({ name: "用户名不能包含特殊符号以及空格" });
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
        .catch(err => {
          this.loading = false;
          this.disable = true;
          console.warn(err);
          // this.$Message.error(errors); // 已经弹出过 message 了
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
    },
    popProtocol() {
      console.log("protocol");
    }
  }
};
</script>

<style lang="less" scoped>
.p-signup {
  display: flex;
  height: 100%;

  > * {
    width: 100%;
  }

  .m-form-row {
    label {
      flex: 0 0 30 * 4px;
      width: 30 * 4px;
    }
    .m-input {
      padding: 0 30px 0 0;
    }
    .code-text.disabled,
    .code-text[disabled] {
      color: #ccc;
    }
    &-append {
      flex: 0 0 170px;
      width: 170px;
      text-align: right;
      svg {
        width: 38px;
        height: 38px;
        fill: #b3b3b3;
      }
    }
  }
  footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    padding: 0.2rem;

    .register-protocol {
      font-size: 0.3rem;
      color: #666;
    }
  }
}
</style>
