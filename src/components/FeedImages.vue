<template>
  <section style="width: 68vw; position: relative; margin-bottom: 8px; display: inherit">
    <img :style="`width: 100%; height: ${imageHeight}; object-fit: cover; max-height: 80vw;`" v-if="imageSize == 1" @click.stop="showSwiper(0)"  v-lazy="imageObject[0]" />
    <div style="width: 100%; display: flex;" v-if="imageSize == 2">
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(0)"  v-lazy="imageObject[0]" />
      </div>
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(1)"  v-lazy="imageObject[1]" />
      </div>
    </div>
    <div style="width: 100%; display: flex;" v-if="imageSize == 3">
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(0)"  v-lazy="imageObject[0]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(1)"  v-lazy="imageObject[1]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(2)"  v-lazy="imageObject[2]" />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 4">
      <div style="width: 34vw" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(0)"  v-lazy="imageObject[0]" />
      </div>
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(1)"  v-lazy="imageObject[1]" />
      </div>
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(2)"  v-lazy="imageObject[2]" />
      </div>
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(3)"  v-lazy="imageObject[3]" />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 5">
      <div style="width: 66.6666%" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(0)"  v-lazy="imageObject[0]" />
      </div>
      <div style="width: 33.3333%">
        <div style="width: 100%; padding-bottom: 2px;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click.stop="showSwiper(1)"  v-lazy="imageObject[1]" />
        </div>
        <div style="width: 100% padding-bottom: 2px;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click.stop="showSwiper(2)"  v-lazy="imageObject[2]" />
        </div>
      </div>
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(3)"  v-lazy="imageObject[3]" />
      </div>
      <div style="width: 34vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(4)"  v-lazy="imageObject[4]" />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 6">
      <div style="width: 66.6666%" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(0)"  v-lazy="imageObject[0]" />
      </div>
      <div style="width: 33.3333%">
        <div style="width: 100%; padding-bottom: 2px;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click.stop="showSwiper(1)"  v-lazy="imageObject[1]" />
        </div>
        <div style="width: 100% padding-bottom: 2px;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click.stop="showSwiper(2)"  v-lazy="imageObject[2]" />
        </div>
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(3)"  v-lazy="imageObject[3]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(4)"  v-lazy="imageObject[4]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(5)"  v-lazy="imageObject[5]" />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 7">
      <div style="width: 34vw">
        <div style="width: 100%" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click.stop="showSwiper(0)"  v-lazy="imageObject[0]" />
        </div>
        <div style="width: 100%" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click.stop="showSwiper(3)"  v-lazy="imageObject[3]" />
        </div>
      </div>
      <div style="width: 34vw; display: flex; flex-wrap: wrap;">
        <div style="width: 50%; padding-bottom: 2px;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click.stop="showSwiper(1)"  v-lazy="imageObject[1]" />
        </div>
        <div style="width: 50%; padding-bottom: 2px;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click.stop="showSwiper(2)"  v-lazy="imageObject[2]" />
        </div>
        <div style="width: 100%;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click.stop="showSwiper(4)"  v-lazy="imageObject[4]" />
        </div>
        <div style="width: 50%;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click.stop="showSwiper(5)"  v-lazy="imageObject[5]" />
        </div>
        <div style="width: 50%;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click.stop="showSwiper(6)"  v-lazy="imageObject[6]" />
        </div>
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 8">
      <div style="width: 33.3333%" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(0)"  v-lazy="imageObject[0]" />
      </div>
      <div style="width: 33.3333%; padding-bottom: 2px;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(1)"  v-lazy="imageObject[1]" />
      </div>
      <div style="width: 33.3333%; padding-bottom: 2px;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(2)"  v-lazy="imageObject[2]" />
      </div>
      <div style="width: 50%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(3)"  v-lazy="imageObject[3]" />
      </div>
      <div style="width: 50%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(4)"  v-lazy="imageObject[4]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(5)"  v-lazy="imageObject[5]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(6)"  v-lazy="imageObject[6]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(7)"  v-lazy="imageObject[7]" />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 9">
      <div style="width: 33.3333%" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(0)"  v-lazy="imageObject[0]" />
      </div>
      <div style="width: 33.3333%; padding-bottom: 2px;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(1)"  v-lazy="imageObject[1]" />
      </div>
      <div style="width: 33.3333%; padding-bottom: 2px;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(2)"  v-lazy="imageObject[2]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(3)"  v-lazy="imageObject[3]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(4)"  v-lazy="imageObject[4]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(5)"  v-lazy="imageObject[5]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(6)"  v-lazy="imageObject[6]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(7)"  v-lazy="imageObject[7]" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click.stop="showSwiper(8)"  v-lazy="imageObject[8]" />
      </div>
    </div>
  </section>
</template>

<script>
  import { createAPI } from '../utils/request';
  import { IMGSWIPER } from '../stores/types';
  import buildURL from 'axios/lib/helpers/buildURL';

  const feedImages = {
    props: [
      'storages'
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
        let storages = this.storages;
        return storages.map( (storage) => {
          return buildURL(createAPI(`files/${storage.file}`), {
            w: 200,
            h: 200
          })
        });
      }
    },
    methods: {
      // 展示走马灯
      showSwiper (index) {
        let images = [];
        this.imageObject.forEach((storage) => {
          images.push(storage.replace(/\?.*/, ''));
        });
        this.$store.dispatch(IMGSWIPER, cb => {
          cb({
            list:images,
            value: index,
            show: true
          });
        });
      }
    }
  }

  export default feedImages;
</script>

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
