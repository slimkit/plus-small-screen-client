<template lang="html">
  <div class="wallet-detail p-wallet-detail">
    <header class="m-box m-head-top m-pos-f m-main m-bb1">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0">
        <svg 
          class="m-style-svg m-svg-def" 
          @click="goBack">
          <use 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            xlink:href="#base-back"/>
        </svg>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0 m-justify-center">
        <diy-select 
          v-model="currAction" 
          :options="options" 
          placeholder="明细"/>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0 m-justify-end"/>
    </header>
    <load-more
      ref="loadmore"
      :on-refresh="onRefresh"
      :on-load-more="onLoadMore"
      class="m-wallet-list"
    >
      <wallet-detail-item 
        v-for="item in list" 
        v-if="item.id"
        :key="item.id"
        :detail="item"
        @click="showDetail(item)" />
    </load-more>
    <div @touchmove.prevent>
      <transition name="toast">
        <div 
          v-if="show" 
          class="m-pop-box" 
          @click="show = false"/>
      </transition>
      <transition 
        v-if="show" 
        name="fade">
        <walletInfo 
          v-if="currInfo && currInfo.id" 
          :detail="currInfo"/>
      </transition>      
    </div>
  </div>
</template>

<script>
import walletInfo from "./WalletInfo";
import walletDetailItem from "./WalletDetailItem.vue";
export default {
  name: "WalletDetail",
  components: {
    walletInfo,
    walletDetailItem
  },
  data() {
    return {
      options: [
        { value: "all", label: "全部" },
        { value: "expenses", label: "支出" },
        { value: "income", label: "收入" }
      ],
      currAction: "",
      list: [],
      currInfo: null,
      show: false
    };
  },
  computed: {
    after() {
      const len = this.list.length;
      return len ? this.list[len - 1].id : 0;
    }
  },
  watch: {
    currAction() {
      this.list = [];
      this.$refs.loadmore.beforeRefresh();
    },
    show(val) {
      if (val) {
        this.scrollTop = document.scrollingElement.scrollTop;
        document.body.classList.add("m-pop-open");
        document.body.style.top = -this.scrollTop + "px";
      } else {
        document.body.style.top = "";
        document.body.classList.remove("m-pop-open");
        document.scrollingElement.scrollTop = this.scrollTop;
      }
    }
  },
  methods: {
    showDetail(val) {
      this.currInfo = val;
      this.show = true;
    },
    onRefresh() {
      this.$http
        .get("/wallet/charges", {
          params: {
            action: this.currAction,
            limit: 15
          }
        })
        .then(({ data = [] }) => {
          if (data.length > 0) {
            this.list = this.uniqById(data, this.list);
          }
          this.$refs.loadmore.topEnd(!(data.length < 15));
        });
    },

    onLoadMore() {
      this.$http
        .get("/wallet/charges", {
          params: {
            action: this.currAction,
            limit: 15,
            after: this.after
          }
        })
        .then(({ data = [] }) => {
          if (data.length > 0) {
            this.list = [...this.list, ...data];
          }
          this.$refs.loadmore.bottomEnd(data.length < 15);
        });
    }
  }
};
</script>
<style lang="less">
.p-wallet-detail {
  .m-head-top {
    overflow: initial;
  }
  .m-wallet-list {
    padding-top: 90px;
  }
}
</style>
