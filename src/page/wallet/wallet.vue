<template lang="html">
  <div class="p-wallet wallet">
    <header class="m-box m-head-top">
        <div class="m-box m-flex-grow1 m-flex-base0 m-aln-center">
          <svg class="m-style-svg m-svg-def" @click="goback">
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
  methods: {
    goback() {
      this.$router.go(-1);
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
