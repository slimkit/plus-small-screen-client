<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <path d="M6.1,21.4L6.1,21.4l9.4-9.4L6.1,2.6l0,0C6,2.5,5.8,2.2,5.8,1.9C5.8,1.4,6.3,1,6.8,1c0.3,0,0.5,0.1,0.7,0.3l0,0
  l9.4,9.4l1.3,1.3L7.5,22.7l0,0C7.3,22.9,7.1,23,6.8,23c-0.5,0-0.9-0.4-0.9-0.9C5.8,21.8,5.9,21.5,6.1,21.4z"/>
  </svg>
</template>
<script>
const RightArrow = {
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

export default RightArrow;
</script>