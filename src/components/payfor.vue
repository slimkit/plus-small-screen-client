<template>
<div @touchmove.prevent>
    <transition name='toast'>
      <div v-if='show' class="m-pop-box" @click='cancel'></div>
    </transition>
    <transition name='popr'>
      <div v-if='show' class="m-box-model m-justify-bet m-payfor-box">
        <h2 class="m-payfor-head">
          <slot name="title">
            <span>{{ title }}</span>
          </slot>
        </h2>
        <div class="m-payfor-body">
          <h3 class="m-payfor-amount">{{ amount.toFixed(2) }}</h3>
          <p>您只需{{ amount.toFixed(2) }}{{ currency_name }}就可查看图片</p>
        </div>
        <div class="m-payfor-foot">
          <button class="m-payfor-btn primary" @click="handelOk">购买</button>
          <button class="m-payfor-btn" @click="handelCancel">返回</button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import bus from "@/bus.js";
const noop = () => {};
export default {
  name: "pay-for",
  data() {
    return {
      node: 0,
      amount: 0,
      show: false,
      scrollTop: 0,
      title: "购买支付"
    };
  },
  computed: {
    currency_name() {
      return (
        ((this.$store.state.CONFIG || {}).site || {}).currency_name.name ||
        "积分"
      );
    }
  },
  created: function() {
    bus.$on("payfor", options => {
      const { title, amount, onOk, onCancel, node, onSuccess } = options;
      title && (this.title = title);
      node && (this.node = node);
      (amount || +amount === 0) && (this.amount = amount);
      typeof onOk === "function" && (this.onOk = onOk);
      typeof onCancel === "function" && (this.onCancel = onCancel);
      typeof onSuccess === "function" && (this.onSuccess = onSuccess);
      this.show = true;
    });
  },
  watch: {
    show(val) {
      if (val) {
        this.scrollTop = document.scrollingElement.scrollTop;
        document.body.classList.add("m-pop-open");
        document.body.style.top = -this.scrollTop + "px";
      } else {
        document.body.style.top = "";
        document.body.classList.remove("m-pop-open");
        document.scrollingElement.scrollTop = this.scrollTop;
      }
    }
  },
  methods: {
    onOk() {},
    onCancel() {},
    onSuccess() {},
    handelOk() {
      this.node &&
        this.$http
          .post(`/currency/purchases/${this.node}`)
          .then(({ data }) => {
            this.onSuccess(data);
          })
          .catch(() => {
            this.$Message.error("支付失败!");
          });
      this.onOk();
      this.$nextTick(this.cancel);
    },
    handelCancel() {
      this.onCancel();
      this.$nextTick(this.cancel);
    },
    call() {
      this.show = true;
    },
    cancel() {
      this.node = null;
      this.show = false;
      this.onOk = noop;
      this.onCancel = noop;
      this.onSuccess = noop;
    }
  }
};
</script>

<style lang='less'>
.m-payfor-box {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  padding: 0 50px 50px;
  width: 500px;
  height: 600px;
  border-radius: 10px;
  background-color: @body-bg;
}
.m-payfor-head {
  padding: 40px 0;
  color: #333;
  text-align: center;
  font-size: 32px;
  border-bottom: 1px solid @border-color; /*no*/
}
.m-payfor-body {
  margin: 70px 0;
  font-size: 28px;
  line-height: 40px;
  text-align: center;
  color: @text-color3;
  .m-payfor-amount {
    margin-bottom: 30px;
    font-size: 60px;
    color: #fca308;
    letter-spacing: 1px;
  }
}
.m-payfor-foot {
  .m-payfor-btn {
    width: 100%;
    height: 70px;
    line-height: 70px;
    border-radius: 6px;
    color: @primary;
    border: 1px solid @primary; /*no*/
    background-color: transparent;
    + .m-payfor-btn {
      margin-top: 20px;
    }
    &.primary {
      color: #fff;
      background-color: @primary;
    }
  }
}
</style>
