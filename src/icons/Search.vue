<template>
  <svg  viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path class="st0" d="M22.8,22.8c-0.3,0.3-0.7,0.3-1,0l-5.7-5.6c-1.6,1.3-3.6,2-5.8,2c-5.1,0-9.3-4.1-9.3-9.1C1,5.1,5.1,1,10.3,1
        c5.1,0,9.3,4.1,9.3,9.1c0,2.4-0.9,4.5-2.4,6.1l5.7,5.6C23.1,22.1,23.1,22.5,22.8,22.8L22.8,22.8L22.8,22.8 M10.3,2.4
        c-4.3,0-7.8,3.5-7.8,7.7c0,4.3,3.5,7.7,7.8,7.7c4.3,0,7.8-3.5,7.8-7.7C18.1,5.9,14.6,2.4,10.3,2.4L10.3,2.4L10.3,2.4 M10.3,2.4
        L10.3,2.4z"/>
    </g>
  </svg>
</template>
<script>
const Search = {
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

export default Search;
</script>

