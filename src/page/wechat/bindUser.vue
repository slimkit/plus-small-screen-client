<template>
  <transition name='router-fadeInRight' mode="in-out">
    <div>
      <head-top :go-back='toBack' title='已有账号' :append='true'>
        <div 
          slot='append' 
          class="c_59b6d7"
          @click='hide("showRegister")'
        >
          新账号
        </div>
      </head-top>
      <div class="form-group" :class="`${prefixCls}--main`">
        <div class="signup-form--row">
          <label class="signup-form--row-prepend" for="username">账号</label>
          <input id="username" v-model.trim='account' type="text" placeholder="邮箱/手机/昵称" />
          <span class="signup-form--row-append">
            <svg v-show='account.length > 0' @click='account = ""'>
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
        <div class="signup-form--error ellipsis"></div>
      </div>
      <button class="signup-form--submit-btn" :disabled='disabled' @click='bindUser'>
        <span>绑定</span>
        <svg v-if='loading' class="rotate">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-loading"></use>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script>
  import lstore from "store";
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
  export default {
    name: "bindUser",
    props: {
      fn: Function,
      accessToken: String,
      goDefault: Function
    },
    data: () => ({
      prefixCls,
      account: "",
      password: "",
      eye: false,
      loading: false
    }),
    computed: {
      disabled() {
        const { account, password } = this;

        const res = [account, password].every(i => i !== "");

        return !(res && strLength(account) > 3);
      }
    },
    methods: {
      toBack() {
        this.goDefault();
      },
      hide(action) {
        this.fn(action);
      },
      bindUser() {
        if (this.loading) {
          return;
        }
        const { account: login, password, accessToken: access_token } = this;
        if (!login) {
          this.$Message.error("请填写账号");
          return;
        }

        if (!password) {
          this.$Message.error("请填写密码");
          return;
        }

        if (!access_token) {
          this.$Messge.error("未获取到微信授权");
          return;
        }

        let param = {
          login,
          access_token,
          password
        };
        this.loading = true;
        this.$http
          .put(
            "socialite/wechat",
            param,
            {
              validateStatus: s => s === 201
            }
          )
          .then(({ data: { token = "", user = {} } = {} }) => {
            this.$store.commit("SAVE_CURRENTUSER", { ...user, token });
            this.$nextTick(() => {
              this.$router.push(this.$route.query.redirect || "/feed/new");
              this.$store.dispatch("GET_UNREAD_COUNT");
              this.$store.commit("SAVE_USER", user);
              store.remove("H5_WECHAT_MP_OPENID");
              lstore.remove('H5_WECHAT_MP_ASTOKEN');
            });
          })
          .catch(() => {
            this.loading = false;
          })
      }
    }
  }
</script>
<style>
  
</style>