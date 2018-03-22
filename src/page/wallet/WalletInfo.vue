<template>
  <div class="wallet-info--detail">
    <div class="wallet-info--detail--head">账单详情</div>
    <div class="wallet-info--detail--body">
      <p>交易{{ detail.status ? '成功' : '失败' }}</p>
      <h2>{{ detail.action ? '+' : '-' }}{{ detail.amount.toFixed(2) }}</h2>
    </div>
    <div class="wallet-info--detail--content">
      <div class="wallet-info--detail--content-row">
        <span class="wallet-info--detail--content-row--label">{{ detail.action ? '收' : '付' }}款人</span>
        <div><v-avatar :sex='user.sex' :src='user.avatar' size='small'></v-avatar> {{ user.name }}</div>
      </div>
      <div class="wallet-info--detail--content-row">
        <span class="wallet-info--detail--content-row--label">交易说明</span>
        <div>{{ detail.body }}</div>
      </div>
      <div class="wallet-info--detail--content-row">
        <span class="wallet-info--detail--content-row--label">交易时间</span>
        <div>{{ detail.created_at }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "WalletInfoDetail",
  props: ["detail"],
  computed: {
    user() {
      return this.$store.state.CURRENTUSER;
    }
  }
};
</script>
<style lang='less'>
.wallet-info--detail {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  z-index: 111;

  width: 650px;
  height: 650px;

  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;

  &--head {
    height: 90px;
    line-height: 90px;
    font-size: 32px;
    text-align: center;
    border-bottom: 1px solid #ededed; /*no*/
  }
  &--content {
    background-color: #fff;
    padding: 0 20px;
    &-row {
      display: flex;
      align-items: center;
      min-height: 100px;
      font-size: 24px;
      line-height: 1;
      border-bottom: 1px solid #ededed; /*no*/
      &--label {
        color: #ccc;
        width: 25 * 4px;
      }
      > div {
        margin-left: 15px;
      }
    }
  }
  &--body {
    padding: 20px;
    text-align: center;
    background-color: #fff;
    font-size: 28px;
    color: #999;
    border-bottom: 1px solid #ededed; /*no*/
    p {
      text-align: left;
      margin: 0;
    }
    h2 {
      margin: 0;
      font-size: 100px;
      line-height: 1;
      color: #333;
    }
  }
}
</style>
