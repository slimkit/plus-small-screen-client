<template>
  <transition name='router-fadeInRight' mode="in-out">
    <div>
      <head-top :go-back='toBack' key="reg-head" title='完善资料' :append='true'>
        <div 
          slot='append' 
          class="c_59b6d7"
          @click='hide("showBind")'
        >
          已有账号
        </div>
      </head-top>
      <div class="form-group" key="reg-body" :class="`${prefixCls}--main`">
        <div class="signup-form--row">
          <label class="signup-form--row-prepend" for="username">用户名</label>
          <input id="username" v-model="uname" type="text" placeholder="输入用户名">
          <span class="signup-form--row-append">
            <svg v-show='uname.length > 0' @click='uname = ""'>
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-clean"></use>
            </svg>
          </span>
        </div>
        <div class="signup-form--error ellipsis"></div>
      </div>
      <button key="reg-submit" class="signup-form--submit-btn" :disabled='disabled' @click='createUser'>
        <span>提交</span>
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
  // 用户名验证
  const usernameReg = /^[a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9_\u4E00-\u9FA5\uF900-\uFA2D]*$/;
  export default {
    name: "registerUser",
    props: {
      name: String,
      accessToken: String,
      fn: Function,
      goDefault: Function
    },
    data: () => ({
      prefixCls,
      loading: false,
      uname: ""
    }),
    mounted () {
      this.uname = this.name;
    },
    computed: {
      disabled() {
        const { name, accessToken } = this;

        const res = [name, accessToken].every(i => i !== "");

        return !(res && strLength(name) > 3);
      }
    },

    watch: {
      showBind(val) {
        this.showBind = val;
        if (val) {
          this.showRegister = !val;
        }
      }
    },
    methods: {
      toBack() {
        this.goDefault();
      },
      hide(action) {
        this.fn(action);
      },
      // 使用微信信息注册新用户, 暂时只获取用户名
      createUser() {
        const { uname: name, accessToken } = this;
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

        let param = {
          name,
          access_token: accessToken
        };
        this.loading = true;

        this.$http
          .patch("socialite/wechat", param, {
            validateStatus: s => s === 201
          })
          .then(({ data: { user = {}, token = "" } = {} }) => {
            // 保存用户信息 并跳转
            this.$store.commit("SAVE_CURRENTUSER", { ...user, token });
            this.$nextTick(() => {
              this.$router.push(this.$route.query.redirect || "/feed/new");
              this.$store.dispatch("GET_UNREAD_COUNT");
              this.$store.commit("SAVE_USER", user);
              store.remove("H5_WECHAT_MP_OPENID");
              lstore.remove('H5_WECHAT_MP_ASTOKEN');
            });
          })
          .catch( () => {
            this.loading = false;
          });
      }
    }
  }
</script>
<style lang="less">
  
</style>
