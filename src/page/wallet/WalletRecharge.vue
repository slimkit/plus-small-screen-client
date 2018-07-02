<template>
  <div class="m-box-model p-wallet-recharge m-pos-f">
    <header class="m-box m-justify-bet m-aln-center m-bb1 m-head-top m-main m-lim-width">
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
        <span>充值</span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end"/>
    </header>
    <main class="m-box-model m-aln-center m-justify-center m-flex-grow1 m-main m-lim-width">
      <p style="font-size: 24px">
        <span 
          class="rotate" 
          style="display: inline-block; font-size: 28px; margin-right: 5px;vertical-align:middle">☢</span>
        <span>充值功能开发中, 敬请期待...</span>
      </p>
    </main>
  </div>
</template>
<script>
export default {
  name: "WalletRecharge"
};
</script>
