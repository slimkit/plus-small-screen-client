<template>
  <div class="notice-root" v-show="show">
    <div :class="$style.notice">
      <div :class="$style.content">
        <ErrorIcon style="margin-right: 8px;" v-if="!status" height="20" width="20" color="#f00" />
        <OkIcon style="margin-right: 8px;" v-if="status" height="20" width="20" color="#59b6d7" />
        {{ text }}
      </div>
    </div>
    <div :class="$style.commonWrapper"></div>
  </div>
</template>

<script>
  import { NOTICE } from '../stores/types';
  import { mapState } from 'vuex';
  import OkIcon from '../icons/Ok';
  import ErrorIcon from '../icons/Error';

  const noticeText = {
    components: {
      ErrorIcon,
      OkIcon
    },
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
    display: flex;

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