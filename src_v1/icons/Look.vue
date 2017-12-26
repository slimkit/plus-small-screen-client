<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path d="M21.5,0h-19C1.1,0,0,1.1,0,2.5v19C0,22.9,1.1,24,2.5,24h19c1.4,0,2.5-1.1,2.5-2.5v-19C24,1.1,22.9,0,21.5,0z
         M23,21.5c0,0.8-0.7,1.5-1.5,1.5h-19C1.7,23,1,22.3,1,21.5v-19C1,1.7,1.7,1,2.5,1h19C22.3,1,23,1.7,23,2.5V21.5z"/>
      <path d="M12.5,10.8h3.3v-1h-3.3V8.4h4.1V7.3h-4.1V6h-1.2v1.3h-4v1.1h4v1.4H8.1v1h3.2v1.4H7v1.1h4.3V17h1.2v-3.8h3.1
        c0,0.8-0.1,1.3-0.2,1.5c-0.1,0.3-0.5,0.5-1,0.5c-0.3,0-0.6,0-0.9-0.1l0.3,1c0.3,0,0.5,0.1,0.7,0.1c1,0,1.6-0.3,1.9-0.9
        c0.2-0.5,0.3-1.6,0.4-3.2h-4.2V10.8z"/>
      <path d="M4.8,19.6h1.2v-0.8h11.9v0.8h1.2V4.2H4.8V19.6z M6.1,5.4h11.9v12.3H6.1V5.4z"/>
    </g>
  </svg>
</template>
<script>
const Look = {
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

export default Look;
</script>