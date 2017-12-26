<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path class="st0" d="M20.7,1.7H3.2C2,1.7,1,2.7,1,3.8v13.8c0,1.1,1,2.1,2.2,2.1h6c0,0,0.2,0.2,0.4,0.5c0.1,0.1,0.2,0.2,0.2,0.3
    c0,0,0.2,0.2,0.2,0.3c0.7,1.1,1.2,1.6,2,1.6c0.8,0,1.4-0.5,2.1-1.6c0.5-0.8,0.7-1.1,0.7-1.1h5.9c1.2,0,2.2-1,2.2-2.1V3.8
    C22.9,2.6,21.9,1.7,20.7,1.7L20.7,1.7z M21.9,17.6c0,0.6-0.5,1.1-1.1,1.1h-6c-0.2,0-0.2,0-0.4,0.1c-0.2,0.2-0.5,0.3-0.7,0.7
    c-0.1,0.2-0.5,0.8-0.5,0.8c-0.5,0.8-0.8,1.1-1.1,1.1S11.5,21,11,20.2c-0.1-0.1-0.2-0.3-0.2-0.3c-0.1-0.2-0.2-0.2-0.2-0.3
    c-0.5-0.6-0.8-0.9-1.3-0.9h-6c-0.6,0-1.1-0.5-1.1-1.1V3.9c0-0.6,0.5-1.1,1.1-1.1h17.5c0.6,0,1.1,0.5,1.1,1.1L21.9,17.6L21.9,17.6
    L21.9,17.6z"/>
      <circle class="st0" cx="6.3" cy="11.1" r="0.9"/>
      <circle class="st0" cx="12" cy="11.1" r="0.9"/>
      <circle class="st0" cx="17.7" cy="11.1" r="0.9"/>
    </g>
  </svg>
</template>
<script>
const Comment = {
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

export default Comment;
</script>