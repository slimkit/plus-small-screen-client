<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <path d="M12,1C5.9,1,1,5.9,1,12s4.9,11,11,11s11-4.9,11-11S18.1,1,12,1z M12.6,18.5c-0.2,0.2-0.4,0.3-0.7,0.3
  c-0.3,0-0.6-0.1-0.8-0.3c-0.1-0.2-0.2-0.4-0.2-0.7s0.1-0.5,0.3-0.7c0.2-0.2,0.5-0.3,0.7-0.3c0.3,0,0.5,0.1,0.7,0.3
  c0.2,0.2,0.3,0.4,0.3,0.7S12.8,18.3,12.6,18.5z M12.3,15c0,0.4-0.6,0.4-0.6,0c-0.3-2.5-0.8-8.3-0.8-8.7c0-0.6,0.5-1.1,1.1-1.1
  s1.1,0.5,1.1,1.1C13.1,6.7,12.6,12.4,12.3,15z"/>
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