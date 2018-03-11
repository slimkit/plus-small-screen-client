<template>
    <transition name='composeFadeInRightBig'>
      <div class="m-wrapper m-wbox">
        <div class="m-pos-f m-box-model m-main">
          <header class="m-box-model m-fd-row m-head-top m-justify-bet m-aln-center m-lim-width">
            <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
              <a class="m-send-btn" href="javascript:;" @click='goback'>取消</a>
            </div>
            <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">发布动态</div>
            <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end">
              <a 
                class="m-send-btn"
                :class="{ disabled }"
                href="javascript:;">发布</a> 
            </div>
          </header>
          <main
           class="m-reles-con m-lim-width m-box-model m-flex-shrink1 m-flex-grow1"
           @click.stop='areaFocus'>
           <content-text
           :rows='8'
           class='m-reles-txt-wrap'
           ref="contentText" />
          </main>
        </div>
    </div>
  </transition>
</template>
<script>
import { mapGetters } from "vuex";
import ContentText from "./components/ContentText.vue";
export default {
  name: "post-feed",
  components: {
    ContentText
  },
  data() {
    return {
      curpos: 0,
      contentText: "",
      scrollHeight: 0
    };
  },
  computed: {
    ...mapGetters(["compose", "composePhoto"]),
    disabled() {
      return !(this.composePhoto.length > 0 || this.compose.length > 0);
    }
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    areaFocus() {
      this.$refs.contentText.areaFocus();
    },
    setContentText(txt) {
      this.$refs.contentText.setContentText(txt);
    },
    successCallback() {
      this.$refs.contentText.clean();
    },
    sendmessage() {}
  },
  mounted() {}
};
</script>

<style lang='less'>
.m-head-top {
  height: 90px;
  border: 1px solid #dedede;
  padding: 0 30px;
  font-size: 32px;
}

.m-head-top-title {
  font-size: 36px;
}
.m-reles {
  &-con {
    overflow-y: auto;
    padding: 0 50px;
    .m-wz-def {
      width: 100%;
      font-size: 30px;
    }
    textarea {
      background-color: transparent;
      outline: 0;
      border: 0;
      font-size: inherit;
      resize: none;
      width: 100%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
    }
  }

  &-body {
    overflow: hidden;
    margin-bottom: 35px;
    margin-top: 35px;
    height: 270px;
    border-radius: 5px;
  }
}
</style>
