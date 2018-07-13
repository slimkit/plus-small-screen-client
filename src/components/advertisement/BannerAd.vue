<template>
  <div class="c-banner-advertisement">
    <swipe
      v-if="list.length"
      :autoplay-time="loopTime"
      class="banner-swipe">
      <swipe-item
        v-for="ad in list"
        :key="ad.id">
        <a
          :href="ad.data.link"
          class="wrap">
          <img
            :src="ad.data.image"
            class="ad">
          <h4 class="title">{{ ad.title }}</h4>
        </a>
      </swipe-item>
    </swipe>
  </div>
</template>

<script>
import "c-swipe/dist/swipe.css";
import { Swipe, SwipeItem } from "c-swipe";
import * as bootApi from "@/api/bootstrappers.js";

/**
 * 广告位类型映射表
 */
const adMap = {
  "feed:hot": "feed:list:top",
  news: "news:list:top"
};

export default {
  name: "BannerAd",
  components: { Swipe, SwipeItem },
  props: {
    /**
     * 广告类型
     * 可选值: feed:hot (热门动态列表页), news (资讯列表页),
     * @type {string}
     */
    type: {
      type: String,
      required: true,
      validator: val => Object.keys(adMap).includes(val)
    },
    /**
     * 轮播图轮询时间 ms
     * @type {number}
     */
    loopTime: { type: Number, default: 3000 }
  },
  data() {
    return {
      list: [] // 轮播图列表
    };
  },
  computed: {
    /**
     * 顶部 banner 广告列表
     * @returns {number}
     */
    adTypeId() {
      const adType = this.$store.getters.getAdTypeBySpace(adMap[this.type]);
      return adType.id;
    }
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    fetchList() {
      // TODO: @mutoe [api] refactor there with vuex action
      bootApi.getAdsById(this.adTypeId).then(({ data }) => {
        this.list = data.sort((a, b) => a.sort < b.sort);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.c-banner-advertisement {
  .banner-swipe {
    .wrap {
      @radio: 414 / 215; // banner 固定的宽高比

      height: calc(~"100vw / @{radio}"); // 由屏幕宽度计算出相应比例的高度
      position: relative;
      display: block;

      .title {
        position: absolute;
        bottom: 16px;
        width: 100%;
        text-align: center;
        color: #fff;
        font-size: 28px;
      }

      img.ad {
        width: 100%;
      }
    }
  }
}
</style>
