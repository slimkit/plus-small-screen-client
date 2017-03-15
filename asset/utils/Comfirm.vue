<template>
  <div :class="$style.comfirm">
    <Row>
      <i-col offset="1" :span="22">
        <i-button :long="true" @click.native="doIt(rowData)">{{ comfirmText }}</i-button>
      </i-col>
      <i-col offset="1" :span="22">
        <i-button :long="true" @click.native="cannelIt">取消</i-button>
      </i-col>
  </div>
</template>

<script>
  const comfirmUi = {
    props: {
      comfirmContent: {
        type: [String, Number],
        default: '确认'
      },
      data: {
        type: [Object]
      }
    },
    data: () => ({
      show: false,
      comfirmText: '',
      rowData: {}
    }),
    methods: {
      doIt (data) {
        this.$emit('increment', data);
      },
      cannelIt () {
        this.$emit('cannel');
      }
    },
    beforeMount () {
      this.comfirmText = this.comfirmContent;
      this.rowData = this.data;
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
    height: 110px;
    width: 100%;
  }
</style>