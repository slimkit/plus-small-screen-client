<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <path d="M12,1C5.9,1,1,5.9,1,12c0,6.1,4.9,11,11,11s11-4.9,11-11S18.1,1,12,1z M16.7,16.2l-0.5,0.5L12,12.5l-4.2,4.2
  l-0.5-0.5l4.2-4.2L7.3,7.8l0.5-0.5l4.2,4.2l4.2-4.2l0.5,0.5L12.5,12L16.7,16.2z"/>
  </svg>
</template>
<script>
const Close = {
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

export default Close;
</script>