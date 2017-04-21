<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path class="st0" d="M12,6.1c4.2,0,8,2.3,10.1,5.9c-2,3.6-5.9,5.9-10.1,5.9c-4.2,0-8-2.3-10.1-5.9C4,8.4,7.8,6.1,12,6.1L12,6.1z
     M12,5.3C7.2,5.3,3,8,1,12c2,4,6.2,6.7,11,6.7S21,16,23,12C21,8,16.8,5.3,12,5.3L12,5.3"/>
      <path class="st0" d="M12,8.8c1.8,0,3.3,1.4,3.3,3.2s-1.5,3.2-3.3,3.2S8.7,13.8,8.7,12S10.2,8.8,12,8.8L12,8.8z M12,8
    c-2.3,0-4.1,1.8-4.1,4s1.9,4,4.1,4c2.3,0,4.1-1.8,4.1-4S14.3,8,12,8L12,8"/>
    </g>
  </svg>
</template>
<script>
const View = {
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

export default View;
</script>