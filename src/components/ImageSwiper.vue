<template>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <div v-show="show" :class="$style.swiper">
      <swiper :show-dots="true" dots-position="left" style="width: 100%; height: 100%" :show-desc-mask="false" :duration="150" v-model="value" height="100%">
        <swiper-item @click="hideSwiper" class="swiper-demo-img" v-for="(item, index) in list" :key="index">
          <img @click="hideSwiper" class="big-img" v-lazy="item">
        </swiper-item>
      </swiper>
    </div>
  </transition>
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
      enter (el, done) {

      },
      beforeEnter (el) {

      },
      leave(el, done) {

      },
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
    transition: transform .2s;
    transform:scale(1);
    height: 100%;
    width: 100%;
  }
</style>
<style>
  .vux-swiper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .v-enter-active.v-enter-to {
    transform: scale(1,1);
  }
  .vux-slider>.vux-swiper>.vux-swiper-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vux-swiper-item img {
    width: 100%;
    max-height: 100%;
  }
  .vux-slider>.vux-swiper {
    overflow: auto!important;
  }
  img.big-img[lazy=loading] {
    width: auto;
    height: auto;
    animation:change 1s linear infinite;
  }
  @-webkit-keyframes change
  {
　　0%{-webkit-transform:rotate(0deg);}
　　50%{-webkit-transform:rotate(180deg);}
　　100%{-webkit-transform:rotate(360deg);}
  }
</style>