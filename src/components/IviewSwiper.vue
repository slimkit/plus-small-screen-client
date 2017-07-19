<template>
  <transition name="custom-classes-transition" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
    <swiper
      v-if="show"
      class="swiperRoot"
      :class="{ active: show }"
      :options="options"
      ref="mySwiper"
    >
      <swiper-slide class="swiperSlide" v-for="(item, index) in list" :key="index">
        <div class="swiper-zoom-container" v-if="item.paid">
          <img :data-src="item.url" class="swiper-lazy">
          <div class="swiper-lazy-preloader"></div>
        </div>
        <div class="swiper-container" v-else>
          <LockedImageForSwiper />
        </div>
      </swiper-slide>
      <div v-if="list.length > 1" class="swiper-pagination swiper-pagination-bullets" slot="pagination"></div>
    </swiper>
  </transition>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { mapState } from 'vuex';
  import { IMGSWIPER } from '../stores/types';
  import LockedImageForSwiper from './LockedImageForSwiper';

  const imageSwiper = {
    components: {
      swiper,
      swiperSlide,
      LockedImageForSwiper
    },
    computed: {
      ...mapState({
        list: state => state.imageSwiper.imageSwiper.list,
        show: state => state.imageSwiper.imageSwiper.show,
        options: function (state) {
          let _this = this;
          return {
            speed: 200,
            autoplay: 0,
            setWrapperSize :true,
            direction : 'horizontal',
            initialSlide: state.imageSwiper.imageSwiper.value,
            pagination : '.swiper-pagination',
            preloadImages:false,
            notNextTick: true,
            zoom : true,
            slidesPerView: 1,
            watchSlidesVisibility: true,
            lazyLoading : true,
            preventLinksPropagation: false,
            onClick(swiper){
              _this.hideSwiper();
            }
          };
        }
      })
    },
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

<style lang="scss">
  .swiperRoot {
    position: fixed!important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    overflow: auto;
    background-color: #000;
    z-index: 9!important;
    transition: transform .9s;
    transform:scale(1);
    .swiperSlide {
      display: flex!important;
      justify-content: center;
      align-items: center;
    }
    .swiper-pagination-bullets {
      top: 15px;
      bottom: initial!important;
      .swiper-pagination-bullet {
        background-color: #aaa;
      }
      .swiper-pagination-bullet.swiper-pagination-bullet-active {
        background-color: #fff;
      }
    }
  }
  .swiper-lazy-loaded {
    width: 100%!important;
  }

</style>