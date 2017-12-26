<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path d="M19.4,1.5H4.6C2.6,1.5,1,3.1,1,5.1v13.8c0,2,1.6,3.6,3.6,3.6h14.8c2,0,3.6-1.6,3.6-3.6v-0.2
        c0-0.4-0.3-0.6-0.6-0.6c-0.4,0-0.6,0.3-0.6,0.6v0.2c0,1.3-1,2.3-2.3,2.3H4.6c-1.3,0-2.3-1-2.3-2.3V5.1c0-1.3,1-2.3,2.3-2.3h14.8
        c1.3,0,2.3,1,2.3,2.3v0.2c0,0.4,0.3,0.6,0.6,0.6c0.4,0,0.6-0.3,0.6-0.6V5.1C23,3.1,21.4,1.5,19.4,1.5z"/>
      <path d="M12.4,11.6c-0.1,1.2,0.3,2.3,1.1,3.1c0.8,0.8,1.9,1.3,3,1.3l6.6,0V7.9l-6.5,0C14.4,7.9,12.5,9.5,12.4,11.6z
         M21.7,14.8h-5.3c-0.8,0-1.5-0.3-2.1-0.9c-0.5-0.6-0.8-1.4-0.7-2.2c0.1-1.4,1.4-2.5,2.9-2.5h5.2V14.8z"/>
      <circle class="st0" cx="16.5" cy="12.1" r="0.8"/>
    </g>
  </svg>
</template>
<style type="text/css" scoped>
  .st3{fill:#666666;}
</style>
<script>
const Wallet = {
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

export default Wallet;
</script>