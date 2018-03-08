<template lang="html">
  <div class="wallet-detail">
    <head-top :go-back='true'>
      <diy-select slot='nav' v-model='currAction' :options='options' placeholder='明细'></diy-select>
    </head-top>
    <div></div>
    <load-more
    ref='loadmore'
    :onRefresh='onRefresh'
    :onLoadMore='onLoadMore'
    >
      <wallet-detail-item 
      v-for='item in list' 
      v-if='item.id'
      :key='item.id'
      :detail='item'
      @selected='selected'
      />
    </load-more>
    <modal v-model='open'>
      <walletInfo :detail='currInfo' v-if='currInfo && currInfo.id'/>
    </modal>
  </div>
</template>

<script>
import walletInfo from "./WalletInfo";
import Modal from "@/plugins/modal/modal";
import walletDetailItem from "./components/WalletDetailItem";
export default {
  name: "WalletDetail",
  components: {
    Modal,
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
      currInfo: null,
      list: [],
      open: false
    };
  },
  watch: {
    currAction() {
      this.list = [];
      this.$refs.loadmore.beforeRefresh();
    }
  },
  computed: {
    after() {
      const len = this.list.length;
      return len ? this.list[len - 1].id : 0;
    }
  },
  methods: {
    selected(val) {
      this.currInfo = val;
      this.open = true;
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

<style lang="css">
</style>
