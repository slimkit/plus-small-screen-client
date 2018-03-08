<template>
  <div :class="prefixCls" @click="handleWrapClick" :style="styles" v-show='visible'>
    <div :class="`${prefixCls}-close`" v-if='closable' @click.stop='close'>
      <span></span>
      <span></span>
    </div>
    <div :class="`${prefixCls}-body`" @click.stop='handleBodyClick'>
      <slot>
        <div :class="`${prefixCls}-wrap`">
          <div :class="`${prefixCls}-content`">这是一个弹层</div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
const prefixCls = 'v-modal';
let scrollTop;
export default {
  name: 'v-modal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    styles: {
      type: Object,
      default: () => {
        return {
          backgroundColor: 'rgba(0, 0, 0, .2)'
        };
      }
    },
    closable: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      prefixCls,
      visible: this.value
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      if (val) {
        scrollTop = document.scrollingElement.scrollTop;
        document.body.classList.add(`${this.prefixCls}-open`);
        document.body.style.top = -scrollTop + 'px';
      } else {
        document.body.classList.remove(`${this.prefixCls}-open`);
        document.scrollingElement.scrollTop = scrollTop;
      }
    }
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit('input', false);
      this.$emit('on-cancel');
    },
    handleWrapClick() {
      if (this.maskClosable) {
        this.close();
      }
    },
    handleBodyClick() {}
  },
  mounted() {}
};
</script>
<style lang='less'>
@modal-prefix: v-modal;
body {
  &.@{modal-prefix}-open {
    position: fixed;
    width: 100%;
  }
}
.@{modal-prefix} {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  &-close {
    position: absolute;
    top: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: rgba(0, 0, 0, 0.4);
    span {
      width: 40px;
      height: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.9); /*no*/
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      &:nth-child(1) {
        transform: rotate(45deg);
      }
      &:nth-child(2) {
        transform: rotate(-45deg);
      }
    }
  }
  &-wrap {
    text-align: center;
    overflow: hidden;
    margin: auto;
    padding: 50px;
    width: 500px;
    min-height: 600px;
    font-size: 28px;
    border-radius: 10px;
    background-color: #fff;
  }
  &-content {
    width: 100%;
    height: 100%;
  }
}
</style>
