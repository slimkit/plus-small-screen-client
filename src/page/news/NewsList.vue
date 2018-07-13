<template>
  <div class="p-news">
    <header class="m-box m-pos-f m-main m-bb1 m-head-top">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0">
        <svg
          class="m-style-svg m-svg-def"
          @click="goBack">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#base-back"/>
        </svg>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0 m-justify-center m-head-top-title">
        <span>资讯</span>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0 m-justify-end">
        <router-link
          append
          tag="svg"
          to="search"
          class="m-style-svg m-svg-def">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#base-search"/>
        </router-link>
        <svg
          class="m-style-svg m-svg-def"
          @click="beforeCreatePost">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#post-news"/>
        </svg>
      </div>
    </header>

    <news-filter @change="onCateChange"/>

    <jo-load-more
      ref="loadmore"
      class="p-news--body"
      @onRefresh="onRefresh"
      @onLoadMore="onLoadMore">

      <!-- 资讯顶部 banner 广告位 -->
      <banner-ad type="news"/>

      <template v-for="card in list" >
        <news-card
          v-if="card.author"
          :key="`news${card.id}`"
          :current-cate="currentCate"
          :news="card" />
        <ad-card
          v-if="card.space_id"
          :key="`ad${card.id}`"
          :ad="card"/>
      </template>
    </jo-load-more>
  </div>
</template>

<script>
import bus from "@/bus";
import _ from "lodash";
import NewsCard from "./components/NewsCard.vue";
import AdCard from "./components/AdCard.vue";
import NewsFilter from "./components/NewsFilter.vue";
import BannerAd from "@/components/advertisement/BannerAd.vue";
import * as bootApi from "@/api/bootstrappers.js";

const noop = () => {};

export default {
  name: "NewsList",
  components: {
    NewsCard,
    AdCard,
    NewsFilter,
    BannerAd
  },
  data() {
    return {
      list: [],
      currentCate: 0,
      newsList: [], // 资讯列表
      advertiseList: [], // 原始广告列表
      advertiseLeft: [] // 尚未加载的广告列表
    };
  },
  computed: {
    after() {
      const len = this.list.length;
      return len > 0 ? this.list[len - 1].id : 0;
    },
    advertiseTypeId() {
      const adType = this.$store.getters.getAdTypeBySpace("news:list:analog");
      return adType.id;
    }
  },
  mounted() {
    this.getAdvertiseList();
  },
  methods: {
    onCateChange({ id = 0 } = {}) {
      this.newsList = [];
      this.currentCate = id;
      this.onRefresh(noop);
    },
    onRefresh(callback) {
      // GET /news
      const params =
        this.currentCate === 0
          ? { limit: 10, recommend: 1 }
          : { limit: 10, cate_id: this.currentCate };

      this.$http.get("/news", { params }).then(({ data = [] }) => {
        this.newsList = data;
        callback(data.length >= 10);

        // 从广告栈顶取出一条随机插入列表
        let rand = ~~(Math.random() * 9) + 1;
        rand > data.length && (rand = data.length);
        this.advertiseLeft = _.cloneDeep(this.advertiseList);
        this.advertiseLeft.length &&
          data.splice(rand, 0, this.advertiseLeft.shift());
        this.list = data;
      });
    },
    onLoadMore(callback) {
      const params =
        this.currentCate === 0
          ? { limit: 10, recommend: 1, after: this.after }
          : { limit: 10, cate_id: this.currentCate, after: this.after };
      this.$http.get("/news", { params }).then(({ data = [] } = {}) => {
        this.newsList = [...this.newsList, ...data];
        callback(data.length < 10);
      });
    },
    /**
     * 投稿前进行认证确认
     */
    beforeCreatePost() {
      // 如果后台设置了不需要验证 或 用户已经认证就直接跳转
      const noNeedVerify =
        !this.$store.state.CONFIG["news:contribute"].verified ||
        !_.isEmpty(this.$store.state.CURRENTUSER.verified);
      if (noNeedVerify) return this.$router.push({ path: "/post/release" });
      else {
        const actions = [
          {
            text: "个人认证",
            method: () =>
              this.$router.push({
                path: "/profile/certificate",
                query: { type: "user" }
              })
          },
          {
            text: "企业认证",
            method: () =>
              this.$router.push({
                path: "/profile/certificate",
                query: { type: "org" }
              })
          }
        ];
        bus.$emit(
          "actionSheet",
          actions,
          "取消",
          "认证用户才能创建投稿，去认证？"
        );
      }
    },
    getAdvertiseList() {
      bootApi.getAdsById(this.advertiseTypeId).then(({ data }) => {
        this.advertiseList = data;
        this.advertiseLeft = _.cloneDeep(data);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.p-news {
  &--nav {
    display: flex;
    position: fixed;
    top: 90px;
    padding-top: 0 !important;
    width: 100%;
    height: 85px;
    border-bottom: 1px solid #ededed; /*no*/
    background-color: #fff;
  }

  &--body {
    padding-top: 90+80px;
  }
}
</style>
