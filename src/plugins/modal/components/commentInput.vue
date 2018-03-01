<template>
  <div class="comment-input">
    <textarea
    :maxlength="maxlength"
    autofocus="true"
    :placeholder="placeholder"
    ref='input'
    :value="currentValue"
    @keyup.ctrl.enter="handleEnter"
    @input="handleInput" />
    <div class="comment-input-append">
      <template v-if='len > 200'>
        <p>{{ len }}/{{maxlength}}</p>
      </template>
      <button :disabled="disabled" @click='handleDone'>
        <svg v-if='loading'>
          <use xlink:href="#base-loading"></use>
        </svg>
        <template v-else>发送</template>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'commentInput',
  props: {
    focus: Boolean,
    placeholder: {
      type: String,
      default: '随便说说~',
      requried: true
    },
    maxlength: {
      type: [Number, String],
      default: 255,
      validator(val) {
        return typeof +val === 'number';
      }
    }
  },
  data() {
    return {
      loading: false,
      currentValue: ''
    };
  },
  computed: {
    disabled() {
      return !(this.len > 0 && !this.loading);
    },
    len() {
      return this.currentValue.length;
    }
  },
  methods: {
    handleDone() {
      this.loading = true;
      if (this.currentValue) {
        this.$emit('on-ok', this.currentValue);
      }
    },
    handleInput(event) {
      this.loading = false;
      let value = event.target.value;
      this.$emit('input', value);
      this.setCurrentValue(value);
    },
    handleEnter() {
      this.handleDone();
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.currentValue = value;
      this.resizeTextarea(this.$refs.input);
    },
    resizeTextarea(el) {
      const originalHeight = el.style.height;
      el.style.height = '';
      let endHeight = el.scrollHeight;
      if (el.scrollHeight === 0) {
        el.style.height = originalHeight;
        return;
      }
      el.style.height = endHeight + 'px';
    }
  },
  mounted() {
    this.$refs.input.focus();
  }
};
</script>
<style lang='less'>
.comment-input {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 15px 20px;
  min-height: 100px;
  background-color: #fafafa;
  display: flex;
  align-items: flex-end;
  > * {
    flex: 0 0 auto;
  }
  textarea {
    overflow-y: scroll;
    flex: 1 1 auto;
    padding: 0;
    height: 26*1.5px;
    min-height: 26*1.5px;
    line-height: 1.5;
    color: #000;
    font-size: 26px;
    background: none;
    resize: none;
    border-radius: 0;
    border-bottom: 1px solid #59b6d7;
    /*no*/
  }
  p {
    text-align: center;
    color: #999;
    margin-bottom: 15px;
    font-size: 20px;
    margin-left: 15px;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-left: 15px;
    width: 100px;
    height: 50px;
    color: #fff;
    background-color: #59b6d7;
    border-radius: 2px;
    /*no*/
    &[disabled] {
      background-color: #ccc;
    }
    svg {
      width: 28px;
      height: 28px;
      animation: rotate360 2s infinite linear;
    }
  }
  &-append {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
