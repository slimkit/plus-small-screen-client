<template>
  <div :class="$style.comfirm">
    <Row :class="$style.comirmRow">
      <i-col offset="1" :span="22" :class="$style.comfirmCol">
        <i-button :long="true" @click.native="doIt(data)">{{ comfirmContent }}</i-button>
      </i-col>
      <i-col offset="1" :span="22" :class="$style.comfirmCol">
        <i-button :long="true" @click.native="cannelIt">取消</i-button>
      </i-col>
  </div>
</template>

<script>
  const comfirmUi = {
    props: {
      comfirmContent: {
        type: [String]
      },
      data: {
        type: [Object]
      }
    },
    methods: {
      doIt (data) {
        this.$emit('increment', data);
      },
      cannelIt () {
        this.$emit('cannel');
      }
    }
  }

  export default comfirmUi;

</script>

<style lang="scss" module>
  .comfirm {
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 4;
    bottom: 0px;
    left: 0px;
    position: fixed;
    overflow: auto;
    margin: 0;
    top: 0;
    right: 0;
    .comirmRow {
      position: absolute;
      width: 100%;
      bottom: 0;
      .comfirmCol {
        margin-top: 0;
        margin-bottom: 1vh;
        button {
          background-color: #fff;
          font-size: 16px;
          color: #333;
          border-radius: 0;
          border: none;
        }
      }
    }
  }
</style>