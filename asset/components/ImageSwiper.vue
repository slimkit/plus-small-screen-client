<template>
  <div v-show="show" :class="$style.swiper">
    <swiper :show-dots="true" dots-position="top" :show-desc-mask="false" :duration="200" @on-index-change="onSwiperItemIndexChange" v-model="swiperItemIndex" v-model="value" style="width: 100%; height:100%" height="100%">
      <swiper-item class="swiper-demo-img" v-for="(item, index) in list" :key="index">
        <img @click="hideSwiper" :src="item">
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import { Swiper, SwiperItem } from 'vux/src/components/swiper';
  import { mapState } from 'vuex';
  import { IMGSWIPER } from '../stores/types';

  const imageSwiper = {
    components: {
      Swiper,
      SwiperItem
    },
    computed: mapState({
      list: state => state.imageSwiper.imageSwiper.list,
      value: state => state.imageSwiper.imageSwiper.value,
      show: state => state.imageSwiper.imageSwiper.show
    }),
    methods: {
      hideSwiper () {
        this.$store.dispatch(IMGSWIPER, cb => {
          cb({
            list: [],
            value: 0,
            show: false
          });
        });
      }
    }
  }

  export default imageSwiper;
</script>

<style lang="scss" module>
  .swiper {
    display: flex;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    overflow: auto;
    position: fixed;
    justify-content: center;
    align-items: center;
    background-color: rgb(0, 0, 0);
    z-index: 9;
  }
</style>
<style>
  .vux-swiper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vux-slider>.vux-swiper>.vux-swiper-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vux-swiper-item img {
    max-width: 100%;
  }
  .vux-slider>.vux-swiper {
    overflow: auto!important;
  }
  .swiper-demo-img {
    visibility: hidden;
  }
</style>