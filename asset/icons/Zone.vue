<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path class="st0" d="M7.4,15.7c0.5-0.6,7-4.2,7-4.2l-8.5-1.1l11.3-0.1c0,0,0.4,0.3,0,0.8c-0.4,0.5-6.4,4.6-6.4,4.6l6.9,0.5
    l-0.2-1.2L23,9.5l-7.6-1.1L12,1.5L8.6,8.4L1,9.5l5.5,5.4l-1.3,7.6l6.8-3.6l6.8,3.6l-1.1-6.2L7.4,16.7C7.4,16.7,6.9,16.2,7.4,15.7z"
    />
      <polygon class="st0" points="17.7,16.1 17.7,16.2 18.8,16.2  "/>
    </g>
  </svg>
</template>
<script>
const Zone = {
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

export default Zone;
</script>