<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <ellipse class="st0" cx="12.2" cy="8.4" rx="6.4" ry="6.4"/>
      <ellipse cx="6.1" cy="10.7" rx="0.9" ry="1.4"/>
      <path class="st0" d="M5.3,20.6C5.4,21.6,7,22.2,8.9,22c1.8-0.2,3.2-1.1,3.1-2.1c-0.1-0.9-1.7-1.6-3.6-1.4
        C6.5,18.7,5.1,19.7,5.3,20.6z"/>
      <ellipse cx="18.5" cy="10.7" rx="0.9" ry="1.4"/>
      <ellipse transform="matrix(0.1265 -0.992 0.992 0.1265 -6.3946 33.1323)" cx="15.6" cy="20.2" rx="1.7" ry="3.2"/>
      <ellipse cx="12.1" cy="15.5" rx="6.2" ry="5.2"/>
      <path d="M6.9,14.4c-0.9,1.8-2.3,3-2.8,2.7c-0.6-0.3-0.7-2.1,0.2-4c0.9-1.8,2.4-3,3.1-2.6C8.1,10.9,7.8,12.6,6.9,14.4z"
        />
      <path d="M17.4,14.7c0.8,1.7,2,2.9,2.6,2.8c0.4-0.1,0.7-2,0-3.9c-0.8-1.9-2.2-3.2-2.9-2.9
    C16.3,11.1,16.4,12.8,17.4,14.7z"/>
    </g>
  </svg>
</template>
<script>
const QQ = {
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

export default QQ;
</script>