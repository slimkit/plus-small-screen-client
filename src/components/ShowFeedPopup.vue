<template>
  <mt-popup
    v-model="showPopup.show"
    position="bottom"
    style="width: 100%;"
    :class="$style.showPopUp"
  >
    <div>
      <Button 
        @click="setSex(1)" 
        size="large" 
        :class="$style.sexOptions" 
        type="text" :long="true"
      >
        收藏
      </Button>
      <Button 
        @click="setSex(2)" 
        size="large" 
        :class="$style.sexOptions" 
        type="text" 
        :long="true"
        v-if="showPopup.me"
      >
        删除动态
      </Button>
      <Button 
        @click="handleShowPopup(false)" 
        size="large" 
        :class="$style.sexOptions" 
        type="text" 
        :long="true"
      >
        取消
      </Button>
    </div>
  </mt-popup>
</template>

<script>
  import { SHOWPOPUP, CLOSEPOPUP } from '../stores/types';
  const showFeedPopup = {
    computed: {
      // ...mapState({
      //   showPopup: this.$store.getters[SHOWPOPUP]
      // })
      showPopup () {
        return this.$store.getters[SHOWPOPUP];
      }
    },
    methods: {

    }
  }

  export default showFeedPopup;
</script>

<style lang="less" module>
  .showPopUp {
    width: 100%;
    background: rgba(0, 0, 0, 0);
    .sexOptions {
      border-bottom: 1px solid #ededed;
      color: #333;
      border-radius: 0;
      font-size: 16px;
      &:last-child {
        margin-top: 5px;
      }
    }
  }
</style>
