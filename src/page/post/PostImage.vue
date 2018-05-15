<template>
  <div class="m-pos-f m-box-model m-main">
    <header class="m-box-model m-fd-row m-head-top m-justify-bet m-aln-center m-lim-width m-bb1">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <a class="m-send-btn" href="javascript:;" @click='goback'>取消</a>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">发布动态</div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end">
        <svg v-if="loading" class="m-style-svg m-svg-def">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-loading"></use>
        </svg>
        <a 
          v-else
          class="m-send-btn"
          :class="{ disabled }"
          @click.prevent.stop="sendmessage">发布</a>
      </div>
    </header>
    <main
       class="m-reles-con m-lim-width m-box-model m-flex-shrink1"
       @click.self='areaFocus'>
       <content-text
       :rows='4'
       class='m-reles-txt-wrap'
       ref="contentText" />
      <image-list :edit="pinned"/>
    </main>
    <footer class="m-box-model m-flex-shrink1 m-aln-center" style="z-index: 10">
      <v-switch
       class="m-box m-bt1 m-bb1 m-lim-width m-pinned-row"
       type="checkbox"
       v-model="pinned">
         <slot>是否收费</slot>
       </v-switch>
    </footer>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ImageList from "./components/ImageList.vue";
import ContentText from "./components/ContentText.vue";
export default {
  name: "post-image",
  components: {
    ImageList,
    ContentText
  },
  data() {
    return {
      pinned: false,

      curpos: 0,
      loading: !1,
      contentText: "",
      scrollHeight: 0
    };
  },
  computed: {
    ...mapGetters(["compose", "composePhoto"]),
    disabled() {
      const imageAllCompleted = this.composePhoto.some(img => {
        return !!img.id;
      });
      return !(
        this.composePhoto.length > 0 ||
        (this.compose.length > 0 && imageAllCompleted)
      );
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
              images: this.composePhoto,
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
