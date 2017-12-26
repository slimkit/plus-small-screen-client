<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <path class="st0" d="M12,22.1L12,22.1c-0.1,0-0.3-0.1-0.4-0.2l-3.1-3.1c0,0-4-4.1-4.6-4.6C2.2,12.5,1.2,10.6,1,8.7
  C0.8,6.8,1.5,5,2.9,3.6c1.3-1.3,3-1.9,4.8-1.6c1.5,0.2,3,1,4.4,2.3C13.4,3,14.9,2.2,16.4,2c1.8-0.3,3.4,0.3,4.8,1.6
  c1.4,1.4,2,3.2,1.8,5.1c-0.2,1.9-1.2,3.8-2.9,5.5c-1.3,1.3-7.7,7.7-7.7,7.8C12.3,22,12.1,22.1,12,22.1L12,22.1z"/>
  </svg>
</template>
<script>
const Digg = {
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

export default Digg;
</script>