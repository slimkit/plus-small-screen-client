<template>
  <div @click='toInfo' class="wallet-detail-item">
    <div class="wallet-detail-item--time" v-html='created_at'></div>
    <div class="wallet-detail-item--body">
      {{ detail.subject }}
    </div>
    <div class="wallet-detail-item--count">
      {{ detail.action ? '+' : '-' }}{{ detail.amount.toFixed(2) }}
    </div>
  </div>
</template>
<script>
const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
function splitYMD(date) {
  date = date || new Date();
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const w = week[date.getDay()];
  const h = (date.getHours() + "").padStart(2, 0);
  const m = (date.getMinutes() + "").padStart(2, 0);
  return {
    Y,
    M,
    D,
    w,
    d: (M + "").padStart(2, 0) + "-" + (D + "").padStart(2, 0),
    t: h + ":" + m
  };
}
export default {
  name: "WalletDetailItem",
  props: {
    detail: {
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    created_at() {
      const now = splitYMD(new Date());
      const time = splitYMD(
        new Date(this.detail.created_at.replace(/-/g, "/"))
      );
      let D;
      if (time.Y < now.Y) {
        D = time.d;
      } else if (time.M < now.M) {
        D = time.d;
      } else if (now.D - time.D > 1) {
        D = time.w;
      } else if (now.D - time.D === 1) {
        D = "昨天";
      } else if (now.D - time.D === 0) {
        D = "今天";
      }
      return `<p>${D}</p><p>${time.t}</p>`;
    }
  },
  methods: {
    toInfo() {
      this.$emit("selected", this.detail);
    }
  }
};
</script>
<style lang='less' src='../style/WalletDetailItem.less'>
</style>
