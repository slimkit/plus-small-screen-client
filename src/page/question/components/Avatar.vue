<template>
  <div
    v-bind="$props"
    :class="rootClassName"
    :style="rootStyles"
    @click="handleClick">
    <slot/>
  </div>
</template>

<script>
export default {
  name: "Avatar",
  props: {
    classes: { type: [Array, String], default: "" },
    size: { type: [String, Number], default: 0.4 },
    sizeUnit: { type: String, default: "rem" }
  },
  computed: {
    /**
     * Root element class name.
     *
     * @return {Array}
     * @author Seven Du <shiweidu@outlook.com>
     */
    rootClassName() {
      let classes = this.classes || [];
      if (typeof classes === "string" || classes instanceof String) {
        classes = [classes];
      }

      return ["module-avatar", ...classes];
    },

    /**
     * Root element styles.
     *
     * @return {Object}
     * @author Seven Du <shiweidu@outlook.com>
     */
    rootStyles() {
      let size = this.size;
      if (typeof size === "number" || size instanceof Number) {
        size = size + this.sizeUnit;
      }

      return {
        width: size,
        height: size
      };
    }
  },
  methods: {
    /**
     * The click handle.
     *
     * @param {Object} event
     * @return {void}
     * @author Seven Du <shiweidu@outlook.com>
     */
    handleClick(event) {
      this.$emit("click", event);
    }
  }
};
</script>

<style lang="less">
.module-avatar {
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
