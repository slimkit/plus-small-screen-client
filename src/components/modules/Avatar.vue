<template>
  <div v-bind="$props" :class="rootClassName" :style="rootStyles" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  /**
   * The component name.
   *
   * @type {String}
   */
  name: 'module-avatar',

  /**
   * The component props.
   *
   * @type {Object}
   */
  props: {
    classes: { type: [Array, String] },
    size: { type: [String, Number], default: 0.4 },
    sizeUnit: { type: String, default: 'rem' }
  },

  /**
   * The component methods.
   *
   * @type {Object}
   */
  methods: {

    /**
     * Class name builder.
     *
     * @param {string} className
     * @return {string}
     * @author Seven Du <shiweidu@outlook.com>
     */
    classNameBuilder(className) {
      return `module-avatar-${className}`;
    },

    /**
     * The click handle.
     *
     * @param {Object} event
     * @return {void}
     * @author Seven Du <shiweidu@outlook.com>
     */
    handleClick(event) {
      this.$emit('click', event);
    }
  },

  /**
   * The component computed data.
   *
   * @type {Object}
   */
  computed: {

    /**
     * Root element class name.
     *
     * @return {Array}
     * @author Seven Du <shiweidu@outlook.com>
     */
    rootClassName() {
      let classes = this.classes || [];
      if (typeof classes === 'string' || classes instanceof String) {
        classes = [classes];
      }

      return ['module-avatar', ...classes];
    },

    /**
     * Root element styles.
     *
     * @return {Object}
     * @author Seven Du <shiweidu@outlook.com>
     */
    rootStyles() {
      let size = this.size;
      if (typeof size === 'number' || size instanceof Number) {
        size = size + this.sizeUnit;
      }

      return {
        width: size,
        height: size
      };
    }
  }
};
</script>

<style lang="less">
@root: module-avatar;
.@{root} {
  background-color: #999;
  color: #fff;
  border-radius: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  vertical-align: middle;
  > * {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
</style>
