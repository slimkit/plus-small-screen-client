<template>
  <div class="p-forgot forgot signup">
    <header class="m-pos-f m-box m-justify-bet m-aln-center m-main m-bb1 m-head-top">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg 
          class="m-style-svg m-svg-def" 
          @click="goBack">
          <use 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            xlink:href="#base-back"/>
        </svg>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
        <span>修改密码</span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end">
        <a 
          :disabled="loading || disabled" 
          @click="handleOk">
          <svg 
            v-if="loading" 
            class="m-style-svg m-svg-def">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#base-loading"/>
          </svg>
          <span v-else>更改</span>
        </a>
      </div>
    </header>
    <main style="padding-top: 0.9rem">
      <div class="m-form-row m-main">
        <label for="old-password">旧密码</label>
        <div class="m-input">
          <input
            id="old-password"
            v-model="oldPassword"
            type="password"
            maxlength="16"
            autocomplete="off"
            placeholder="输入6位以上的原始密码">
        </div>
      </div>
      <div class="m-form-row m-main">
        <label for="new-password">新密码</label>
        <div class="m-input">
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            maxlength="16"
            autocomplete="off"
            placeholder="输入6位以上新密码">
        </div>
      </div>
      <div class="m-form-row m-main">
        <label for="re-password">确认新密码</label>
        <div class="m-input">
          <input
            id="re-password"
            v-model="rePassword"
            type="password"
            maxlength="16"
            autocomplete="off"
            placeholder="请确认新密码">
        </div>
      </div>

      <div class="m-box m-aln-center m-text-box m-form-err-box">
        <span>{{ error | plusMessageFirst }}</span>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  name: "Forgot",
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      rePassword: "",
      loading: false,
      error: ""
    };
  },
  computed: {
    disabled: {
      get() {
        const rules = [this.oldPassword, this.newPassword, this.rePassword];
        return rules.some(val => val.length < 6);
      },

      set(val) {
        if (val) {
          this.oldPassword = "";
          this.newPassword = "";
          this.rePassword = "";
        }
      }
    }
  },
  methods: {
    handleOk() {
      if (this.disabled) return;
      const { oldPassword, newPassword, rePassword } = this.$data;

      // 密码长度
      if (newPassword.length < 6) {
        this.$Message.error({ newPassword: "新密码长度必须在6-16位之间" });
        return;
      }

      // 重复新密码
      if (rePassword !== newPassword) {
        this.$Message.error({ rePassword: "密码确认不一致，请重新输入" });
        return;
      }

      let param = {
        old_password: oldPassword,
        password: newPassword,
        password_confirmation: rePassword,
        validateStatus: s => s === 204
      };
      this.loading = true;
      this.$http
        .put("/user/password", param)
        .then(() => {
          this.$Message.success("密码修改成功, 返回重新登陆");
          this.$lstore.removeData("H5_CUR_USER");
          this.$lstore.removeData("H5_ACCESS_TOKEN");
          this.$store.dispatch("SIGN_OUT");
          this.$router.push("/signin");
          this.loading = false;
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
          this.disabled = true;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.m-justify-end a.disabled,
.m-justify-end a[disabled] {
  color: #d3d3d3;
}

.p-forgot .m-form-row .m-input {
  padding: 0 30px 0 0;
}
.p-forgot .m-form-row label {
  flex: 0 0 30 * 6px;
  width: 30 * 6px;
}
</style>
