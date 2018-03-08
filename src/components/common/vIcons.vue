<template>
    <i class="v-icon" :style='wrapStyles'>
        <svg width='100%' height='100%' :color='color'>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="`#${type}`"></use>
        </svg>
    </i>
</template>
<script>
export default {
  name: "vIcon",
  props: {
    type: {
      type: [String],
      required: true
    },
    height: {
      type: [String, Number]
    },
    width: {
      type: [String, Number]
    },
    color: {
      type: String
    }
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
