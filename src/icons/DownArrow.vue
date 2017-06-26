<template>
  <svg  viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <polygon class="st0" points="12,18.2 1,7.2 2.4,5.8 12,15.4 21.6,5.8 23,7.2 13.4,16.8 12,18.2  "/>
    </g>
  </svg>
</template>
<script>
const DownArrow = {
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

export default DownArrow;
</script>

