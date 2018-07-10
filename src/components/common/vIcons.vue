<template>
  <i
    :style="wrapStyles"
    class="v-icon">
    <svg
      :color="color"
      width="100%"
      height="100%">
      <use
        :xlink:href="`#${type}`"
        xmlns:xlink="http://www.w3.org/1999/xlink"/>
    </svg>
  </i>
</template>

<script>
export default {
  name: "VIcon",
  props: {
    type: { type: [String], required: true },
    height: { type: [String, Number], default: 0.32 },
    width: { type: [String, Number], default: 0.32 },
    color: { type: String, default: "" }
  },
  computed: {
    wrapStyles() {
      return {
        width: `${this.width}rem`,
        height: `${this.height}rem`
      };
    }
  }
};
</script>

<style lang='less'>
.v-icon {
  display: inline-flex;
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
}
</style>
