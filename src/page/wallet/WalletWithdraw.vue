<template lang="html">
  <div class="m-box-model m-pos-f p-wallet-withdraw">
    <header class="m-box m-justify-bet m-aln-center m-bb1 m-head-top m-main m-lim-width">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg class='m-style-svg m-svg-def' @click='goBack'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
        <span>提现</span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end"></div>
    </header>
    <main class="m-box-model m-aln-center m-justify-center m-flex-grow1 m-main m-lim-width">
      <p style="font-size: 24px">
        <span class="rotate" style="display: inline-block; font-size: 28px; margin-right: 5px;vertical-align:middle">☢</span>
        <span>提现功能开发中, 敬请期待...</span>
      </p>
    </main>
  </div>
</template>
<script>
export default {
  name: "wallet-withdraw"
};
</script>
