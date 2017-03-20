<template>
  <div :class="$style.notice">
    <div :class="$style.content">
      <Icon v-if="status" type="ios-checkmark" :class="$style.success"></Icon>
      <Icon v-if="!status" type="android-alert" :class="$style.error"></Icon>
      {{ text }}
    </div>
  </div>
  <div :class="$style.commonWrapper"></div>
</template>

<script>
  import { NOTICE } from '../stores/types';
  const noticeText = {
    props: {
      // 提示文字
      text: {
        type: [String],
        default: ''
      },
      // 提示状态
      status: {
        type: [Boolean],
        default: true
      },
      time: {
        type: [Number],
        default: 2000
      },
      show: {
        type: [Boolean],
        default: false
      }
    },
    methods: {
      timer () {
        if (this.time > 0) {
          this.show = true;
          this.time -= 1000;
          if(this.time == 0) {
            this.show = false;
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '',
                time: 1000,
                status: true,
                show: false
              })
            })
            return;
          }
          setTimeout(this.timer(), 1000)
        }
      }
    },
    mounted () {
      this.timer();
    }
  }
  export default noticeText;
</script>

<style lang="scss" module>
  .content {
    padding: 10px 15px;
    background: #fff;
    border-radius: 10px;
    font-size: 14px;
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
  }
</style>