<template>
  <transition
  enter-active-class="animated slideInRight"
  leave-active-class="animated slideOutLeft">
    <div class="m-box-model m-pos-f p-location">
      <header class="m-pos-f m-box m-aln-center m-justify-bet m-main m-bb1">
        <div class="m-flex-grow1 m-flex-shrink1 m-flex-base0">
          <div class="m-search-box">
            <svg class="m-style-svg m-svg-def">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-search"></use>
            </svg>
            <input @focus="onFocus" @blur="onBlur" v-model="keyword" @input="searchCityByKey" type="search" placeholder="搜索">
          </div>
        </div>
        <div class="m-flex-grow0 m-flex-shrink0">
          <a @click.stop="goBack">取消</a>
        </div>
      </header>
      <main style="padding-top: 0.95rem">
        <div v-if="showHot">
          <div class="m-box m-aln-center m-justify-bet m-main current-location">
            <span>当前定位</span>
            <p class="m-flex-grow1 m-flex-shrink1 m-flex-base0 m-text-cut" 
            :class='{placeholder: currentTxt.length === 0}' @click="goBack">{{ currentTxt || placeholder }}</p>
            <svg class="m-style-svg m-svg-def" @click="getCurrentPosition">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="iconType"></use>
            </svg>
          </div>
          <div class="m-box-model">
            <span class="label">热门城市</span>
            <ul class="hot-list m-main">
              <li 
              :key="`${city}&${index}`"
              class="m-text-cut m-text-c"
              v-for="(city, index) in hotCities"
              @click="selectedHot(city)">
                <span>{{ city.slice(city.lastIndexOf(' ')) }}</span>
              </li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  </transition>
</template>

<script>
import {
  getGeo,
  getHotCities,
  getCurrentPosition
} from "@/api/bootstrappers.js";
export default {
  name: "location",
  data() {
    return {
      keyword: "",
      loading: false,
      hotCities: [],
      autoPos: {},
      hotPos: {},
      isFocus: false,
      placeholder: "未定位"
    };
  },
  computed: {
    showHot() {
      return this.keyword.length === 0 && !this.isFocus;
    },
    currentTxt() {
      return this.currentPos ? this.currentPos.label : "";
    },
    iconType() {
      return this.loading ? `#base-loading` : `#location-arrow`;
    },
    currentPos: {
      get() {
        return this.hotPos && this.hotPos.label
          ? this.hotPos
          : this.autoPos && this.autoPos.label ? this.autoPos : null;
      },
      set(val) {
        this.autoPos = val;
      }
    }
  },
  watch: {
    currentPos(val) {
      val && val.label && this.$lstore.setData("H5_CURRENT_POSITION", val);
    }
  },
  methods: {
    onFocus() {},
    onBlur() {},
    searchCityByKey: _.throttle(() => {}, 1e3),
    getCurrentPosition() {
      this.loading = true;
      this.hotPos = null;
      this.autoPos = null;
      this.placeholder = "定位中...";
      getCurrentPosition().then(
        data => {
          this.autoPos = data;
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.currentPos = {};
          this.placeholder = "未定位";
          this.$Message.error(err.message);
        }
      );
    },
    selectedHot(city) {
      if (this.loading) return;
      this.loading = true;
      getGeo(city.replace(/[\s\uFEFF\xA0]+/g, "")).then(data => {
        this.loading = false;
        this.hotPos = data;
        this.goBack();
      });
    }
  },
  mounted() {
    this.$lstore.hasData("H5_CURRENT_POSITION")
      ? (this.currentPos = this.$lstore.getData("H5_CURRENT_POSITION"))
      : this.getCurrentPosition();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { fullPath } = from;
      vm.goBack =
        fullPath.indexOf("find") > -1
          ? () => {
              !vm.loading && vm.$router.push("/find/ner");
            }
          : vm.goBack;
    });
  },
  created() {
    getHotCities().then(hotCities => {
      this.hotCities = hotCities;
    });
  }
};
</script>

<style lang="less">
.p-location {
  background-color: #f4f5f6;
  animation-duration: 0.3s;
  z-index: 100;
  header {
    padding: 20px 30px;
    bottom: initial;
  }
  .m-search-box {
    margin-right: 30px;
  }

  .current-location {
    font-size: 28px;
    margin-top: 20px;
    padding: 30px 30px 30px 20px;
    .placeholder {
      color: #b2b2b2;
    }
    p {
      padding: 0 35px;
    }
  }

  .label {
    padding: 20px;
    font-size: 26px;
    color: @text-color3;
  }

  .hot-list {
    padding: 10px 10px 30px 20px;
    li {
      display: inline-block;
      margin-top: 30px;
      margin-right: 30px;
      padding: 0 25px;
      width: 150px;
      height: 60px;
      line-height: 60px;
      border-radius: 8px;
      background-color: #f4f5f6;
      font-size: 28px;
    }
  }
}
</style>
