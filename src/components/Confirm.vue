<template>
  <div :class="$style.comfirm" @click="cannelIt" v-show="show">
    <Row :class="$style.comirmRow">
      <Col :span="24" :class="$style.comfirmCol">
        <Button :long="true" @click.native="doIt(data)">{{ confirmContent }}</Button>
      </Col>
      <Col :span="24" :class="$style.comfirmCol">
        <Button :long="true" @click.native="cannelIt">取消</Button>
      </Col>
    </Row>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import { CONFIRM } from '../stores/types';

  const confirmUi = {
    methods: {
      doIt (data) {
        this.confirm(this.cannelIt, data);
      },
      cannelIt () {
        this.close(this.$store.dispatch);
      }
    },
    computed: {
      ...mapState({
        show: state => state.confirm.confirm.show,
        confirmContent: state => state.confirm.confirm.confirmContent,
        data: state => state.confirm.confirm.data,
        close: state=>state.confirm.confirm.close,
        confirm: state => state.confirm.confirm.confirm
      })
    }
  }

  export default confirmUi;

</script>

<style lang="scss" module>
  .comfirm {
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 6;
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
      display: block;
      .comfirmCol {
        margin-top: 0;
        &:first-child {
          margin-bottom: 1vh;
        }
        button {
          background-color: #fff;
          font-size: 16px;
          color: #333;
          border-radius: 0;
          border: none;
          padding: 15px 0;
          font-weight: 500;
        }
      }
    }
  }
</style>