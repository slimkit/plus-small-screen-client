<template>
  <Row>
    <Col :span="20">
      <div :class="$style.FeedImages">
        <div v-if="imageSize == 1" class="images" style="overflow: hidden;">
          <Row :class="$style.imagesRow">
            <Col :span="24">
              <img @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 60)" />
            </Col>
          </Row>
        </div>
        <div v-if="imageSize == 2" class="images">
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 40)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id, 40)" />
              </div>
            </Col>
          </Row>
        </div>
        <div v-if="imageSize == 3" class="images">
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img v-lazy="getImg(imageObject[0].storage_id)" class="per-feed-img" @click="showSwiper(0)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8" >
              <div :class="$style.showImgBox">
                <img v-lazy="getImg(imageObject[1].storage_id)" class="per-feed-img" @click="showSwiper(1)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img v-lazy="getImg(imageObject[2].storage_id)" class="per-feed-img" @click="showSwiper(2)" />
              </div>
            </Col>
          </Row>
        </div>
        <div v-if="imageSize == 4" class="images">
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="12" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id)" />
              </div>
            </Col>
          </Row>
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="12" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(2)"  v-lazy="getImg(imageObject[2].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="12" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(3)"  v-lazy="getImg(imageObject[3].storage_id)" />
              </div>
            </Col>
          </Row>
        </div>
        <div v-if="imageSize == 5" class="images">
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="16">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 40)" />
              </div>
            </Col>
            <Col :span="8" style="padding-left: 0; padding-right: 0;">
              <Row :gutter="2" style="margin-bottom: 2px;">
                <Col :class="$style.imgParent" :span="24">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id, 40)" />
                  </div>
                </Col>
              </Row>
              <Row :gutter="2">
                <Col :class="$style.imgParent" :span="24">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(2)"  v-lazy="getImg(imageObject[2].storage_id, 40)" />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="12" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(3)"  v-lazy="getImg(imageObject[3].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="12" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(4)"  v-lazy="getImg(imageObject[4].storage_id)" />
              </div>
            </Col>
          </Row>
        </div>
        <div v-if="imageSize == 6" class="images">
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="16">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 40)" />
              </div>
            </Col>
            <Col span="8" style="padding-left: 0; padding-right: 0">
              <Row :gutter="2" :calss="$style.imagesRow" style="margin-bottom: 2px;">
                <Col :class="$style.imgParent" :span="24">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id, 40)" />
                  </div>
                </Col>
              </Row>
              <Row :gutter="2" :calss="$style.imagesRow">
                <Col :class="$style.imgParent" :span="24">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(2)"  v-lazy="getImg(imageObject[1].storage_id, 40)" />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="8" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(3)"  v-lazy="getImg(imageObject[3].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(4)"  v-lazy="getImg(imageObject[4].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(5)"  v-lazy="getImg(imageObject[5].storage_id)" />
              </div>
            </Col>
          </Row>
        </div>
        <div v-if="imageSize == 7" class="images">
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :span="12">
              <Row :gutter="2" :class="$style.imagesRow">
                <Col :class="$style.imgParent" :span="24" >
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id)" />
                  </div>
                </Col>
              </Row>
              <Row :gutter="2" :class="$style.imagesRow">
                <Col :class="$style.imgParent" :span="24" >
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id)" />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col :span="12">
              <Row :gutter="2" :class="$style.imagesRow">
                <Col :class="$style.imgParent" :span="12" >
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(2)"  v-lazy="getImg(imageObject[2].storage_id)" />
                  </div>
                </Col>
                <Col :class="$style.imgParent" :span="12" >
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(3)"  v-lazy="getImg(imageObject[3].storage_id)" />
                  </div>
                </Col>
              </Row>
              <Row :gutter="2" :class="$style.imagesRow">
                <Col :class="$style.imgParent" :span="24" >
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(4)"  v-lazy="getImg(imageObject[4].storage_id)" />
                  </div>
                </Col>
              </Row>
              <Row :gutter="2" :class="$style.imagesRow">
                <Col :class="$style.imgParent" :span="12" >
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(5)"  v-lazy="getImg(imageObject[5].storage_id)" />
                  </div>
                </Col>
                <Col :class="$style.imgParent" :span="12" >
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(6)"  v-lazy="getImg(imageObject[6].storage_id)" />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div v-if="imageSize == 8" class="images">
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(2)"  v-lazy="getImg(imageObject[2].storage_id)" />
              </div>
            </Col>
          </Row>
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(3)"  v-lazy="getImg(imageObject[3].storage_id, 40)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(4)"  v-lazy="getImg(imageObject[4].storage_id, 40)" />
              </div>
            </Col>
          </Row>
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(5)"  v-lazy="getImg(imageObject[5].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(6)"  v-lazy="getImg(imageObject[6].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(7)"  v-lazy="getImg(imageObject[7].storage_id)" />
              </div>
            </Col>
          </Row>
        </div>
        <div v-if="imageSize == 9" class="images">
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(2)"  v-lazy="getImg(imageObject[2].storage_id)" />
              </div>
            </Col>
          </Row>
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(3)"  v-lazy="getImg(imageObject[3].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(4)"  v-lazy="getImg(imageObject[4].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(5)"  v-lazy="getImg(imageObject[5].storage_id)" />
              </div>
            </Col>
          </Row>
          <Row :gutter="2" :class="$style.imagesRow">
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(6)"  v-lazy="getImg(imageObject[6].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(7)"  v-lazy="getImg(imageObject[7].storage_id)" />
              </div>
            </Col>
            <Col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(8)"  v-lazy="getImg(imageObject[8].storage_id)" />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  </Row>
</template>

<script>
  import { createRequestURI } from '../utils/request';
  import { IMGSWIPER } from '../stores/types';
  import getImg from '../utils/getImage';

  const feedImages = {
    props: [
      'storages'
    ],
    data: () => ({
      imageObject: []
    }),
    computed: {
      imageSize () {
        return this.storages.length;
      }
    },
    methods: {
      // 展示走马灯
      showSwiper (index) {
        let images = [];
        this.storages.forEach((storage) => {
          images.push(this.getImg(storage.storage_id, 100));
        });
        this.$store.dispatch(IMGSWIPER, cb => {
          cb({
            list:images,
            value: index,
            show: true
          });
        });
      },
      getImg
    },
    beforeMount () {
      this.imageObject = this.storages;
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
    position: absolute;
    left: -2px;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
      position:  absolute;
      top: 0;
      left: 1px;
      bottom: 0;
      right: 0;
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
</style>
