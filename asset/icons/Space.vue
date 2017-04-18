<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path d="M19.4,20.3c0,0.7-0.6,1.3-1.3,1.3H5.9c-0.7,0-1.3-0.6-1.3-1.3V14c0-0.3-0.2-0.5-0.5-0.5l0,0c-0.3,0-0.5,0.2-0.5,0.5v6.3
    c0,1.4,1.1,2.5,2.5,2.5h12c1.4,0,2.5-1.1,2.5-2.5V14c0-0.3-0.2-0.5-0.5-0.5l0,0c-0.3,0-0.5,0.2-0.5,0.5L19.4,20.3L19.4,20.3z"/>
      <path d="M13.2,1.7c-0.3-0.3-0.7-0.5-1.2-0.5l0,0c-0.4,0-0.8,0.2-1.2,0.5l-9.7,9.7c-0.2,0.2-0.2,0.6,0,0.8l0,0
    c0.2,0.2,0.6,0.2,0.8,0l9.4-9.5c0.3-0.3,0.4-0.4,0.6-0.4c0.2,0,0.3,0.2,0.6,0.4l9.4,9.5c0.2,0.2,0.6,0.2,0.8,0l0,0
    c0.2-0.2,0.2-0.6,0-0.8L13.2,1.7z"/>
    </g>
  </svg>
</template>
<script>
const Space = {
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

export default Space;
</script>