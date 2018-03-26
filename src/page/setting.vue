<template>
  <div class="p-setting">
    <header class="m-pos-f m-box m-aln-center m-head-top m-main m-bb1">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0">
        <svg style="m-style-svg m-svg-def" @click="goBack">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
    </header>
    <main style="padding-top: 0.9rem">
      <router-link to="/forgot" class="m-box m-aln-center m-justify-bet">
        <span>修改密码</span>
        <svg class="m-style-svg m-svg-def">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
    </main>
  </div>
</template>

<script>
export default {
  name: "setting"
};
</script>
