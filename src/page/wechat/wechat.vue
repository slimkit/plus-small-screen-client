<template>
  <div :class="`${prefixCls}`">
    <div class="mask" v-if="signed">
      登录中...
    </div>
    <div v-if="!signed">
      <div class="mask" v-if="!showRegister && !showBind">
        <div class="entries">
          <div @click='action("showRegister")'>注册新用户</div>
          <div @click='action("showBind")'>绑定已有用户</div>
        </div>
      </div>
      <!-- 完善资料, 相当于新注册用户, 设置用户昵称-->
      <div v-else-if="showRegister">
        <register-user :name="name" :goDefault="goDefault" :accessToken="accessToken" :fn="action" />
      </div>
      <!-- 绑定已有用户 -->
      <div v-else>
        <bind-user :accessToken="accessToken" :goDefault="goDefault" :fn="action" />
      </div>
    </div>
  </div>
</template>
<script>
import lstore from "store";
import bindUser from "./bindUser";
import registerUser from "./registerUser";

const prefixCls = "signup";

export default {
  components: {
    bindUser,
    registerUser
  },
  name: "wechatLogin",
  data: () => ({
    accessToken: "",
    name: "",
    showRegister: false,
    showBind: false,
    loading: false,
    prefixCls,
    signed: true // 是否已经绑定
  }),

  watch: {
    // 根据获取到access_token检查用户是否已经被楚泽
    showBind(val) {
      this.showBind = val;
      if (val) {
        this.showRegister = !val;
      }
    },
    showRegister(val) {
      this.showRegister = val;
      if (val) {
        this.showBind = !val;
      }
    }
  },
  methods: {
    // countDown() {
    //   const t = setInterval(() => {
    //     if (--this.countdown <= 0) {
    //       this.loading = 0;
    //       this.countdown = 0;
    //       clearInterval(t);
    //     }
    //   }, 1000);
    // },
    goDefault() {
      this.showRegister = false;
      this.showBind = false;
    },
    action(action) {
      this[action] = true;
    },

    async resolveUser(query) {
      const { code } = query;
      let accessToken = lstore.get("H5_WECHAT_MP_ASTOKEN");
      let openId = lstore.get("H5_WECHAT_MP_OPENID");
      if (!accessToken || !openId) {
        const result = await this.$http.get(`socialite/getAccess/${code}`, {
          validateStatus: status => status === 200
        });

        let { data: { access_token, openid } = {} } = result;
        accessToken = access_token;
        openId = openid;
        lstore.set("H5_WECHAT_MP_ASTOKEN", accessToken);
        lstore.set("H5_WECHAT_MP_OPENID", openid);
      }
      this.accessToken = accessToken;
      this.$http
        .post(
          "socialite/wechat",
          {
            access_token: accessToken
          },
          {
            validateStatus: s => s === 201
          }
        )
        .then(({ data: { token = "", user = {} } = {} }) => {
          // 保存用户信息 并跳转
          this.$store.commit("SAVE_CURRENTUSER", { ...user, token });
          this.$nextTick(() => {
            this.$router.push(this.$route.query.redirect || "/feed/new");
            this.$store.dispatch("GET_UNREAD_COUNT");
            this.$store.commit("SAVE_USER", user);
            lstore.remove("H5_WECHAT_MP_OPENID");
            lstore.remove("H5_WECHAT_MP_ASTOKEN");
          });
        })
        .catch(() => {
          this.signed = false;
          this.getWechatUserInfo(accessToken, openId);
        });
    },

    getWechatUserInfo(access_token, openid) {
      this.$http
        .post(
          "socialite/getWechatUser",
          {
            access_token,
            openid
          },
          {
            validateStatus: s => s === 200
          }
        )
        .then(({ data: { nickname = "" } = {} }) => {
          this.name = nickname;
        });
    }
  },
  mounted() {
    this.resolveUser(this.$route.query);
  }
};
</script>
<style lang='less' src='../style/signup.less'>
</style>

<style lang="less">
.mask {
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  .entries {
    border: 1px solid #f4f5f5;
    background: #fff;
    border-radius: 5px;
    div {
      padding: 35px 71px;
      text-align: center;
      color: #333;
    }
    div:not(:last-child) {
      border-bottom: 1px solid #ededed;
    }
  }
  .canNotAction {
    color: #d3d3d3;
  }
}
</style>
