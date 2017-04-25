<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <path d="M22.5,11.5h-10v-10C12.5,1.2,12.3,1,12,1s-0.5,0.2-0.5,0.5v10h-10C1.2,11.5,1,11.7,1,12s0.2,0.5,0.5,0.5h10v10
  c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-10h10c0.3,0,0.5-0.2,0.5-0.5S22.8,11.5,22.5,11.5z"/>
  </svg>
</template>
<script>
const Plus = {
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

export default Plus;
</script>