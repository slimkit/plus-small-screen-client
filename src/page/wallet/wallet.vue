<template lang="html">
  <div class="wallet">
    <head-top :go-back='true' title="钱包" append='true'>
      <router-link :to="{ path: 'detail' }" append slot='append'>明细</router-link>
    </head-top>
    <div class="wallet--balance">
      <p class="label">账户余额({{ goldName }})</p>
      <h1 class="balance">{{ balance }}</h1>
    </div>
    <ul class="entry__group padding">
      <router-link tag='li' class="entry__item" :to='{path: "recharge"}' append>
        <svg class='entry__item--prepend'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#wallet-recharge"></use>
        </svg>
        <span>充值</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
      <router-link tag='li' class="entry__item" :to='{path: "withdraw"}' append>
        <svg class='entry__item--prepend'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#wallet-withdraw"></use>
        </svg>
        <span>提现</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: "wallet",
  data() {
    return {};
  },
  computed: {
    goldName() {
      const {
        site: { gold_name: { name = "金币" } = {} } = {}
      } = this.$store.state.CONFIG;
      return name;
    },
    user() {
      return this.$store.state.CURRENTUSER;
    },
    wallet() {
      return this.user.wallet || {};
    },
    balance() {
      return (+this.wallet.balance || 0).toFixed(2);
    }
  },
  methods: {}
};
</script>

<style lang="less" src='./style/wallet.less'>
</style>
