<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path d="M6.8,17.2l2.4-1.4L22.8,2.2C22.9,2.1,23,1.9,23,1.7s-0.1-0.3-0.2-0.5c-0.3-0.3-0.7-0.3-1,0L8.3,14.8L6.8,17.2z"/>
      <path d="M22.3,8.3c-0.4,0-0.7,0.3-0.7,0.7v9.3c0,1.9-1.5,3.4-3.4,3.4H5.7c-1.9,0-3.4-1.5-3.4-3.4V5.7c0-1.9,1.5-3.4,3.4-3.4h9.5
    c0.4,0,0.7-0.3,0.7-0.7c0-0.4-0.3-0.7-0.7-0.7H5v0.1C3,1.4,1.4,3,1.1,5H1V19h0.1c0.3,2.1,1.9,3.7,4,4V23H19v-0.1
    c2.1-0.3,3.7-1.9,4-4H23v-10C23,8.6,22.7,8.3,22.3,8.3z"/>
    </g>
  </svg>
</template>
<script>
const Feedback = {
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

export default Feedback;
</script>