<template>
  <div>
    <div class="m-spinner"></div>
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
