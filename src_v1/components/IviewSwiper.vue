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
          <img :data-src="`${item.url}?token=${token}`" class="swiper-lazy">
          <div class="swiper-lazy-preloader"></div>
        </div>
        <div class="swiper-container noRelative" v-else>
          <img v-lazy="item.url"  />
          <span class="payButton">付费购买</span>
        </div>
      </swiper-slide>
      <div v-if="list.length > 1" class="swiper-pagination swiper-pagination-bullets" slot="pagination"></div>
    </swiper>
  </transition>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { mapState } from 'vuex';
  import { IMGSWIPER, FEEDSLIST } from '../stores/types';
  import LockedImageForSwiper from './LockedImageForSwiper';
  import storeLocal from 'store';
  import { createAPI, addAccessToken } from '../utils/request';
  import PlusMessageBundle from '../utils/es';
  import {showAmount} from '../utils/balance';

  const imageSwiper = {
    data: () => ({
      token: '',
      goldName: window.TS_WEB.goldName
    }),
    components: {
      swiper,
      swiperSlide,
      LockedImageForSwiper
    },
    computed: {
      ...mapState({
        list: state => state.imageSwiper.imageSwiper.list,
        show: state => state.imageSwiper.imageSwiper.show,
        source: state => state.imageSwiper.imageSwiper.source,
        sourceType: state => state.imageSwiper.imageSwiper.sourceType,
        options: function (state) {
          let _this = this;
          return {
            speed: 200,
            autoplay: 0,
            setWrapperSize :false,
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
            preventClicks: false,
            updateOnImagesReady: true,
            onClick(swiper){
              _this.hideSwiper(swiper);
            }
          };
        }
      })
    },
    methods: {
      hideSwiper (swiper) {
        const list = this.list;
        const { activeIndex: index } = swiper;
        const item = list[index];
        this.$store.dispatch(IMGSWIPER, cb => {
          cb({
            list: [],
            value: 0,
            show: false
          });
        });
        if ( item.paid_node && !item.paid ) {
          this.$Modal.confirm({
            title: '付费支付',
            content: `<p>需要支付 ${showAmount(item.amount)} ${this.goldName}</p>`,
            okText: '确认支付',
            loading: true,
            onOk: () => {
              addAccessToken().post(createAPI(`purchases/${item.paid_node}`), {
                validateStatus: status => status === 201                
              })
              .then(() => {
                this.$Modal.remove();
                this.$Message.success('支付成功');
                list[index].paid = true;
                list[index].url = item.url;
                this.$store.getters[FEEDSLIST][this.source].images[index].paid = true;
                this.$store.dispatch(IMGSWIPER, cb => {
                  cb({
                    list:list,
                    value: index,
                    show: true,
                    source: this.source,
                    sourceType: this.sourceType
                  });
                });
              })
              .catch( ({ response: { data, status } = {} }) => {
                this.$Modal.remove();
                this.$Message.error(PlusMessageBundle(data).getMessage());
              })
            }
          });
        }
      }
    },
    created () {
      const { token = '' } = this.$storeLocal.get('UserLoginInfo') || {};
      this.token = token;
    }
  }

  export default imageSwiper;
</script>

<style lang="less" scoped>
  .swiperRoot {
    overflow: auto;
    position: fixed!important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9!important;
    margin: auto;
    background-color: #000;
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
  .payButton {
    color: #fff;
    position: absolute;
    padding: 4px 8px;
    background-color: #59b6d7 ;
    border-radius: 5px;
    bottom: 8vh;
    left: calc(~"50% - 36px");
  }
  .noRelative {
    position: initial;
    height: 100%;
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

</style>