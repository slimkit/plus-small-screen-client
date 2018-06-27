<template>
  <div class="m-box-model m-pos-r">
    <div class="m-box-model m-reles-body">
      <textarea
        ref='textarea'
        v-model.trim='contentText'
        :placeholder="placeholder"
        :maxlength="maxlength"

        @focus='focusArea'
        @blur='moveCurPos'
        @input='onInput'
        @keyup.delete='deleteHandler'
        :style="{ height: `${scrollHeight}px`}"/>
      <textarea
      ref='shadow'
      :rows="rows"
      v-model='shadowText'
      style="position: absolute; z-index: -9999; visibility: hidden;" />
      <span
        class="m-textarea-count"
        v-show="count > warnLength">
        <b style="color: #f4504d">{{ count }}</b>/{{ maxlength }}
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
export default {
  name: "content-text",
  props: {
    type: Number,
    warnLength: { type: Number, default: 200 },
    maxlength: [Number, String],
    placeholder: { type: String, default: "输入要说的话" },
    rows: { type: Number, default: 3 }
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
    count() {
      return this.contentText.length;
    }
  },
  watch: {
    contentText(val, oval) {
      if (val !== oval) {
        this.updateCompose(this.fullContentText);
        this.$nextTick(() => {
          this.$lstore.setData("H5_POST_SAVE_CONTENT", val);
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
    deleteHandler() {},
    setContentText(txt) {
      this.contentText = txt.trim();
      this.curpos = 0;
      this.areaFocus();
    },
    onInput() {
      this.moveCurPos();
      this.$emit("input");
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
  created() {
    const txt = this.$lstore.getData("H5_POST_SAVE_CONTENT");
    txt &&
      ((this.contentText = txt.trim()),
      (this.curpos = this.contentText.length));
  },
  mounted() {
    this.$nextTick(() => {
      this.scrollHeight = this.$refs.shadow.offsetHeight;
    });
  },
  destroyed() {
    this.updateCompose("");
  }
};
</script>

<style lang="less">
.m-textarea-count {
  position: absolute;
  bottom: 0;
  right: 20px;
  font-size: 24px;
}
</style>
