<template>
  <div @touchmove.prevent>
    <transition name="toast">
      <div 
        v-if="show" 
        class="m-pop-box" 
        @click="cancel"/>
    </transition>
    <transition name="pop">
      <div 
        v-if="show" 
        class="m-box-model m-justify-end m-comment-input" 
        @touch.prevent>
        <div class="m-box m-aln-end m-comment-input-wrap">
          <span class="m-box-model m-flex-grow1 m-flex-shrink1 m-justify-end m-wz-def">
            <textarea 
              ref="textarea"
              v-model="contentText"
              :placeholder="placeholder"
              :style="{ height: `${scrollHeight}px` }"
              maxlength="255" 
              @focus="onFocus"
              @blur="moveCurPos"
              @keydown.enter.prevent="sendText"
              @input="moveCurPos"/>
            <textarea 
              ref="shadow"
              v-model="shadowText"
              rows="1" 
              maxlength="255"
              style="position: absolute; z-index: -9999; visibility: hidden;"/>
          </span>
          <div 
            class="m-box-model m-box-justify-end" 
            style="width: 1rem; margin: 0 0 0 15px;">
            <span 
              v-if="contentText.length >= 210" 
              class="m-wz-def" 
              style="font-size: 10px; margin-bottom: 10px">{{ contentText.length }}/255</span>
            <button 
              :disabled="!contentText.length" 
              class="m-comment-submit" 
              @click="sendText">发送</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import bus from "@/bus";
export default {
  name: "CommentInput",
  data() {
    return {
      curpos: 0,
      onOk: null,
      show: false,
      loading: false,
      scrollHeight: 0,
      contentText: "",
      placeholder: "随便说说~"
    };
  },
  computed: {
    shadowText() {
      return "blank" + this.contentText;
    },
    fullContentText() {
      return this.contentText;
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.scrollTop = document.scrollingElement.scrollTop;
        document.body.classList.add("m-pop-open");
        document.body.style.top = -this.scrollTop + "px";

        const txt = this.$lstore.getData("H5_COMMENT_SAVE_CONTENT");
        txt &&
          ((this.contentText = txt.trim() || ""),
          (this.curpos = this.contentText.length));
        this.$nextTick(() => {
          this.$refs.textarea && this.$refs.textarea.focus();
        });
      } else {
        document.body.style.top = "";
        document.body.classList.remove("m-pop-open");
        document.scrollingElement.scrollTop = this.scrollTop;
      }
    },
    contentText(val, oval) {
      if (val !== oval) {
        this.$lstore.setData("H5_COMMENT_SAVE_CONTENT", val);
        this.$nextTick(() => {
          this.$refs.shadow &&
            (this.scrollHeight = this.$refs.shadow.scrollHeight);
        });
      }
    }
  },
  created() {
    bus.$on("commentInput:close", status => {
      status && this.clean();
      this.cancel();
    });
    bus.$on("commentInput", ({ placeholder, onOk }) => {
      typeof placeholder === "string" && (this.placeholder = placeholder);
      typeof onOk === "function" && (this.onOk = onOk);
      this.show = true;
      this.$nextTick(() => {
        this.$refs.shadow &&
          (this.scrollHeight = this.$refs.shadow.scrollHeight);
      });
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.shadow && (this.scrollHeight = this.$refs.shadow.scrollHeight);
    });
  },
  destroyed() {
    this.clean();
  },
  methods: {
    moveCurPos() {
      this.$refs.textarea && (this.curpos = this.$refs.textarea.selectionStart);
    },
    clean() {
      this.contentText = "";
    },
    sendText() {
      if (this.loading) return;
      this.loading = true;

      this.onOk &&
        typeof this.onOk === "function" &&
        this.onOk(this.contentText);

      this.cancel();
    },
    cancel() {
      this.placeholder = "随便说说~";
      this.loading = false;
      this.onOk = null;
      this.show = false;
    },
    onFocus() {
      // 有用 ???
      setTimeout(() => {
        const wH2 = window.innerHeight;
        window.scrollTo(0, wH2 - 70);
      }, 300);
    }
  }
};
</script>
