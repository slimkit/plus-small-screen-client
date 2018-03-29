<template>
  <div class="forgot signup">
    <header class="m-pos-f m-box m-justify-bet m-aln-center m-main m-bb1 m-head-top">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg class='m-style-svg m-svg-def' @click='goBack'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
        <span>找回密码</span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end">
        <a href="javascript:;" @click='changeType'>{{ _$type.label2 }}找回</a>
      </div>
    </header>
    <main style="padding-top: 0.9rem">
      <div class="m-form-row m-main" v-if='verifiable_type === "sms"'>
        <label for="phone">手机号</label>
        <div class="m-input">
          <input
          type="text"
          id="phone"
          v-model="phone"
          autocomplete="off"
          placeholder="输入11位手机号">
        </div>
        <span 
          class="signup-form--row-append c_59b6d7" 
          :class='{ disabled: phone.length < 11 }'
          @click='getCode'
          >{{ codeText }}</span>
      </div>
      <div class="m-form-row m-main" v-if='verifiable_type === "mail"'>
        <label for="mail">邮箱</label>
        <div class="m-input">
          <input
          type="mail"
          id="mail"
          v-model="mail"
          autocomplete="off"
          placeholder="输入邮箱地址">
        </div>
        <span 
          class="signup-form--row-append c_59b6d7" 
          :class='{ disabled: email.length < 11 }'
          @click='getCode'
          >{{ codeText }}</span>
      </div>
      <div class="m-form-row m-main">
          <label for="code">验证码</label>
          <div class="m-input">
            <input
            id="code"
            v-model.trim='verifiable_code'
            type="code" 
            maxlength="6"
            placeholder="输入4-6位验证码"
            >
          </div>
          <svg 
            @click="verifiable_code = ''"
            v-show="verifiable_code.length > 0"
            class="m-style-svg m-svg-def">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-clean"></use>
          </svg>
        </div>

        <div class="m-form-row m-main">
          <label for="password">密码</label>
          <div class="m-input">
            <input
            id="password"
            type="text"
            v-model="password"
            v-if="eye"
            placeholder="输入6位以上登录密码">
            <input 
            id="password" 
            type="password"
            v-model="password"
            v-else
            placeholder="输入6位以上登录密码" 
            >
          </div>
          <svg
          class="m-style-svg m-svg-def"
          @click="eye=!eye">
            <use 
            xmlns:xlink="http://www.w3.org/1999/xlink"
            :xlink:href='`#eye-${eye?"open":"close"}`'></use>
          </svg>
        </div>
        <div class="m-box m-aln-center m-text-box m-form-err-box">
          <span>{{ error | plusMessageFirst }}</span>
        </div>

        <div class="m-form-row" style="border: 0">
          <button
          :disabled="loading||disabled"
          class="m-long-btn m-signin-btn"
          @click="signIn">
            <svg v-if="loading" class="m-style-svg m-svg-def rotate">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-loading"></use>
            </svg>
            <span v-else>修改</span>
          </button>
        </div>
    </main>
  </div>
</template>
<script>
const SMS = "sms"; // 手机
const EMAIL = "mail"; // 邮箱
// const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
const phoneReg = /^1[345678]\d{9}$/;
const emailReg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

export default {
  name: "forgot",
  data() {
    return {
      phone: "",
      email: "",
      password: "",
      verifiable_code: "",
      verifiable_type: SMS,

      eye: false,
      countdown: 0,
      loading: false,
      error: ""
    };
  },
  computed: {
    disabled: {
      get() {
        return (
          this.verifiable_code.length < 4 ||
          (this.phone.length < 11 && this.email.length < 4) ||
          this.password.length < 6
        );
      },

      set(val) {
        if (val) {
          this.phone = "";
          this.email = "";
          this.password = "";
          this.verifiable_code = "";
        }
      }
    },
    canGetCode() {
      return (
        (this.phone.length === 11 || this.email.length > 4) &&
        this.countdown === 0
      );
    },
    codeText() {
      return this.countdown > 0 ? `${this.countdown}后重发` : "获取验证码";
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
    signIn() {
      const {
        phone,
        email,
        password,
        verifiable_code: verifiableCode,
        verifiable_type: verifiableType
      } = this.$data;
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
        .put("/user/retrieve-password", param)
        .then(({ data: { token } = {} }) => {
          if (token) {
            this.$Message.success("密码修改成功, 返回重新登陆");
            this.$router.push("/signin");
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.disabled = true;
        });
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
        .post("verifycodes", param, {
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

<style>
.signup-form--row-append[disabled] {
  color: #d3d3d3;
}
</style>
