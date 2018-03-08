<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
      <g>
        <g>
          <path class="st3" d="M18.2,23H5.8C3.2,23,1,20.8,1,18.2V5.8C1,3.2,3.2,1,5.8,1h8.4C14.7,1,15,1.4,15,1.8s-0.4,0.8-0.8,0.8H5.8
            c-1.7,0-3.2,1.4-3.2,3.2v12.3c0,1.7,1.4,3.2,3.2,3.2h12.3c1.7,0,3.2-1.4,3.2-3.2V9.4c0-0.5,0.4-0.8,0.8-0.8c0.5,0,0.8,0.4,0.8,0.8
            v8.8C23,20.8,20.8,23,18.2,23z"/>
        </g>
        <g>
          <path class="st3" d="M7.8,17.3c-0.2,0-0.4-0.1-0.6-0.2c-0.3-0.3-0.3-0.8,0-1.2l14-14.3c0.3-0.3,0.8-0.3,1.2,0
            c0.3,0.3,0.3,0.8,0,1.2l-14,14.3C8.3,17.2,8,17.3,7.8,17.3z"/>
        </g>
      </g>
  </svg>
</template>
<script>
const Edit = {
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

export default Edit;
</script>