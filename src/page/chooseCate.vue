<template>
  <transition name="fade">
    <div class="m-box-model m-pos-f p-choose-category m-main" v-if="show">
      <header class="m-box m-aln-center m-justify-bet m-flex-grow0 m-flex-shrink0 m-head-top m-main m-bb1">
        <div class="m-flex-grow1 m-flex-shrink1">
          <svg class="m-style-svg m-svg-def" @click="cancel">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
          </svg>
        </div>
        <div class="m-flex-grow1 m-shrink1 m-head-top-title m-text-c">
          <span>选择栏目</span>
        </div>
        <div class="m-flex-grow1 m-flex-shrink1 m-text-r"></div>
      </header>
      <main>
        <ul class="m-cates">
          <li
          v-for="cate in cates"
          v-if="cate.id"
          :key="cate.id"
          @click="selected(cate)"
          class="m-cate"><span>{{ cate.name }}</span></li>
        </ul>
      </main>
    </div>
  </transition>
</template>
<script>
import bus from "@/bus.js";
export default {
  name: "choose-cate",
  data() {
    return {
      show: false,
      cates: []
    };
  },
  created() {
    this.fetchCates();
    bus.$on("choose-cate", callback => {
      typeof callback === "function" && (this.callback = callback);
      this.show = true;
      this.scrollable = false;
    });
  },
  beforeDestroy() {
    bus.$off("choose-cate");
  },
  methods: {
    callback() {},
    selected(cate) {
      typeof this.callback === "function" && this.callback(cate);
      this.cancel();
    },
    cancel() {
      this.show = false;
      this.scrollable = true;
    },
    fetchCates() {
      // GET /news/cates
      this.$http
        .get(`/news/cates`)
        .then(({ data: { my_cates = [], more_cates = [] } }) => {
          this.cates = [...my_cates, ...more_cates];
        });
    }
  }
};
</script>

<style lang="less">
.p-choose-category {
  .m-cates {
    padding: 30px;
  }
}
.m-cates {
  margin-top: -30px;
  margin-left: -30px;
}

.m-cate {
  display: inline-block;
  padding: 0 10px;
  margin-top: 30px;
  margin-left: 30px;
  width: calc((1 / 4 * 100%) ~" - 30px");
  height: 60px;
  line-height: 60px;
  font-size: 28px;
  background-color: #f4f5f5;
  border-radius: 8px;
  span {
    overflow: hidden;
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
  }
}
</style>
