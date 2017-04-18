<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path d="M22.4,12.6H1.7c-0.3,0-0.6-0.3-0.6-0.6v0c0-0.3,0.3-0.6,0.6-0.6h20.8c0.3,0,0.6,0.3,0.6,0.6v0C23,12.3,22.7,12.6,22.4,12.6
        z"/>
      <path d="M11.5,21.2L2.4,12l9.1-9.2c0.2-0.2,0.2-0.6,0-0.8c-0.2-0.2-0.6-0.2-0.8,0l-9.5,9.6c-0.2,0.2-0.2,0.6,0,0.8l9.5,9.6
        c0.2,0.2,0.6,0.2,0.8,0C11.7,21.8,11.7,21.4,11.5,21.2z"/>
    </g>
  </svg>
</template>
<script>
const Back = {
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

export default Back;
</script>