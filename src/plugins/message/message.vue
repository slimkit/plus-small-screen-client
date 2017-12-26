<template>
    <transition :name="transitionName" @enter="handleEnter" @leave="handleLeave">
        <div :class="classes">
            <v-icon :type='icon' width='0.32rem' height='0.32rem' :class='[`${prefixCls}-icon`]'></v-icon>
            <span>{{ content | plusMessageFirst('这是一条提示') }}</span>
        </div>
    </transition>
</template>
<script>
const prefixCls = 'v-msg'
export default {
  props: {
    type: {
      type: String,
      default: 'message'
    },
    duration: {
      type: Number,
      default: 3
    },
    closable: {
      type: Boolean,
      default: false
    },
    transitionName: String,
    icon: {
      type: String,
      default: 'msg-info'
    },
    content: {
      required: true
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      prefixCls
    }
  },
  computed: {
    classes () {
      return [
        prefixCls,
        `${prefixCls}__${this.type}`
      ]
    }
  },
  methods: {
    clearCloseTimer () {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer)
        this.closeTimer = null
      }
    },
    close () {
      this.clearCloseTimer()
      this.onClose()
      this.$parent.close(this.name)
    },
    handleEnter (el) {
      // if(this.type === 'message') {
      //     el.style.height = el.scrollHeight + 'px';
      // }
    },
    handleLeave (el) {
      // if(this.type === 'message') {
      //     if(document.getElementsByClassName('v-msg__message').length !== 1) {
      //         el.style.height = 0;
      //         el.style.paddingTop = 0;
      //         el.style.paddingBottom = 0;
      //     }
      // }
    }
  },
  mounted () {
    this.clearCloseTimer()
    if (this.duration !== 0) {
      this.closeTimer = setTimeout(() => {
        this.close()
      }, this.duration * 1000)
    }
  },
  beforeDestroy () {
    this.clearCloseTimer()
  }
}
</script>
<style lang='less' src='./message.less'></style>