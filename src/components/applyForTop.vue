<template>
  <transition name="toast">
    <div 
      v-if="show" 
      class="m-box-model m-pos-f" 
      style="background-color: #f4f5f6; z-index: 101" 
      @touchmove.prevent>
      <header class="m-box m-aln-center m-head-top m-main m-bb1">
        <div class="m-flex-grow1">
          <svg 
            class="m-style-svg m-svg-def" 
            @click="cancel">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#base-back"/>
          </svg>
        </div>
        <div class="m-flex-grow1 m-text-c m-head-top-title">
          <span>申请置顶</span>
        </div>
        <div class="m-flex-grow1 m-text-r"/>
      </header>
      <main class="m-box-model m-aln-center m-justify-center">
        <div class="m-box-model m-lim-width">
          <div class="m-pinned-amount-btns m-main">
            <p class="m-pinned-amount-label">选择置顶天数</p>
            <div class="m-box m-aln-center ">
              <button
                v-for="item in items"
                :key="item"
                :class="{ active: ~~day === ~~item }"
                :style="{ width: `${1 / items.length * 100}%` }"
                class="m-pinned-amount-btn"
                @click="chooseDefaultDay(item)">{{ ((~~item)) }} 天</button>
            </div>
          </div>
          <div
            class="m-box m-aln-center m-justify-bet m-bb1 m-pinned-row plr20 m-pinned-amount-customize m-main"
            style="margin-top: .2rem">
            <span>置顶金额</span>
            <div class="m-box m-aln-center">
              <input
                v-model="customAmount"
                type="number"
                pattern="[0-9]*"
                placeholder="输入金额"
                oninput="value=value.slice(0,8)"
                class="m-flex-grow1 m-flex-shrink1 m-text-r">
              <span>{{ currency_name }}</span>
            </div>
          </div>
          <div class="m-box m-aln-center m-justify-bet m-pinned-row plr20 m-pinned-amount-customize m-main">
            <span>总金额</span>
            <div class="m-box m-aln-center">
              <input
                v-model="amount"
                class="m-flex-grow1 m-flex-shrink1 m-text-r"
                type="number"
                pattern="[0-9]*"
                disabled="true"
                readonly="true"
                placeholder="总金额"
                style="background-color: transparent">
              <span>{{ currency_name }}</span>
            </div>
          </div>
          <p
            class="placeholder m-flex-grow1 m-flex-shrink1"
            style="padding: .3rem .2rem 0; font-size: .24rem;"><!-- 最近置顶平均{{  }},  -->可用积分{{ currencySum }}</p>
        </div>
        <div 
          class="plr20 m-lim-width" 
          style="margin-top: 0.6rem">
          <button
            :disabled="disabled || loading"
            class="m-long-btn m-signin-btn"
            @click="handleOk">
            <svg 
              v-if="loading" 
              class="m-style-svg m-svg-def">
              <use 
                xmlns:xlink="http://www.w3.org/1999/xlink" 
                xlink:href="#base-loading"/>
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
import { refreshCurrentUserInfo } from "@/api/user.js";

const noop = () => {};

export default {
  name: "ApplyTop",
  data() {
    return {
      day: 0,
      show: false,
      currencySum: 0,
      loading: false,
      customAmount: null,
      applyType: "", // 申请置顶的类型
      applyApi: noop, // 申请置顶的api
      applyPayload: {} // 申请置顶的负载数据，如feedID等
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
      return this.day * this.customAmount;
    },
    items() {
      return [1, 5, 10];
    },
    disabled() {
      return this.amount < 0;
    }
  },
  created() {
    /**
     * 弹出申请置顶窗口 (hooks -> applyTop)
     * @author mutoe <mutoe@foxmail.com>
     * @param {Object} options
     * @param {String} options.type 申请置顶类型
     * @param {Promise} options.api 申请置顶的 api，需要返回 axios promise 对象
     * @param {*} options.payload 申请置顶 api 的第一个参数，可以为任何类型的值，取决于 api 中的设定
     */
    bus.$on("applyTop", ({ type, api, payload }) => {
      this.applyType = type;
      this.applyApi = api;
      this.applyPayload = payload;
      this.open();
    });
  },
  methods: {
    applyTop() {
      if (this.loading || !this.applyType) return;
      this.loading = true;
      const params = {
        amount: ~~this.amount,
        day: this.day
      };

      this.applyApi(this.applyPayload, params)
        .then(({ data = {} }) => {
          this.loading = false;
          this.$Message.success(data);
          this.$nextTick(this.cancel);
        })
        .catch(err => {
          console.warn(err);
          this.loading = false;
        });
    },
    handleOk() {
      this.applyTop();
    },
    chooseDefaultDay(day) {
      this.day = day;
    },
    resetProps() {
      this.day = this.items[0];
    },
    open() {
      this.show = true;
      this.scrollable = false;

      refreshCurrentUserInfo().then(({ currency: { sum = 0 } }) => {
        this.currencySum = sum;
      });
      this.day = this.items[0];
    },
    cancel() {
      this.show = false;
      this.day = null;
      this.customAmount = null;
      this.scrollable = true;
      this.applyType = "";
      this.applyApi = noop;
      this.applyPayload = {};
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
