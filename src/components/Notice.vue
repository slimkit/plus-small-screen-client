<template>
  <div class="notice-root" v-show="show">
    <div :class="$style.notice">
      <div :class="$style.content">
        <Icon v-if="status" type="ios-checkmark" :class="$style.success"></Icon>
        <Icon v-if="!status" type="android-alert" :class="$style.error"></Icon>
        {{ text }}
      </div>
    </div>
    <div :class="$style.commonWrapper"></div>
  </div>
</template>

<script>
  import { NOTICE } from '../stores/types';
  import { mapState } from 'vuex';

  const noticeText = {
    computed: mapState({
      time: state => state.notice.notice.time,
      text: state => state.notice.notice.text,
      show: state => state.notice.notice.show,
      status: state => state.notice.notice.status
    })
  }
  export default noticeText;
</script>

<style lang="scss" module>
  .content {
    padding: 10px 15px;
    background: #fff;
    border-radius: 10px;
    font-size: 14px;
    max-width: 70vw;
    text-align: center;

  }
  .success {
    color: #59b6d7;
    &:before {
      font-size: 18px;
    }
  }
  .error {
    color: red;
    &:before {
      font-size: 18px;
    }
  }
  .notice {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    z-index: 10;
    margin: 0;
    background: rgba(0,0,0,.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
</style>