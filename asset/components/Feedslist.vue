<template>
  <div class="header">
    <h1 class="title">Refresh & Infinite</h1>
  </div>

  <scroller 
    style="top: 44px"
    :on-refresh="refresh"
    :on-infinite="infinite"
    ref="my_scroller"
  >
    <div v-for="(item, index) in items" class="row" :class="{'grey-bg': index % 2 == 0}">
      {{ item }}
    </div>
  </scroller>
</template>
<style>
  html, body {
    margin: 0;
  }
  * {
    box-sizing: border-box;
  }
  .row {
    width: 100%;
    height: 50px;
    padding: 10px 0;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    color: #444;
    background-color: #fff;
  }
  .grey-bg {
    background-color: #eee;
  }
  .header {
    position: fixed;
    top: 0;
    left: 0;
    height: 44px;
    width: 100%;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);
    background-color: #fff;
    z-index: 1000;
    color: #666;
  }
  .header > .title {
    font-size: 16px;
    line-height: 44px;
    text-align: center;
    margin: 0 auto;
  }
</style>
<script>
  import Scroller from 'vue-scroller'

  export default {
    components: {
      Scroller
    },
    data() {
      return {
        items: []
      }
    },
    mounted() {
      for (var i = 1; i <= 20; i++) {
        this.items.push(i + ' - keep walking, be 2 with you.');
      }
      this.top = 1;
      this.bottom = 20;
      setTimeout(() => {
        this.$refs.my_scroller.resize();
      })
    },
    methods: {
      refresh() {
        setTimeout(() => {
          var start = this.top - 1
          for (var i = start; i > start - 10; i--) {
            this.items.splice(0, 0, i + ' - keep walking, be 2 with you.');
          }
          this.top = this.top - 10;
          if (this.$refs.my_scroller)
            this.$refs.my_scroller.finishPullToRefresh();
        }, 1500)
      },
      infinite() {
        setTimeout(() => {
          var start = this.bottom + 1;
          for (var i = start; i < start + 10; i++) {
            this.items.push(i + ' - keep walking, be 2 with you.');
          }
          this.bottom = this.bottom + 10;
          setTimeout(() => {
            if (this.$refs.my_scroller)
              this.$refs.my_scroller.resize();
          })
        }, 1500)
      }
    }
  }
</script>
