<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <circle cx="2.4" cy="12" r="1.4"/>
      <circle cx="12" cy="12" r="1.4"/>
      <circle cx="21.6" cy="12" r="1.4"/>
    </g>
  </svg>
</template>
<script>
const More = {
  props: {
    height: {
      type: [String, Number],
      default: 24
    },
    width: {
      type: [String, Number],
      default: 24
    },
    color: {
      type: String,
      default: '#000'
    }
  }
}

export default More;
</script>