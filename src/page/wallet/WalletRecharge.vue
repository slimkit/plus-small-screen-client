<template lang="html">
  <div class="wallet-recharge">
    <header class="m-box m-justify-bet m-aln-center m-pos-f m-bb1 m-head-top m-main">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg class='m-style-svg m-svg-def' @click='goBack'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
        <span>充值</span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end"></div>
    </header>
    <div style="height: 100vh; display: flex; align-items: center; font-size: 50px; justify-content: center">敬请期待...</div>
  </div>
</template>

<script>
export default {
  name: "WalletRecharge"
};
</script>

<style lang="less">
</style>
