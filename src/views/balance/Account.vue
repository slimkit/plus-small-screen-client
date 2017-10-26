<template>
  <div>
    <div 
      v-if='link'
      @click="jumpToUserFeeds"
      :class="$style.root"
    >
      <img 
        style="width: 6vw; margin-right: 1vw;" 
        v-lazy="getAvatar(user.avatar)" 
        :alt="user.name"
      >
      {{ user.name }}
    </div>
    <div
      v-else
      :class="$style.root"
    >
      {{ allChannel[this.detail.channel] }}
    </div>
  </div>
</template>
<style lang="less" module>
  .root {
    display: flex;
    align-items: center;
  }
</style>
<script>
  import { getUserInfo } from '../../utils/user';
  import { resolveImage } from '../../utils/resource';
  
  const allChannel = {
    alipay: '支付宝App支付',
    alipay_wap: '支付宝手机网页支付',
    alipay_qr: '支付宝扫码支付',
    alipay_scan: '支付宝条码支付',
    alipay_pc_direct: '支付宝电脑网站支付',
    bfb: '百度钱包App支付',
    bfb_wap: '百度手机网页支付',
    wx: '微信App支付',
    wx_pub: '微信公众号支付',
    wx_wap: '微信H5支付',
    wx_lite: '微信小程序支付',
    wx_pub_qr: '微信公众号扫码支付',
    wx_pub_scan: '微信公众号刷卡支付',
    qpay: 'QQ钱包支付',
    applepay_upacp: 'Apple Pay'
  };

  const defaultAvatar = resolveImage(require('../../statics/images/defaultAvatarx2.png'));

  const Account = {
    props: {
      detail: Object
    },

    data: () => ({
      allChannel
    }),

    methods: {
      getAvatar (avatar) {
        if (avatar) return avatar;

        return defaultAvatar;
      },
      jumpToUserFeeds () {
        const { account = '' } = this.detail;
        this.$router.push(`/users/feeds/${account}`);
      }
    },

    computed: {
      link () {
        const { channel = '' } = this.detail;

        return channel === 'user';
      },
      user () {
        const { account = '', channel = '' } = this.detail;

        if(!account && !channel) return {};

        let user = {};
        if (channel === 'user') {
          user = this.$storeLocal.get(`user_${account}`);
        }

        if (_.keys(user).length > 0) return user;

        getUserInfo(account).then( user => {
          return user;
        })
      }
    }
  };

  export default Account;
</script>