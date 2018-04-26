<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutLeft">
    <div class="p-signin m-pos-f">
      <header class="m-box m-aln-center m-head-top m-pos-f m-main m-bb1">
        <div class="m-box m-aln-center m-flex-grow1 m-flex-base0"></div>
        <div class="m-box m-aln-center m-justify-center m-flex-grow1 m-flex-base0 m-head-top-title">
          <span>已有账号</span>
        </div>
        <div class="m-box m-aln-center m-justify-end m-flex-grow1 m-flex-base0">
          <router-link to="/wechat/signup">
            <a>新账号</a>
          </router-link>
        </div>
      </header>
      <main style="padding-top: 0.9rem">
        <div class="m-form-row m-main">
          <label for="account">账户</label>
          <div class="m-input">
            <input
            @focus="onFocus"
            type="text"
            id="account"
            v-model="account"
            placeholder="用户名/手机号/邮箱">
          </div>
          <svg 
            @click="account = ''"
            v-show="account.length > 0"
            class="m-style-svg m-svg-def">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-clean"></use>
          </svg>
        </div>
        <div class="m-form-row m-main">
          <label for="password">密码</label>
          <div class="m-input">
            <input
            @focus="onFocus"
            id="password"
            type="text"
            v-model="password"
            v-if="eye"
            placeholder="输入6位以上登录密码">
            <input 
            @focus="onFocus"
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
          <transition enter-active-class="animated shake">
            @focus="onFocus"
            <span v-if="err">{{ (err | plusMessageFirst) }}</span>
          </transition>
        </div>
        <div class="m-form-row" style="border: 0">
          <button
          :disabled="disabled"
          class="m-long-btn m-signin-btn"
          @click="bindUser">
            <svg v-if="loading" class="m-style-svg m-svg-def">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-loading"></use>
            </svg>
            <span v-else>绑定账号</span>
          </button>
        </div>
      </main>
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
export default {
  name: "wechat-bind-user",
  data: () => ({
    err: "",
    eye: false,
    account: "",
    password: "",
    loading: false,
    accessToken: ""
  }),
  computed: {
    disabled() {
      const { account, password } = this.$data;
      return !(
        [account, password].every(i => i !== "") && strLength(account) > 3
      );
    }
  },
  created() {
    this.accessToken = this.$lstore.getData("H5_WECHAT_MP_ASTOKEN");
  },
  methods: {
    onFocus() {
      this.err = "";
    },
    bindUser() {
      this.err = "";
      if (this.loading) {
        return;
      }
      const {
        account: login,
        password,
        accessToken: access_token
      } = this.$data;
      if (!login) {
        this.err = { error: "账号不能为空" };
        return;
      }

      if (!password) {
        this.err = { error: "密码不能为空" };
        return;
      }

      if (!access_token) {
        this.err = { error: "未获取到微信授权" };
        return;
      }

      let param = {
        login,
        access_token,
        password
      };
      this.loading = true;
      this.$http
        .put("socialite/wechat", param, {
          validateStatus: s => s === 201
        })
        .then(({ data: { token = "", user = {} } = {} }) => {
          this.$store.commit("SAVE_CURRENTUSER", { ...user, token });
          this.$nextTick(() => {
            this.$router.push(this.$route.query.redirect || "/feeds/new");
            this.$store.dispatch("GET_UNREAD_COUNT");
            this.$store.commit("SAVE_USER", user);
            this.$lstore.removeData("H5_WECHAT_MP_OPENID");
            this.$lstore.removeData("H5_WECHAT_MP_ASTOKEN");
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>
