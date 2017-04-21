<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path d="M8.9,1.4l7.2,8.9l0.2-8.4C15,1.3,13.6,1,12,1C10.9,1,9.9,1.2,8.9,1.4z"/>
      <path d="M2.4,6.7l11.4,1.2L8,1.8C6.6,2.3,5.3,3.1,4.2,4.2C3.5,5,2.9,5.8,2.4,6.7z"/>
      <path d="M1.4,15.1l8.9-7.2L1.9,7.6C1.3,9,1,10.4,1,12C1,13.1,1.2,14.1,1.4,15.1z"/>
      <path d="M6.7,21.6l1.2-11.4L1.8,16c0.5,1.4,1.3,2.6,2.4,3.7C5,20.5,5.8,21.1,6.7,21.6z"/>
      <path d="M15.1,22.6l-7.2-8.9l-0.2,8.4C9,22.7,10.4,23,12,23C13.1,23,14.1,22.8,15.1,22.6z"/>
      <path d="M21.6,17.3l-11.4-1.2l5.8,6.1c1.4-0.5,2.6-1.3,3.7-2.4C20.5,19,21.1,18.2,21.6,17.3z"/>
      <path d="M22.6,8.9l-8.9,7.2l8.4,0.2C22.7,15,23,13.6,23,12C23,10.9,22.8,9.9,22.6,8.9z"/>
      <path d="M17.3,2.4l-1.2,11.4L22.2,8c-0.5-1.4-1.3-2.6-2.4-3.7C19,3.5,18.2,2.9,17.3,2.4z"/>
    </g>
  </svg>
</template>
<script>
const FriendsLine = {
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

export default FriendsLine;
</script>