<template>
  <transition name='toast'>
    <div v-if='show' class="m-box-model m-pos-f" style="background-color: #f4f5f6; z-index: 101">
      <header class="m-box m-aln-center m-head-top m-main m-bb1">
        <div class="m-flex-grow1">
          <svg class="m-style-svg m-svg-def" @click="cancel">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
          </svg>
        </div>
        <div class="m-flex-grow1 m-text-c m-head-top-title">
          <span>申请置顶</span>
        </div>
        <div class="m-flex-grow1 m-text-r"></div>
      </header>
      <main class="m-box-model m-aln-center m-justify-center">
        <div class="m-box-model m-lim-width m-main">
          <div class="m-pinned-amount-btns">
            <p class="m-pinned-amount-label">选择置顶天数</p>
            <div class="m-box m-aln-center ">
                <button 
                  :key="item"
                  v-for="item in items"
                  class="m-pinned-amount-btn"
                  :style="{ width: `${1 / items.length * 100}%` }"
                  :class="{ active: ~~day === ~~item }"
                  @click="chooseDefaultDay(item)">{{((~~item))}} D</button>

            </div>
          </div>
          <div class="m-box m-aln-center m-justify-bet m-bb1 m-bt1 m-pinned-row plr20 m-pinned-amount-customize">
            <span>置顶金额</span>
            <div class="m-box m-aln-center">
              <input type="number" v-model="customAmount" placeholder="输入金额" dir="rtl">
              <span>{{ currency_name }}</span>
            </div>
          </div>
          <div class="m-box m-aln-center m-justify-bet m-bb1 m-bt1 m-pinned-row plr20 m-pinned-amount-customize">
            <span>总金额</span>
            <div class="m-box m-aln-center">
              <input 
              dir="rtl"
              type="number"
              disabled="true"
              readonly="true"
              placeholder="总金额"
              v-model="amount"
              pattern="[0-9]*"
              style="background-color: transparent">
              <span>{{ currency_name }}</span>
            </div>
          </div>
        </div>
        <div class="plr20 m-lim-width" style="margin-top: 0.6rem">
          <button
          :disabled="disabled || loading"
          class="m-long-btn m-signin-btn"
          @click="handleOk">
            <svg v-if="loading" class="m-style-svg m-svg-def">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-loading"></use>
            </svg>
            <span v-else>申请置顶</span>
          </button>
        </div>
      </main>
    </div>
  </transition>
</template>
<script>
import bus from "@/bus.js";
const noop = () => {};
export default {
  name: "apply-top",
  data() {
    return {
      show: false,
      loading: false,
      customAmount: null,
      day: 0,
      applyType: ""
    };
  },
  computed: {
    currency_name() {
      return (
        (((this.$store.state.CONFIG || {}).site || {}).currency_name || {})
          .name || "积分"
      );
    },
    amount() {
      const total = this.day * this.customAmount;
      return total > 0 ? total.toFixed(2) : "";
    },
    items() {
      return [1, 5, 10];
    },
    disabled() {
      return !this.amount > 0;
    }
  },
  created() {
    bus.$on("apply-top", () => {
      this.open();
    });
    bus.$on("apply-top:feed", feedID => {
      this.applyType = "feed";
      this.open();
      this.applyTopFeed = () => {
        if (this.loading) return;
        this.loading = true;
        // /feeds/:feed/pinneds
        this.$http
          .post(`/feeds/${feedID}/pinneds`, {
            amount: ~~this.amount,
            day: this.day
          })
          .then(({ data = {} }) => {
            this.loading = false;
            this.$Message.success(data);
            this.$nextTick(this.cancel);
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
          });
      };
    });
  },
  methods: {
    applyTopFeed() {},
    handleOk() {
      this.applyType === "feed" ? this.applyTopFeed() : "";
    },
    chooseDefaultDay(day) {
      this.day = day;
    },
    resetProps() {
      this.amount = null;
    },
    open() {
      this.show = true;
      this.scrollable = false;
    },
    cancel() {
      this.show = false;
      this.applyType = "";
      this.day = null;
      this.customAmount = null;
      this.applyTopFeed = noop;
      this.scrollable = true;
    }
  }
};
</script>

<style>
.m-pinned-row {
  font-size: 0.3rem;
  height: 1rem;
}
.plr20 {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
