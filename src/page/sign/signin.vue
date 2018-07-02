<template>
  <transition
    enter-active-class="animated bounceInRight"
    leave-active-class="animated bounceOutLeft">
    <div class="m-box-model m-pos-f p-signin">
      <header class="m-box m-pos-f m-aln-center m-main m-head-top m-bb1">
        <div class="m-flex-grow1 m-flex-base0"/>
        <div class="m-box m-flex-grow1 m-flex-base0 m-aln-center m-justify-center m-head-top-title">
          <span>登录</span>
        </div>
        <div class="m-box m-flex-grow1 m-flex-base0 m-aln-center m-justify-end">
          <router-link to="/signup">注册</router-link>
        </div>
      </header>
      <main 
        class="m-box-model m-flex-grow1" 
        style="padding-top: 0.9rem">
        <div class="m-form-row m-main">
          <label for="account">账户</label>
          <div class="m-input">
            <input
              id="account"
              v-model="account"
              type="text"
              placeholder="用户名/手机号/邮箱">
          </div>
          <svg
            v-show="account.length > 0"
            class="m-style-svg m-svg-def"
            @click="account = ''">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#base-clean"/>
          </svg>
        </div>
        <div class="m-form-row m-main">
          <label for="password">密码</label>
          <div class="m-input">
            <input
              v-if="eye"
              id="password"
              v-model="password"
              type="text"
              maxlength="16"
              placeholder="输入6位以上登录密码">
            <input
              v-else
              id="password"
              v-model="password"
              maxlength="16"
              type="password"
              placeholder="输入6位以上登录密码">
          </div>
          <svg 
            class="m-style-svg m-svg-def" 
            @click="eye=!eye">
            <use :xlink:href="`#eye-${eye?&quot;open&quot;:&quot;close&quot;}`"/>
          </svg>
        </div>
        <div class="m-box m-aln-center m-text-box m-form-err-box">
          <span>{{ err | plusMessageFirst }}</span>
        </div>
        <div 
          class="m-form-row" 
          style="border: 0">
          <button
            :disabled="disabled"
            class="m-long-btn m-signin-btn"
            @click="signinByAccount">
            <svg 
              v-if="loading" 
              class="m-style-svg m-svg-def">
              <use 
                xmlns:xlink="http://www.w3.org/1999/xlink" 
                xlink:href="#base-loading"/>
            </svg>
            <span v-else>登录</span>
          </button>
        </div>
        <div class="m-box m-aln-center m-justify-bet other-link">
          <router-link 
            tag="span" 
            to="/feeds?type=hot">
            <a>不登录，先随便逛逛</a>
          </router-link>
          <router-link 
            tag="span" 
            to="/forgot">
            <a>忘记密码</a>
          </router-link>
        </div>
      </main>

      <!-- TODO: 其他三方登录方式 -->
      <footer 
        v-if="isWechat" 
        class="m-box-model m-trhsignin">
        <div class="m-box m-aln-center m-justify-aro m-trhsignin-list">
          <!-- <div class="m-box m-fd-col m-aln-center m-tr-item">
            <div class="m-tr-item-icon">
              <svg class="m-style-svg m-svg-def">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#tr-QQ"></use>
              </svg>
            </div>
            <span>QQ</span>
          </div> -->
          <div 
            class="m-box m-fd-col m-aln-center m-tr-item" 
            @click="signinByWechat">
            <div class="m-tr-item-icon">
              <svg class="m-style-svg m-svg-def">
                <use 
                  xmlns:xlink="http://www.w3.org/1999/xlink" 
                  xlink:href="#tr-wechat"/>
              </svg>
            </div>
            <span>微信</span>
          </div>
        </div>
      </footer>
    </div>
  </transition>
</template>
<script>
import { signinByAccount } from "@/api/user.js";
import { signinByWechat } from "@/util/wechat.js";

export default {
  name: "Signin",
  data() {
    return {
      err: "",
      eye: false,
      account: "",
      password: "",
      loading: false
    };
  },
  computed: {
    disabled() {
      return (
        this.account.length === 0 || this.password.length < 6 || this.loading
      );
    },
    isWechat() {
      return this.$store.state.BROWSER.isWechat;
    }
  },
  methods: {
    signinByWechat,
    signinByAccount() {
      this.err = "";
      if (this.account.length === 0) {
        this.err = "账户不正确";
        return false;
      }

      if (this.password.length < 6) {
        this.err = "密码不正确";
        return false;
      }

      this.loading = true;

      signinByAccount({
        login: this.account,
        password: this.password
      }).then(state => {
        this.loading = false;
        state &&
          this.$nextTick(() => {
            this.$router.push(this.$route.query.redirect || "/feeds?type=hot");
          });
      });
    }
  }
};
</script>

<style lang="less">
.p-signin {
  background-color: #f4f5f6;
  .other-link {
    margin-top: 25px;
    margin-bottom: 25px;
    padding: 0 30px;
    font-size: 26px;
    a {
      color: @text-color3;
    }
  }
  .m-trhsignin {
    position: relative;
    text-align: center;
    &:before {
      position: absolute;
      top: 0;
      left: 80px;
      right: 80px;
      content: "";
      display: block;
      height: 0;
      border-top: 1px solid #ccc; /*no*/
    }
    &:after {
      color: #ccc;
      content: "社交账号登陆";
      display: inline-block;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 0 20px;
      background-color: #f4f5f6;
    }
    padding: 60px 80px;
    .m-tr-item {
      font-size: 24px;
      line-height: 26px;
      color: @text-color3;
      &-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        width: 80px;
        height: 80px;
        border-radius: 40px;
        background-color: #ffffff;
        .m-svg-def {
          width: 38px;
          height: 38px;
        }
      }
    }
  }
}
</style>
