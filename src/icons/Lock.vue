<template>
  	<svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    	<g>
			<path class="st0" d="M19.2,10.3h-1.6V6.6C17.6,3.5,15,1,12,1C9,1,6.4,3.5,6.4,6.6v3.7H4.8c-0.7,0-1.4,0.6-1.4,1.4v10
			c0,0.7,0.6,1.4,1.4,1.4h14.4c0.7,0,1.4-0.6,1.4-1.4v-10C20.6,10.8,19.9,10.3,19.2,10.3L19.2,10.3z M12.7,16.9v2.2
			c0,0.1-0.1,0.2-0.2,0.2h-1.2c-0.1,0-0.2-0.1-0.2-0.2v-2.2c-0.6-0.3-0.9-0.8-0.9-1.6c0-0.5,0.2-0.9,0.5-1.2c0.3-0.3,0.8-0.5,1.2-0.5
			c0.9,0,1.8,0.7,1.8,1.7C13.8,16,13.3,16.6,12.7,16.9L12.7,16.9z M15.4,10.3H8.6V6.7c0-1.9,1.6-3.4,3.4-3.4c0.9,0,1.8,0.4,2.4,1
			c0.6,0.6,1,1.5,1,2.4L15.4,10.3L15.4,10.3L15.4,10.3z"/>
		</g>
  	</svg>
</template>
<script>
const Lock = {
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
      default: '#fff'
    }
  }
}

export default Lock;
</script>