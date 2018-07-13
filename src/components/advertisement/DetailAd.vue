<template>
  <div
    v-if="list.length"
    class="c-detail-ad">
    <a
      v-for="ad in list"
      :href="ad.data.link"
      :key="ad.id"
      class="item">
      <div
        :style="{'background-image': `url(${ad.data.image})`}"
        class="img"/>
    </a>
  </div>
</template>

<script>
import * as bootApi from "@/api/bootstrappers.js";

/**
 * 广告位类型映射表
 */
const adMap = {
  feed: "feed:single",
  news: "news:single",
  "group:home": "group:index:top",
  "group:post": "group:single"
};

export default {
  name: "DetailAd",
  props: {
    /**
     * 广告类型
     * 可选值: feed (动态详情页), news (资讯详情页),
     *         group:home (圈子主页), group:post (圈子帖子详情页)
     * @type {string}
     */
    type: {
      type: String,
      required: true,
      validator: val => Object.keys(adMap).includes(val)
    }
  },
  data() {
    return {
      list: [] // 图片列表
    };
  },
  computed: {
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
      bootApi.getAdsById(this.adTypeId).then(({ data }) => {
        this.list = data.sort((a, b) => a.sort < b.sort);
      });
    }
  }
};
</script>

<style lang="less" scoped>
@radio: 1020 / 180; // 广告宽高比

.c-detail-ad {
  display: flex;
  align-items: stretch;
  margin-top: 10px;
  padding: 20px;
  background-color: #fff;
  width: 100vw;
  height: calc(~"(100vw + 40px) / @{radio}");

  > .item {
    display: block;
    margin-right: 10px;
    width: 100%;

    &:last-child {
      margin-right: 0;
    }
    .img {
      width: 100%;
      height: 100%;
      background: no-repeat center;
      background-size: cover;
    }
  }
}
</style>
