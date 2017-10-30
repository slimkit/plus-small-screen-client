<template>
  <section 
    style="width: 68vw; position: relative; margin-bottom: 8px; display: inherit"
  >
    <img 
      :style="`width: 100%; height: ${imageHeight}; object-fit: cover; max-height: 80vw;`" 
      v-if="imageSize == 1" 
      @click.stop="imageObject[0].paid ? showSwiper(0) : showPayDialog(imageObject[0], 0)"  
      v-lazy="imageObject[0].url"
    />
    <div style="width: 100%; display: flex;" v-if="imageSize == 2">
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[0].paid ? showSwiper(0) : showPayDialog(imageObject[0], 0)"
          v-lazy="imageObject[0].url"
        />
      </div>
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img 
          :class="$style.perFeedImg"
          @click.stop="imageObject[1].paid ? showSwiper(1) : showPayDialog(imageObject[1], 1)"
          v-lazy="imageObject[1].url"
        />
      </div>
    </div>
    <div style="width: 100%; display: flex;" v-if="imageSize == 3">
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img 
          :class="$style.perFeedImg" 
          @click.stop="imageObject[0].paid ? showSwiper(0) : showPayDialog(imageObject[0], 0)"
          v-lazy="imageObject[0].url" 
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img 
          :class="$style.perFeedImg"
          @click.stop="imageObject[1].paid ? showSwiper(1) : showPayDialog(imageObject[1], 1)"
          v-lazy="imageObject[1].url"
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img 
          :class="$style.perFeedImg"
          @click.stop="imageObject[2].paid ? showSwiper(2) : showPayDialog(imageObject[2], 2)"
          v-lazy="imageObject[2].url" 
        />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 4">
      <div style="width: 34vw" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[0].paid ? showSwiper(0) : showPayDialog(imageObject[0], 0)"
          v-lazy="imageObject[0].url"
        />
      </div>
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[1].paid ? showSwiper(1) : showPayDialog(imageObject[1], 1)"
          v-lazy="imageObject[1].url"
        />
      </div>
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[2].paid ? showSwiper(2) : showPayDialog(imageObject[2], 2)"
          v-lazy="imageObject[2].url"
        />
      </div>
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[3].paid ? showSwiper(3) : showPayDialog(imageObject[3], 3)"
          v-lazy="imageObject[3].url"
        />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 5">
      <div style="width: 66.6666%" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[0].paid ? showSwiper(0) : showPayDialog(imageObject[0], 0)"
          v-lazy="imageObject[0].url"
        />
      </div>
      <div style="width: 33.3333%">
        <div style="width: 100%; padding-bottom: 2px;" :class="$style.showImgBox">
          <img
            :class="$style.perFeedImg"
            @click.stop="imageObject[1].paid ? showSwiper(1) : showPayDialog(imageObject[1], 1)"
            v-lazy="imageObject[1].url"
          />
        </div>
        <div style="width: 100% padding-bottom: 2px;" :class="$style.showImgBox">
          <img
            :class="$style.perFeedImg"
            @click.stop="imageObject[2].paid ? showSwiper(2) : showPayDialog(imageObject[2], 2)"
            v-lazy="imageObject[2].url"
          />
        </div>
      </div>
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[3].paid ? showSwiper(3) : showPayDialog(imageObject[3], 3)"
          v-lazy="imageObject[3].url"
        />
      </div>
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[4].paid ? showSwiper(4) : showPayDialog(imageObject[4], 4)"
          v-lazy="imageObject[4].url"
        />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 6">
      <div style="width: 66.6666%" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[0].paid ? showSwiper(0) : showPayDialog(imageObject[0], 0)"
          v-lazy="imageObject[0].url"
        />
      </div>
      <div style="width: 33.3333%">
        <div style="width: 100%; padding-bottom: 2px;" :class="$style.showImgBox">
          <img
            :class="$style.perFeedImg"
            @click.stop="imageObject[1].paid ? showSwiper(1) : showPayDialog(imageObject[1], 1)"
            v-lazy="imageObject[1].url"
          />
        </div>
        <div style="width: 100% padding-bottom: 2px;" :class="$style.showImgBox">
          <img
            :class="$style.perFeedImg"
            @click.stop="imageObject[2].paid ? showSwiper(2) : showPayDialog(imageObject[2], 2)"
            v-lazy="imageObject[2].url"
          />
        </div>
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[3].paid ? showSwiper(3) : showPayDialog(imageObject[3], 3)"
          v-lazy="imageObject[3].url"
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[4].paid ? showSwiper(4) : showPayDialog(imageObject[4], 4)"
          v-lazy="imageObject[4].url"
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[5].paid ? showSwiper(5) : showPayDialog(imageObject[5], 5)"
          v-lazy="imageObject[5].url"
        />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 7">
      <div style="width: 34vw">
        <div style="width: 100%" :class="$style.showImgBox">
          <img
            :class="$style.perFeedImg"
            @click.stop="imageObject[0].paid ? showSwiper(0) : showPayDialog(imageObject[0], 0)"
            v-lazy="imageObject[0].url"
          />
        </div>
        <div style="width: 100%" :class="$style.showImgBox">
          <img
            :class="$style.perFeedImg"
            @click.stop="imageObject[3].paid ? showSwiper(3) : showPayDialog(imageObject[3], 3)"
            v-lazy="imageObject[3].url"
          />
        </div>
      </div>
      <div style="width: 34vw; display: flex; flex-wrap: wrap;">
        <div style="width: 50%; padding-bottom: 2px;" :class="$style.showImgBox">
          <img
            :class="$style.perFeedImg"
            @click.stop="imageObject[1].paid ? showSwiper(1) : showPayDialog(imageObject[1], 1)"
            v-lazy="imageObject[1].url"
          />
        </div>
        <div style="width: 50%; padding-bottom: 2px;" :class="$style.showImgBox">
          <img
            :class="$style.perFeedImg"
            @click.stop="imageObject[2].paid ? showSwiper(2) : showPayDialog(imageObject[2], 2)"
            v-lazy="imageObject[2].url"
          />
        </div>
        <div style="width: 100%;" :class="$style.showImgBox">
          <img
            :class="$style.perFeedImg"
            @click.stop="imageObject[4].paid ? showSwiper(4) : showPayDialog(imageObject[4], 4)"
            v-lazy="imageObject[4].url"
          />
        </div>
        <div style="width: 50%;" :class="$style.showImgBox">
          <img
            :class="$style.perFeedImg"
            @click.stop="imageObject[5].paid ? showSwiper(5) : showPayDialog(imageObject[5], 5)"
            v-lazy="imageObject[5].url"
          />
        </div>
        <div style="width: 50%;" :class="$style.showImgBox">
          <img
            :class="$style.perFeedImg"
            @click.stop="imageObject[6].paid ? showSwiper(6) : showPayDialog(imageObject[6], 6)"
            v-lazy="imageObject[6].url"
          />
        </div>
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 8">
      <div style="width: 33.3333%" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[0].paid ? showSwiper(0) : showPayDialog(imageObject[0], 0)"
          v-lazy="imageObject[0].url"
        />
      </div>
      <div style="width: 33.3333%; padding-bottom: 2px;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[1].paid ? showSwiper(1) : showPayDialog(imageObject[1], 1)"
          v-lazy="imageObject[1].url"
        />
      </div>
      <div style="width: 33.3333%; padding-bottom: 2px;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[2].paid ? showSwiper(2) : showPayDialog(imageObject[2], 2)"
          v-lazy="imageObject[2].url"
        />
      </div>
      <div style="width: 50%;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[3].paid ? showSwiper(3) : showPayDialog(imageObject[3], 3)"
          v-lazy="imageObject[3].url"
        />
      </div>
      <div style="width: 50%;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[4].paid ? showSwiper(4) : showPayDialog(imageObject[4], 4)"
          v-lazy="imageObject[4].url"
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[5].paid ? showSwiper(5) : showPayDialog(imageObject[5], 5)"
          v-lazy="imageObject[5].url"
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[6].paid ? showSwiper(6) : showPayDialog(imageObject[6], 6)"
          v-lazy="imageObject[6].url"
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[7].paid ? showSwiper(7) : showPayDialog(imageObject[7], 7)"
          v-lazy="imageObject[7].url"
        />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 9">
      <div style="width: 33.3333%" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[0].paid ? showSwiper(0) : showPayDialog(imageObject[0], 0)"
          v-lazy="imageObject[0].url"
        />
      </div>
      <div style="width: 33.3333%; padding-bottom: 2px;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[1].paid ? showSwiper(1) : showPayDialog(imageObject[1], 1)"
          v-lazy="imageObject[1].url"
        />
      </div>
      <div style="width: 33.3333%; padding-bottom: 2px;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[2].paid ? showSwiper(2) : showPayDialog(imageObject[2], 2)"
          v-lazy="imageObject[2].url"
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[3].paid ? showSwiper(3) : showPayDialog(imageObject[3], 3)"
          v-lazy="imageObject[3].url"
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[4].paid ? showSwiper(4) : showPayDialog(imageObject[4], 4)"
          v-lazy="imageObject[4].url"
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[5].paid ? showSwiper(5) : showPayDialog(imageObject[5], 5)"
          v-lazy="imageObject[5].url"
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img
          :class="$style.perFeedImg"
          @click.stop="imageObject[6].paid ? showSwiper(6) : showPayDialog(imageObject[6], 6)"
          v-lazy="imageObject[6].url"
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img
          @click.stop="imageObject[7].paid ? showSwiper(7) : showPayDialog(imageObject[7], 7)"
          :class="$style.perFeedImg"
          v-lazy="imageObject[7].url"
        />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img
          @click.stop="imageObject[8].paid ? showSwiper(8) : showPayDialog(imageObject[8], 8)"
          :class="$style.perFeedImg"
          v-lazy="imageObject[8].url"
        />
      </div>
    </div>
  </section>
</template>

<script>
  import { IMGSWIPER, FEEDSLIST } from '../stores/types';
  import buildURL from 'axios/lib/helpers/buildURL';
  import LockedImage from './LockedImage';
  import { createAPI, addAccessToken } from '../utils/request';
  import PlusMessageBundle from '../utils/es';
  import storeLocal from 'store';
  import {showAmount} from '../utils/balance';

  const { token = '' } = storeLocal.get('UserLoginInfo') || {};
  const feedImages = {
    data: () => ({
      open: false,
      amount: 0,
      token: '',
      goldName: window.TS_WEB.goldName
    }),
    components: {
      LockedImage
    },
    props: [
      'storages',
      'feed'
    ],
    computed: {
      imageSize () {
        return this.storages.length;
      },
      imageHeight () {
        let height = 0;
        if(this.storages.length === 1) {
          let rate = this.imageObject[0].width / this.imageObject[0].height;
          return (parseInt(68 / rate) > 80 ? 80 : parseInt(68 / rate)) + 'vw';
        }
      },
      
      imageObject() {
        const { storages } = this;
        return storages.map( (storage) => {
          if(storage.paid_node && !storage.paid) { // 未付费
            return {
              paid: false,
              paid_node: storage.paid_node,
              amount: storage.amount,
              url: buildURL(createAPI(`files/${storage.file}`), {w: 250, h: 250, token: this.token})
            };
          } else { // 已付费
            return {
              paid: true,
              paid_node: storage.paid_node,
              amount: storage. amount,
              url: buildURL(createAPI(`files/${storage.file}`), {w: 300, h: 300, token: this.token})
            };
          }
        });
      }
    },
    methods: {
      // 展示走马灯
      showSwiper (index) {
        let images = [];
        this.imageObject.forEach((storage) => {
          if( storage.url ) storage.url = (storage.url.replace(/\?.*/, ''));
          images.push(storage);
        });
        this.$store.dispatch(IMGSWIPER, cb => {
          cb({
            list:images,
            value: index,
            show: true,
            source: this.feed,
            sourceType: 'feed'
          });
        });
      },

      //展示付费
      showPayDialog (image, index) {
        this.$Modal.confirm({
          title: '付费支付',
          content: `<p>需要支付 ${showAmount(image.amount)}${this.goldName} </p>`,
          okText: '确认支付',
          loading: true,
          onOk: () => {
            addAccessToken().post(createAPI(`purchases/${image.paid_node}`), {
              validateStatus: status => status === 201                
            })
            .then(() => {
              this.$Modal.remove();
              this.$Message.success('支付成功');
              this.storages[index].paid = true;
              setTimeout(() => {
                this.showSwiper(index);
              }, 800);
              this.$store.getters[FEEDSLIST][this.feed].images[index].paid = true;
            })
            .catch( ({ response: { data, status } = {} }) => {
              this.$Modal.remove();
              this.$Message.error(PlusMessageBundle(data).getMessage());
            })
          }
        });
      }
    },
    created () {
      const { token = ''} = this.$storeLocal.get('UserLoginInfo') || {};
      this.token = token;
    },
  }

  export default feedImages;
</script>
<style scoped>
  .ivu-icon-help-circled {
    color: #f90!important;
    font-size: 36px!important;
  }
</style>
<style lang="scss" module>
  .FeedImages {
    width: 100%;
    img {
      width: 100%;
      object-fit: cover;
      display: flex;
    }
    .imagesRow {
      margin-bottom: 2px!important;
    }
  }
  .imgParent {
    overflow: hidden;
    &:before {
      content: "";
      display: block;
      padding-top: 100%;
    }
  }
  .showImgBox {
    position: relative;
    overflow: hidden;
    padding: 0 2px;
    left: -1px;
    margin-bottom: 2px;
    .perFeedImg {
      position: absolute;
      top: 0;
      left: 2px;
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
    &:before {
      content: "";
      display: block;
      padding-top: 100%;
    }
  }
</style>
