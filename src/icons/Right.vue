<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path d="M9.1,19.7l-7.4-7.6c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l6.1,6.2L20.9,6.2c0.4-0.4,1-0.3,1.4,0.1
        c0.4,0.4,0.3,1-0.1,1.4L9.1,19.7z"/>
    </g>
  </svg>
</template>
<script>
const Right = {
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

export default Right;
</script>