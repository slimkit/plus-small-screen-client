<template>
  <div class="pay-panel">
    <div class="pay-panel-head">
      <slot name='head'>
        <p class="pay-panel-title">购买支付</p>
      </slot>
    </div>
    <div class="pay-panel-body">
      <div class="pay-panel-body-price">{{ price }}</div>
      <div class="pay-panel-body-content" v-html='content'></div>
    </div>
    <div class="pay-panel-foot">
      <slot name='foot'>
        <button class="primary" @click='ok' :disabled="loading">
          确定
          <v-icon width='0.32' height='0.32' v-if='loading' class='rotate' type='base-loading'></v-icon>
        </button>
        <button @click='cancel'>取消</button>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "payModal",
  props: {
    content: {
      required: true
    },
    price: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    cancel() {
      this.$emit("on-close");
    },
    ok() {
      this.loading = true;
      this.$emit("on-ok", this.cancel);
    }
  }
};
</script>
<style lang='less'>
@pay-prefix: pay;
.@{pay-prefix} {
  &-panel {
    color: #999;
    font-size: 30px;
    padding: 40px 50px;
    width: 500px;
    min-height: 600px;
    text-align: center;
    background-color: #fff;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-head {
      color: #333;
      height: 70px;
      line-height: 35px;
      border-bottom: 1px solid #ededed; /*no*/
      p {
        margin: 0;
      }
    }
    &-body {
      flex: 1 1 auto;
      max-height: 400px;
      margin: 30px 0;
      overflow: auto;
      &-price {
        color: #fca308;
        font-size: 60px;
      }
    }
    &-foot {
      button {
        width: 100%;
        height: 70px;
        line-height: 70px;
        font-size: 30px;
        color: #59b6d7;
        background-color: #fff;
        border: 1px solid #59b6d7; /*no*/
        border-radius: 6px;
        & + button {
          margin-top: 20px;
        }
        &.primary {
          color: #fff;
          background-color: #59b6d7;
          &[disabled] {
            background-color: #ccc;
            border-color: #ccc;
          }
        }
      }
    }
    &-title {
      font-size: 32px;
    }
  }
}
</style>
