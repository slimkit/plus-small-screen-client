<template>
  <transition name='pop'>
    <div @touchmove.prevent v-if='show' class="m-box-model m-pos-f" style="background-color: #f4f5f6">
      <header class="m-box m-aln-center m-head-top m-main m-bb1">
        <div class="m-flex-grow1">
          <svg class="m-style-svg m-svg-def" @click="cancel">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
          </svg>
        </div>
        <div class="m-box m-aln-center m-justify-center m-flex-grow1 m-head-top-title">
          <span>打赏</span>
        </div>
        <div class="m-box m-aln-center m-justify-end m-flex-grow1 m-text-r">
          <button class="m-btn" @click.stop.prevent="resetProps" :disabled="!(amount > 0)">重置</button>
        </div>
      </header>
      <main class="m-box-model m-aln-center m-justify-center">
        <div class="m-box-model m-lim-width m-main">
          <div class="m-pinned-amount-btns">
            <p class="m-pinned-amount-label">选择打赏积分</p>
            <div class="m-box m-aln-center ">
                <button
                  :key="item"
                  v-for="item in items"
                  class="m-pinned-amount-btn"
                  :style="{ width: `${1 / items.length * 100}%` }"
                  :class="{ active: ~~amount === ~~item &&  !customAmount }"
                  @click="chooseDefaultAmount(item)">{{ ~~item }}</button>
            </div>
          </div>
          <div class="m-box m-aln-center m-justify-bet m-bb1 m-bt1 m-pinned-row plr20 m-pinned-amount-customize">
            <span>自定义金额</span>
            <div class="m-box m-aln-center">
              <input
                type="number"
                class="m-text-r"
                pattern="[0-9]*"
                v-model="customAmount"
                placeholder="输入积分"
                oninput="value=value.slice(0,8)">
              <span>积分</span>
            </div>
          </div>
        </div>
        <div class="plr20 m-lim-width" style="margin-top: 0.6rem">
          <button
          :disabled="disabled || loading"
          class="m-long-btn m-signin-btn"
          @click="handleOk">
            <svg v-if="loading" class="m-style-svg m-svg-def">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-loading"></use>
            </svg>
            <span v-else>确定</span>
          </button>
        </div>
      </main>
    </div>
  </transition>
</template>
<script>
import bus from "@/bus.js";
const noop = () => {};
export default {
  name: "reward",
  data() {
    return {
      show: false,
      amount: null,
      loading: false,
      customAmount: null,
      rewardType: ""
    };
  },
  computed: {
    items() {
      return this.$store.state.CONFIG.site.reward.amounts.split(",") || [];
    },
    disabled() {
      return !this.amount > 0;
    }
  },
  watch: {
    customAmount(val) {
      this.amount = ~~val;
    }
  },
  created() {
    bus.$on("reward:user", userID => {
      this.rewardType = "user";
      this.open();
      this.rewardUser = () => {
        if (this.loading) return;
        this.loading = true;
        this.$http
          .post(`/user/${userID}/new-rewards`, {
            amount: this.amount
          })
          .then(({ data = {} }) => {
            this.loading = false;
            this.$Message.success(data);
            this.$nextTick(this.cancel);
          })
          .catch(() => {
            this.loading = false;
          });
      };
    });
    bus.$on("reward:feed", feedID => {
      this.rewardType = "feed";
      this.open();
      this.rewardFeed = () => {
        if (this.loading) return;
        this.loading = true;
        this.$http
          .post(`/feeds/${feedID}/new-rewards`, {
            amount: this.amount
          })
          .then(({ data = {} }) => {
            this.loading = false;
            this.$Message.success(data);
            this.$nextTick(this.cancel);
          })
          .catch(() => {
            this.loading = false;
          });
      };
    });
    bus.$on("reward:groupPost", postID => {
      this.rewardType = "feed";
      this.open();
      this.rewardFeed = () => {
        if (this.loading) return;
        this.loading = true;
        this.$http
          .post(`/plus-group/group-posts/${postID}/new-rewards`, {
            amount: this.amount
          })
          .then(({ data = {} }) => {
            this.loading = false;
            this.$Message.success(data);
            this.$nextTick(this.cancel);
          })
          .catch(() => {
            this.loading = false;
          });
      };
    });
  },
  methods: {
    rewardFeed() {},
    rewardUser() {},
    handleOk() {
      this.rewardType === "feed" ? this.rewardFeed() : "";
      this.rewardType === "user" ? this.rewardUser() : "";
    },
    chooseDefaultAmount(amount) {
      this.customAmount && (this.customAmount = null);
      this.amount = amount;
    },
    resetProps() {
      this.customAmount = null;
      // this.amount = this.items[0];
      this.amount = null;
    },
    open() {
      this.show = true;
      this.scrollable = false;
    },
    cancel() {
      this.show = false;
      this.rewardType = "";
      this.rewardFeed = noop;
      this.scrollable = true;
    }
  },
  mounted() {
    /**
     * 默认选择 1.00
     */
    // this.resetProps();
  }
};
</script>

<style>
.m-pinned-row {
  font-size: 0.3rem;
  height: 1rem;
}
.plr20 {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
