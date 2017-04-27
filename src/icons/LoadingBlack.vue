<template>
  <svg viewBox="0 0 24 24" class="spinner-snake" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      <path d="M11.1,4c0,1.4,0.4,2.7,1.1,3.5C13,6.7,13.4,5.5,13.4,4c0-1.4-0.4-2.7-1.1-3.5C11.6,1.4,11.1,2.6,11.1,4z"/>
      <path d="M16,5c-0.8,1.1-1.2,2.4-1.1,3.5c1.1-0.3,2.2-1,3-2.2C18.7,5.2,19,4,19,2.9C17.9,3.1,16.8,3.9,16,5z"/>
      <path d="M19.3,8.7c-1.4,0.4-2.4,1.3-3,2.2c1,0.4,2.4,0.4,3.7,0c1.4-0.4,2.4-1.3,3-2.2C22,8.3,20.6,8.3,19.3,8.7z"/>
      <path d="M19.8,13.6c-1.4-0.4-2.7-0.4-3.7,0c0.6,0.9,1.6,1.7,3,2.2c1.4,0.4,2.7,0.4,3.7,0
        C22.3,14.9,21.2,14.1,19.8,13.6z"/>
      <path  d="M17.4,17.9c-0.8-1.1-1.9-1.9-3-2.2c-0.1,1.1,0.3,2.4,1.1,3.5c0.8,1.1,1.9,1.9,3,2.2
        C18.6,20.4,18.2,19.1,17.4,17.9z"/>
      <path d="M12.9,20c0-1.4-0.4-2.7-1.1-3.5c-0.7,0.8-1.1,2.1-1.1,3.5c0,1.4,0.4,2.7,1.1,3.5C12.4,22.6,12.9,21.4,12.9,20
        z"/>
      <path d="M8,19c0.8-1.1,1.2-2.4,1.1-3.5c-1.1,0.3-2.2,1-3,2.2C5.3,18.8,5,20,5,21.1C6.1,20.9,7.2,20.1,8,19z"/>
      <path d="M4.7,15.3c1.4-0.4,2.4-1.3,3-2.2c-1-0.4-2.4-0.4-3.7,0c-1.4,0.4-2.4,1.3-3,2.2C2,15.7,3.4,15.7,4.7,15.3z"/>
      <path d="M4.2,10.4c1.4,0.4,2.7,0.4,3.7,0c-0.6-0.9-1.6-1.7-3-2.2c-1.4-0.4-2.7-0.4-3.7,0C1.7,9.1,2.8,9.9,4.2,10.4z"
        />
      <path d="M6.6,6.1c0.8,1.1,1.9,1.9,3,2.2c0.1-1.1-0.3-2.4-1.1-3.5c-0.8-1.1-1.9-1.9-3-2.2C5.4,3.6,5.8,4.9,6.6,6.1z"/>
    </g>
  </svg>
</template>
<script>
  const LoadingBlack = {
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
        default: '#999'
      }
    }
  }

  export default LoadingBlack;
</script>
<style scoped>
  .spinner-snake {
    -webkit-animation: spinner-rotate 1.4s infinite linear;
            animation: spinner-rotate 1.4s infinite linear;
  }
  @-webkit-keyframes spinner-rotate {
    0% {
        -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
    }
    }
    @keyframes mint-spinner-rotate {
    0% {
        -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
    }
  }
</style>
