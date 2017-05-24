<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path d="M21.1,21.5h-1l0,0H3.9l0,0h-1c-1.1,0-1.9-0.9-1.9-1.9V6.8c0-1.1,0.9-1.9,1.9-1.9h1l0,0l0,0H7l1.2-1.9
    c0-0.3,0.7-0.5,1-0.5h5.7c0.3,0,1,0.2,1,0.5L17,4.8h3.1h1c1.1,0,1.9,0.9,1.9,1.9v12.9C23,20.7,22.1,21.5,21.1,21.5L21.1,21.5z
     M12,6.8c-3.4,0-6.2,2.8-6.2,6.2c0,3.4,2.8,6.2,6.2,6.2c3.4,0,6.2-2.8,6.2-6.2v0C18.2,9.5,15.4,6.8,12,6.8L12,6.8z M12,17.2
    c-2.4,0-4.3-1.9-4.3-4.3c0-2.4,1.9-4.3,4.3-4.3s4.3,1.9,4.3,4.3C16.3,15.3,14.4,17.2,12,17.2L12,17.2z"/>
    </g>
  </svg>
</template>
<script>
const Camera = {
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

export default Camera;
</script>