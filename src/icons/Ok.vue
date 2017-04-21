<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <circle cx="12" cy="12" r="11"/>
    <path d="M18.5,7.9c-0.2-0.2-0.6-0.2-0.8,0L10.6,15l-4.3-4.3c-0.2-0.2-0.6-0.2-0.8,0c-0.2,0.2-0.2,0.6,0,0.8l4.7,4.7
  c0.2,0.2,0.6,0.2,0.8,0l7.5-7.5C18.7,8.4,18.7,8.1,18.5,7.9z"/>
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
      default: '#000'
    }
  }
}

export default Ok;
</script>