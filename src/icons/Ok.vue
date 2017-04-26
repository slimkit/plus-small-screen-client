<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <path d="M12,1C5.9,1,1,5.9,1,12s4.9,11,11,11s11-4.9,11-11S18.1,1,12,1z M18.5,8.7L11,16.2c-0.2,0.2-0.6,0.2-0.8,0
  l-4.7-4.7c-0.2-0.2-0.2-0.6,0-0.8s0.6-0.2,0.8,0l4.3,4.3l7.1-7.1c0.2-0.2,0.6-0.2,0.8,0C18.7,8.1,18.7,8.4,18.5,8.7z"/>
  </svg>
</template>
<script>
const Ok = {
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
      default: '#999'
    }
  }
}

export default Ok;
</script>