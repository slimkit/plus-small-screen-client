<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <circle cx="12" cy="12" r="11"/>
        <path d="M10.9,17.8c0-0.3,0.1-0.5,0.3-0.7c0.2-0.2,0.5-0.3,0.7-0.3c0.3,0,0.5,0.1,0.7,0.3s0.3,0.4,0.3,0.7
          c0,0.3-0.1,0.5-0.3,0.7c-0.2,0.2-0.4,0.3-0.7,0.3c-0.3,0-0.6-0.1-0.8-0.3C11,18.3,10.9,18.1,10.9,17.8z"/>
      <path d="M13.1,6.3c0,0.4-0.5,6.1-0.8,8.7c0,0.4-0.6,0.4-0.6,0c-0.3-2.5-0.8-8.3-0.8-8.7c0-0.6,0.5-1.1,1.1-1.1
        S13.1,5.7,13.1,6.3z"/>
  </svg>
</template>
<script>
const Error = {
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

export default Error;
</script>