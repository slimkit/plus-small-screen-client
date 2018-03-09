<template>
  <!-- Root element of PhotoSwipe. Must have class pswp. -->
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <!-- Background of PhotoSwipe.
      It's a separate element, as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>
    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">
      <!-- Container that holds slides. PhotoSwipe keeps only 3 slides in DOM to save memory. -->
      <!-- don't modify these 3 pswp__item elements, data is added later on. -->
      <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
      </div>
      <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
      <div class="pswp__ui pswp__ui--hidden">
        <div class="pswp__top-bar">
          <!--  Controls are self-explanatory. Order can be changed. -->
          <div class="pswp__counter"></div>
          <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
          <!-- <button class="pswp__button pswp__button--share" title="Share"></button> -->
          <!-- <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button> -->
          <!-- <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button> -->
          <!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
          <!-- element will get class pswp__preloader--active when preloader is running -->
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
          <div class="pswp__share-tooltip"></div>
        </div>
        <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
        </button>
        <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
        </button>
        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>
      </div>
    </div>
    <button class="pic-action-btn" :data-id='file' v-show='!!title' @click='payForImg'>{{ title }}</button>
  </div>
</template>
<script>
import "./style/pswp/pswp.min.css";

import PhotoSwipe from "photoswipe";
import PhotoSwipeUI from "photoswipe/dist/photoswipe-ui-default.js";
import bus from "@/bus.js";
export default {
  name: "pswp",
  data() {
    return {
      photoswipe: null,
      title: "",
      file: 0,
      fid: null,
      index: -1,
      amount: 0,
      paidNode: 0
    };
  },
  created() {
    bus.$on("mvGallery", ({ fid, index, images }) => {
      this.fid = fid;
      this.openPhotoSwipe(index, images);
    });
  },
  computed: {
    currItem: {
      set({ amount, paidNode, index }) {
        this.index = index;
        this.amount = amount;
        this.paidNode = paidNode;
      },
      get() {
        return {
          index: this.index,
          amount: this.amount,
          paidNode: this.paidNode
        };
      }
    }
  },
  methods: {
    payForImg() {
      const vm = this;
      const glodName =
        this.$store.state.CONFIG.site.currency_name.name || "积分";
      if (!(this.index >= 0 && this.amount > 0 && this.paidNode > 0)) return;
      this.$Modal.pay({
        content: `您只需支付${vm.amount}${glodName}即可查看图片`,
        price: vm.amount,
        onOk(callback) {
          vm.$http
            .post(`/currency/purchases/${vm.paidNode}`, {
              validateStatus: s => s === 201
            })
            .then(
              ({ data: { message = ["付费成功"] } = {} }) => {
                vm.$Message.success(message);
                bus.$emit("updateFile", {
                  fid: vm.fid,
                  index: vm.index
                });
                callback && callback();
              },
              () => {
                callback && callback();
              }
            );
        }
      });
    },
    openPhotoSwipe(index, images) {
      const vm = this;
      const options = {
        index,
        loop: false,
        arrowEl: false,
        captionEl: true,
        showHideOpacity: true,
        tapToToggleControls: false,
        errorMsg:
          '<div class="pswp__error-msg"><a href="%url%" target="_blank">图片加载失败</a></div>',
        addCaptionHTMLFn(item) {
          // item      - slide object
          // captionEl - caption DOM element
          // isFake    - true when content is added to fake caption container
          //             (used to get size of next or previous caption)
          vm.file = item.file;
          if (!item.title) {
            vm.title = "";
            return false;
          } else {
            vm.title = item.title;
            const { amount, paid_node, index } = item;
            vm.currItem = {
              index,
              amount,
              paidNode: paid_node
            };
            return true;
          }
        }
      };
      this.photoswipe = new PhotoSwipe(this.$el, PhotoSwipeUI, images, options);
      this.photoswipe.init();
      bus.$on("updatePhoto", src => {
        this.title = "";
        this.photoswipe.currItem.container.querySelector(
          "img.pswp__img"
        ).src = src;
      });
      this.photoswipe.listen("close", function() {
        this.title = "";
        bus.$off("updatePhoto");
      });
    }
  }
};
</script>
