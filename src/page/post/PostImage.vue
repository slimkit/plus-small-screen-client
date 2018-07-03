<template>
  <div class="m-pos-f m-box-model m-main">
    <header class="m-box-model m-fd-row m-head-top m-justify-bet m-aln-center m-lim-width m-bb1">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <a
          class="m-send-btn"
          href="javascript:;"
          @click="beforeGoBack">取消</a>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">发布动态</div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end">
        <svg
          v-if="loading"
          class="m-style-svg m-svg-def">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#base-loading"/>
        </svg>
        <a
          v-else
          :class="{ disabled }"
          class="m-send-btn"
          @click.prevent.stop="sendmessage">发布</a>
      </div>
    </header>
    <main
      class="m-reles-con m-lim-width m-box-model m-flex-shrink1"
      @click.self="areaFocus">
      <content-text
        ref="contentText"
        :rows="8"
        :maxlength="255"
        :placeholder="`输入要说的话，图文结合更精彩哦`"
        class="m-reles-txt-wrap" />
      <image-list
        :edit="pinned"
        style="padding: 0 .3rem .3rem"/>
    </main>
    <footer
      class="m-box-model m-flex-shrink1 m-aln-center"
      style="z-index: 10">
      <v-switch
        v-model="pinned"
        class="m-box m-bt1 m-bb1 m-lim-width m-pinned-row"
        type="checkbox">
        <slot>是否收费</slot>
      </v-switch>
    </footer>
  </div>
</template>
<script>
import bus from "@/bus.js";
import { mapGetters } from "vuex";
import ImageList from "./components/ImageList.vue";
import ContentText from "./components/ContentText.vue";
export default {
  name: "PostImage",
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
      const imageAllCompleted = !this.composePhoto.some(
        img => Object.keys(img).length === 0
      );
      return !(imageAllCompleted && this.composePhoto.length > 0);
    }
  },
  mounted() {},
  methods: {
    beforeGoBack() {
      this.contentText.length > 0
        ? bus.$emit(
            "actionSheet",
            [
              {
                text: "确定",
                method: () => {
                  this.goBack();
                  this.setContentText("");
                }
              }
            ],
            "取消",
            "你还有没有发布的内容,是否放弃发布?"
          )
        : this.goBack();
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
        // 检测是否存在上传失败的图片
        if (this.composePhoto.some(item => Object.keys(item).length === 0)) {
          this.$Message.error("存在上传失败的图片，请确认");
          this.loading = false;
          return;
        }
        if (this.pinned) {
          if (!this.composePhoto.some(item => item.amount > 0)) {
            bus.$emit(
              "actionSheet",
              [
                {
                  text: "应配置至少一张图片收费",
                  method: () => {}
                }
              ],
              "取消"
            );
            this.loading = false;
            return;
          }
        }
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
          })
          .catch(e => {
            this.$Message.error("发送失败，请稍后再试");
            console.warn(e);
            this.loading = false;
          });
      }
    }
  }
};
</script>
