<template>
  <transition name="pop">
    <div
      v-if="show"
      class="m-box-model m-pos-f"
      style="background-color: #f4f5f6"
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
        <div class="m-box m-aln-center m-justify-center m-flex-grow1 m-head-top-title">
          <span>打赏</span>
        </div>
        <div class="m-box m-aln-center m-justify-end m-flex-grow1 m-text-r">
          <button
            :disabled="!(amount > 0)"
            class="m-btn"
            @click.stop.prevent="resetProps">重置</button>
        </div>
      </header>
      <main class="m-box-model m-aln-center m-justify-center">
        <div class="m-box-model m-lim-width m-main">
          <div class="m-pinned-amount-btns">
            <p class="m-pinned-amount-label">选择打赏积分</p>
            <div class="m-box m-aln-center ">
              <button
                v-for="item in items"
                :key="item"
                :style="{ width: `${1 / items.length * 100}%` }"
                :class="{ active: ~~amount === ~~item && !customAmount }"
                class="m-pinned-amount-btn"
                @click="chooseDefaultAmount(item)">{{ ~~item }}</button>
            </div>
          </div>
          <div class="m-box m-aln-center m-justify-bet m-bb1 m-bt1 m-pinned-row plr20 m-pinned-amount-customize">
            <span>自定义金额</span>
            <div class="m-box m-aln-center">
              <input
                v-model="customAmount"
                type="number"
                class="m-text-r"
                pattern="[0-9]*"
                placeholder="输入积分"
                oninput="value=value.slice(0,8)">
              <span>积分</span>
            </div>
          </div>
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
            <span v-else>确定</span>
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
  name: "Reward",
  data() {
    return {
      show: false,
      amount: null,
      loading: false,
      customAmount: null,
      type: "",
      api: noop,
      callback: noop,
      payload: {}
    };
  },
  computed: {
    items() {
      return this.$store.state.CONFIG.site.reward.amounts.split(",") || [];
    },
    disabled() {
      return !this.amount > 0;
    }
  },
  watch: {
    customAmount(val) {
      this.amount = ~~val;
    }
  },
  created() {
    /**
     * 弹出打赏窗口 (hooks -> reward)
     * @author mutoe <mutoe@foxmail.com>
     * @param {Object} options
     * @param {string} options.type 打赏的类型
     * @param {AxiosPromise} options.api 打赏的 api，接受 axios promise 对象
     * @param {string|Object} options.payload api 的第一个参数，取决于 api
     * @param {requestCallback} [options.callback] 打赏成功后的回调方法, 接受一个参数 amount 打赏金额
     */
    bus.$on("reward", options => {
      const { type, api, payload, callback = noop } = options;
      this.type = type;
      this.api = api;
      this.payload = payload;
      this.callback = callback;
      this.open();
    });
  },
  methods: {
    reward() {
      if (this.loding || !this.type) return;
      this.loading = true;
      const params = {
        amount: ~~this.amount
      };
      this.api(this.payload, params)
        .then(() => {
          this.loading = false;
          this.$Message.success("打赏成功");
          this.callback(params.amount);
          this.$nextTick(this.cancel);
        })
        .catch(({ response: { data: message } }) => {
          message && this.$Message.error(message);
          this.loading = false;
        });
    },
    handleOk() {
      this.reward();
    },
    chooseDefaultAmount(amount) {
      this.customAmount && (this.customAmount = null);
      this.amount = amount;
    },
    resetProps() {
      this.customAmount = null;
      this.amount = null;
    },
    open() {
      this.show = true;
      this.scrollable = false;
    },
    cancel() {
      this.show = false;
      this.type = "";
      this.api = noop;
      this.callback = noop;
      this.payload = {};
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
