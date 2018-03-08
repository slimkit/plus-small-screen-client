<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path class="st3" d="M18,14.7c0.2-0.3,0-0.8-0.3-1c-0.8-0.4-1.6-0.7-2.4-0.9c1.6-1.1,2.7-2.9,2.7-5c0-3.3-2.7-6-6-6s-6,2.7-6,6
        c0,2.1,1.1,4,2.7,5.1C2.5,14.6,1,21,1,21.1c-0.1,0.4,0.2,0.8,0.5,0.8c0.1,0,0.1,0,0.2,0c0.3,0,0.6-0.2,0.7-0.6
        c0.1-0.3,1.8-7.6,9.6-7.6c1.9,0,3.6,0.4,5.1,1.2C17.4,15.2,17.9,15,18,14.7z M7.4,7.8c0-2.5,2.1-4.6,4.6-4.6c2.5,0,4.6,2.1,4.6,4.6
        s-2.1,4.6-4.6,4.6C9.5,12.4,7.4,10.3,7.4,7.8z"/>
      <path class="st3" d="M22.7,16.1c-0.3-0.2-0.8-0.2-1,0.1l-3.1,4.1l-1.9-1.4c-0.3-0.2-0.8-0.2-1,0.2c-0.2,0.3-0.2,0.8,0.2,1l3,2.2
        l4-5.2C23.1,16.8,23,16.3,22.7,16.1z"/>
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
const reward = {
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

export default reward;
</script>