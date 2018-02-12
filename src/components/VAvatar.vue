<template>
  <div :class="classes" @click.stop='linkTo'>
    <img :src="src" class="avatar_main" @error="loaded = false" v-if="src && loaded">
    <slot></slot>
    <div class='avatar_badeg' v-if="badeg">
      <img :src="badeg">
    </div>
  </div>
</template>
<script>
const prefixCls = 'v-avatar';
export default {
  name: 'VAvatar',
  props: {
    shape: {
      default: 'circle'
    },
    uid: {
      type: [Number, String]
    },
    size: {
      default: 'default'
    },
    src: {
      type: String
    },
    badeg: {
      type: [String]
    },
    sex: {
      type: [String, Number]
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      loaded: true
    };
  },
  computed: {
    icon() {
      switch (+this.sex) {
        case 0:
          return 'secret';
        case 1:
          return 'man';
        case 2:
          return 'woman';
      }
    },
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.shape}`,
        `${prefixCls}-${this.size}`,
        {
          [`${prefixCls}-${this.icon}`]: typeof this.sex !== 'undefined'
        }
      ];
    }
  },
  methods: {
    linkTo() {
      if (!this.uid) {
        return false;
      }
      this.$router.push(`/user/${this.uid}`);
    }
  }
};
</script>
<style lang="less" src='./style/UserAvatar.less'>

</style>
