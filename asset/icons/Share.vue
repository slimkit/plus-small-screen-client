<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path d="M21.4,13.3c-0.3,0-0.6,0.3-0.6,0.6v4.6c0,1.3-1,2.3-2.3,2.3h-13c-1.3,0-2.3-1-2.3-2.3v-13c0-1.3,1-2.3,2.3-2.3H10
    c0.3,0,0.6-0.3,0.6-0.6S10.4,2,10,2H5.5C3.6,2,2,3.6,2,5.5v13C2,20.4,3.6,22,5.5,22h13c1.9,0,3.5-1.6,3.5-3.5V14
    C22,13.6,21.7,13.3,21.4,13.3z"/>
      <path d="M20.7,2h-7.2c-0.3,0-0.6,0.3-0.6,0.6s0.3,0.6,0.6,0.6h6.5L10.2,13c-0.1,0.1-0.2,0.3-0.2,0.4c0,0.2,0.1,0.3,0.2,0.4
    c0.1,0.1,0.3,0.2,0.4,0.2c0.2,0,0.3-0.1,0.4-0.2l9.8-9.8v6.5c0,0.3,0.3,0.6,0.6,0.6c0.3,0,0.6-0.3,0.6-0.6V3.3
    C22,2.6,21.4,2,20.7,2z"/>
    </g>
  </svg>
</template>
<script>
const Share = {
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

export default Share;
</script>