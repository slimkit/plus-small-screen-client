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
                <svg v-if="loading" class="m-style-svg m-svg-def rotate">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-loading"></use>
                </svg>
              <a 
                v-else
                class="m-send-btn"
                :class="{ disabled }"
                @click="sendmessage"
                href="javascript:;">发布</a>
            </div>
          </header>
          <main
           class="m-reles-con m-lim-width m-box-model m-flex-shrink1 m-flex-grow1"
           @click.self='areaFocus'>
           <content-text
           :rows='8'
           class='m-reles-txt-wrap'
           ref="contentText" />
          <image-list />
          </main>
        </div>
    </div>
  </transition>
</template>
<script>
import { mapGetters } from "vuex";
import ImageList from "./components/ImageList.vue";
import ContentText from "./components/ContentText.vue";
export default {
  name: "post-feed",
  components: {
    ImageList,
    ContentText
  },
  data() {
    return {
      curpos: 0,
      loading: !1,
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
    sendmessage() {
      if (!this.disabled) {
        this.loading = true;
        this.$http
          .post(
            "feeds",
            {
              feed_content: this.compose,
              images: this.composePhoto.map(i => ({ id: i })),
              feed_from: 2,
              feed_mark:
                new Date().valueOf() + "" + this.$store.state.CURRENTUSER.id
            },
            {
              validateStatus: s => s === 201
            }
          )
          .then(({ data: { id, message = ["发布成功"] } }) => {
            if (id && id > 0) {
              this.$Message.success(message);
            }
            this.$router.go(-1);
            this.loading = false;
            this.successCallback();
          });
      }
    }
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
