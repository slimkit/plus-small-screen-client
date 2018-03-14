<template>
  <div class="m-box-model m-pos-r">
    <div class="m-box-model m-fd-row m-reles-body">
      <span class="m-wz-def">
        <textarea 
          v-model='contentText'
          :placeholder="placeholder"
          :style="{ height: `${scrollHeight}px` }"
          ref='textarea'
          @focus='focusArea'
          @blur='moveCurPos'
          @input='moveCurPos'
          @keyup.delete='deleteHandler'></textarea>
        <textarea 
          :rows="rows"
          v-model='shadowText'
          style="position: absolute; z-index: -9999; visibility: hidden;"
          ref='shadow'></textarea>
      </span>
    </div>
  </div>
</template>
<script>
/**
 * todo
 * H5_MBLOG_SAVE_CONTENT
 */
import { mapActions } from "vuex";
import LocalEvent from "store";
export default {
  name: "content-text",
  props: {
    type: Number,
    limit: Number,
    rows: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      contentText: "",
      scrollHeight: 0,
      replyPrefix: "",
      curpos: 0
    };
  },
  computed: {
    shadowText() {
      return "blank" + this.contentText;
    },
    fullContentText() {
      return this.contentText;
    },
    placeholder() {
      return "输入要说的话";
    }
  },
  watch: {
    contentText(val, oval) {
      if (val !== oval) {
        this.updateCompose(this.fullContentText);
        LocalEvent.set("H5_POST_SAVE_CONTENT", val);
        this.$nextTick(() => {
          this.scrollHeight = this.$refs.shadow.scrollHeight;
        });
      }
    }
  },
  methods: {
    ...mapActions(["updateCompose"]),
    clean() {
      this.contentText = "";
    },
    deleteHandler() {
      console.log("删除");
    },
    setContentText(txt) {
      this.contentText = txt.trim();
      this.curpos = 0;
      this.areaFocus();
    },
    focusArea() {},
    moveCurPos() {
      this.$refs.textarea && (this.curpos = this.$refs.textarea.selectionStart);
    },
    areaFocus() {
      const textarea = this.$refs.textarea;
      textarea.focus() &&
        this.$nextTick(() => {
          textarea.setSelectionRange(this.curpos, this.curpos);
        });
    }
  },
  mounted() {
    const txt = LocalEvent.get("H5_POST_SAVE_CONTENT");

    txt &&
      ((this.contentText = txt.trim()),
      (this.curpos = this.contentText.length));

    this.$nextTick(() => {
      this.scrollHeight = this.$refs.shadow.offsetHeight;
    });
  },
  destroyed() {
    this.updateCompose("");
  }
};
</script>
