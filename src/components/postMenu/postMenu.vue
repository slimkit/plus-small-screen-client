<template>
  <transition name='router-fadeInTop' mode="out-in">
    <div :class="`${prefixCls}`">
      <div :class="`${prefixCls}-ad`"></div>
      <div :class="`${prefixCls}-list`">
        <slot></slot>
      </div>
      <div :class="`${prefixCls}-foot`">
        <div :class="[`${prefixCls}-close`, { open }]" @click='close'>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
const prefixCls = 'v-post-menu'
export default {
  name: 'postMenu',
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls
    }
  },
  computed: {},
  watch: {},
  methods: {
    close() {
      this.$emit('on-close')
    }
  }
}

</script>
<style lang="less" src='./postMenu.less'></style>
