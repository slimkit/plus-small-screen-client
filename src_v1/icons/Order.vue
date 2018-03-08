<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path class="st1" d="M8,6.7h14.1c0.5,0,0.9-0.4,0.9-0.9S22.6,5,22.1,5H8C7.6,5,7.2,5.4,7.2,5.8S7.6,6.7,8,6.7L8,6.7z M22.1,11.1H8
        c-0.5,0-0.9,0.4-0.9,0.9c0,0.5,0.4,0.9,0.9,0.9h14.1c0.5,0,0.9-0.4,0.9-0.9C23,11.5,22.6,11.1,22.1,11.1L22.1,11.1z M22.1,17.3H8
        c-0.5,0-0.9,0.4-0.9,0.9S7.6,19,8,19h14.1c0.5,0,0.9-0.4,0.9-0.9S22.6,17.3,22.1,17.3L22.1,17.3z M1,5.8c0,1,0.8,1.8,1.8,1.8
        s1.8-0.8,1.8-1.8S3.7,4.1,2.8,4.1S1,4.9,1,5.8L1,5.8z M1,12c0,1,0.8,1.8,1.8,1.8S4.5,13,4.5,12s-0.8-1.8-1.8-1.8S1,11,1,12L1,12z
         M1,18.2c0,1,0.8,1.8,1.8,1.8s1.8-0.8,1.8-1.8s-0.8-1.8-1.8-1.8S1,17.2,1,18.2L1,18.2z"/>
    </g>
  </svg>
</template>
<style type="text/css" scoped>
  .st0{fill-rule:evenodd;clip-rule:evenodd;fill:#59B6D7;}
  .st1{fill-rule:evenodd;clip-rule:evenodd;fill:#999999;}
  .st2{fill-rule:evenodd;clip-rule:evenodd;}
  .st3{fill:#666666;}
  .st4{fill-rule:evenodd;clip-rule:evenodd;fill:#B2B2B2;}
  .st5{fill-rule:evenodd;clip-rule:evenodd;fill:#858585;}
  .st6{fill:#999999;}
  .st7{fill:#333333;}
  .st8{fill:#BABABA;}
  .st9{fill:#FEA700;}
</style>
<script>
const Order = {
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

export default Order;
</script>