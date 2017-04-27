<template>
  <div style="width: 70vw; position: relative; margin-bottom: 8px;">
    <img style="width: 100%;" v-if="imageSize == 1" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 60)" />
    <div style="width: 100%; display: flex;" v-if="imageSize == 2">
      <div style="width: 35vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 30)" />
      </div>
      <div style="width: 35vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id, 30)" />
      </div>
    </div>
    <div style="width: 100%; display: flex;" v-if="imageSize == 3">
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(2)"  v-lazy="getImg(imageObject[2].storage_id, 30)" />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 4">
      <div style="width: 35vw" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 30)" />
      </div>
      <div style="width: 35vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id, 30)" />
      </div>
      <div style="width: 35vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(2)"  v-lazy="getImg(imageObject[2].storage_id, 30)" />
      </div>
      <div style="width: 35vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(3)"  v-lazy="getImg(imageObject[3].storage_id, 30)" />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 5">
      <div style="width: 66.6666%" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%">
        <div style="width: 100%; padding-bottom: 2px;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id, 30)" />
        </div>
        <div style="width: 100% padding-bottom: 2px;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click="showSwiper(2)"  v-lazy="getImg(imageObject[2].storage_id, 30)" />
        </div>
      </div>
      <div style="width: 35vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(3)"  v-lazy="getImg(imageObject[3].storage_id, 30)" />
      </div>
      <div style="width: 35vw;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(4)"  v-lazy="getImg(imageObject[4].storage_id, 30)" />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 6">
      <div style="width: 66.6666%" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%">
        <div style="width: 100%; padding-bottom: 2px;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id, 30)" />
        </div>
        <div style="width: 100% padding-bottom: 2px;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click="showSwiper(2)"  v-lazy="getImg(imageObject[2].storage_id, 30)" />
        </div>
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(3)"  v-lazy="getImg(imageObject[3].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(4)"  v-lazy="getImg(imageObject[4].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(5)"  v-lazy="getImg(imageObject[5].storage_id, 30)" />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 7">
      <div style="width: 35vw">
        <div style="width: 100%" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 30)" />
        </div>
        <div style="width: 100%" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click="showSwiper(3)"  v-lazy="getImg(imageObject[3].storage_id, 30)" />
        </div>
      </div>
      <div style="width: 35vw; display: flex; flex-wrap: wrap;">
        <div style="width: 50%; padding-bottom: 2px;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id, 30)" />
        </div>
        <div style="width: 50%; padding-bottom: 2px;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click="showSwiper(2)"  v-lazy="getImg(imageObject[2].storage_id, 30)" />
        </div>
        <div style="width: 100%;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click="showSwiper(4)"  v-lazy="getImg(imageObject[4].storage_id, 30)" />
        </div>
        <div style="width: 50%;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click="showSwiper(5)"  v-lazy="getImg(imageObject[5].storage_id, 30)" />
        </div>
        <div style="width: 50%;" :class="$style.showImgBox">
          <img :class="$style.perFeedImg" @click="showSwiper(6)"  v-lazy="getImg(imageObject[6].storage_id, 30)" />
        </div>
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 8">
      <div style="width: 33.3333%" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%; padding-bottom: 2px;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%; padding-bottom: 2px;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(2)"  v-lazy="getImg(imageObject[2].storage_id, 30)" />
      </div>
      <div style="width: 50%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(3)"  v-lazy="getImg(imageObject[3].storage_id, 30)" />
      </div>
      <div style="width: 50%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(4)"  v-lazy="getImg(imageObject[4].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(5)"  v-lazy="getImg(imageObject[5].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(6)"  v-lazy="getImg(imageObject[6].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(7)"  v-lazy="getImg(imageObject[7].storage_id, 30)" />
      </div>
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;" v-if="imageSize == 9">
      <div style="width: 33.3333%" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(0)"  v-lazy="getImg(imageObject[0].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%; padding-bottom: 2px;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(1)"  v-lazy="getImg(imageObject[1].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%; padding-bottom: 2px;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(2)"  v-lazy="getImg(imageObject[2].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(3)"  v-lazy="getImg(imageObject[3].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(4)"  v-lazy="getImg(imageObject[4].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(5)"  v-lazy="getImg(imageObject[5].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(6)"  v-lazy="getImg(imageObject[6].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(7)"  v-lazy="getImg(imageObject[7].storage_id, 30)" />
      </div>
      <div style="width: 33.3333%;" :class="$style.showImgBox">
        <img :class="$style.perFeedImg" @click="showSwiper(8)"  v-lazy="getImg(imageObject[8].storage_id, 30)" />
      </div>
    </div>
  </div>
  <!-- <Row>
    <Col :span="20">
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
  </Row> -->
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
