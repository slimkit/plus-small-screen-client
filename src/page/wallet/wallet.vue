<template lang="html">
  <div class="p-wallet wallet">
    <header class="m-box m-head-top">
        <div class="m-box m-flex-grow1 m-flex-base0 m-aln-center">
          <svg class="m-style-svg m-svg-def" @click="goBack">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
          </svg>
        </div>
        <div class="m-box m-flex-grow1 m-flex-base0 m-aln-center m-justify-center">
          <h2>钱包</h2>
        </div>
        <div class="m-box m-flex-grow1 m-flex-base0 m-aln-center m-justify-end">
          <router-link :to="{ path: 'detail' }" append slot='append'>明细</router-link>
        </div>
    </header>
    <section class="m-wallet-panel">
      <h3>账户余额(元)</h3>
      <p>{{ balance }}</p>
    </section>
    <ul class="m-box-model m-entry-group padding">
      <router-link :to='{path: "recharge"}' append tag="li" class="m-entry">
        <svg class='m-style-svg m-svg-def m-entry-prepend'>
          <use xlink:href="#wallet-recharge"></use>
        </svg>
        <span class="m-text-box m-flex-grow1">充值</span>
        <svg class="m-style-svg m-svg-def m-entry-append">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
      <router-link :to='{path: "withdraw"}' append tag="li" class="m-entry">
        <svg class='m-style-svg m-svg-def m-entry-prepend'>
          <use xlink:href="#wallet-withdraw"></use>
        </svg>
        <span class="m-text-box m-flex-grow1">提现</span>
        <svg class="m-style-svg m-svg-def m-entry-append">
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
    new_wallet() {
      return this.user.new_wallet || { balance: 0 };
    },
    balance() {
      return (this.new_wallet.balance / 100).toFixed(2);
    }
  }
};
</script>

<style lang="less">
.p-wallet {
  .m-head-top {
    background-color: #31a0e6;
    color: #fff;
    a {
      color: inherit;
    }
  }
  .entry__group:first-of-type {
    margin-top: 0;
  }
}
.m-wallet-panel {
  padding: 60px 30px;
  color: #fff;
  font-size: 28px;
  background-color: #31a0e6;
  h3 {
    opacity: 0.7;
  }
  p {
    margin-top: 80px;
    font-size: 100px;
    letter-spacing: 2px;
  }
}
</style>
