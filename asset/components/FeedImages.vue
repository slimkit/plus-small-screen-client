<template>
  <Row>
    <i-col :span="20">
      <div :class="$style.FeedImages">
        <div v-if="imageSize == 1" class="images">
          <Row :class="$style.imagesRow">
            <i-col :span="24">
              <img @click="showSwiper(0)" :src="getImg(imageObject[0].storage_id, 60)" />
            </i-col>
          </Row>
        </div>
        <div v-if="imageSize == 2" class="images">
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(0)" :src="getImg(imageObject[0].storage_id, 40)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(1)" :src="getImg(imageObject[1].storage_id, 40)" />
              </div>
            </i-col>
          </Row>
        </div>
        <div v-if="imageSize == 3" class="images">
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(0)" :src="getImg(imageObject[0].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(1)" :src="getImg(imageObject[1].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(2)" :src="getImg(imageObject[2].storage_id)" />
              </div>
            </i-col>
          </Row>
        </div>
        <div v-if="imageSize == 4" class="images">
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(0)" :src="getImg(imageObject[0].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="12" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(1)" :src="getImg(imageObject[1].storage_id)" />
              </div>
            </i-col>
          </Row>
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="12" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(2)" :src="getImg(imageObject[2].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="12" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(3)" :src="getImg(imageObject[3].storage_id)" />
              </div>
            </i-col>
          </Row>
        </div>
        <div v-if="imageSize == 5" class="images">
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="16">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(0)" :src="getImg(imageObject[0].storage_id, 40)" />
              </div>
            </i-col>
            <i-col :span="8">
              <Row :gutter="6" style="margin-bottom: 6px;">
                <i-col :class="$style.imgParent" :span="24">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(1)" :src="getImg(imageObject[1].storage_id, 40)" />
                  </div>
                </i-col>
              </Row>
              <Row :gutter="6">
                <i-col :class="$style.imgParent" :span="24">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(2)" :src="getImg(imageObject[2].storage_id, 40)" />
                  </div>
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="12" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(3)" :src="getImg(imageObject[3].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="12" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(4)" :src="getImg(imageObject[4].storage_id)" />
              </div>
            </i-col>
          </Row>
        </div>
        <div v-if="imageSize == 6" class="images">
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="12">
              <Row :gutter="6" :calss="$style.imagesRow">
                <i-col :class="$style.imgParent" :span="24">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(0)" :src="getImg(imageObject[0].storage_id, 40)" />
                  </div>
                </i-col>
              </Row>
              <Row :gutter="6" :calss="$style.imagesRow">
                <i-col :class="$style.imgParent" :span="24">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(1)" :src="getImg(imageObject[1].storage_id, 40)" />
                  </div>
                </i-col>
              </Row>
            </i-col>
            <i-col :class="$style.imgParent" :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(2)" :src="getImg(imageObject[2].storage_id, 40)" />
              </div>
            </i-col>
          </Row>
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="8" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(3)" :src="getImg(imageObject[3].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(4)" :src="getImg(imageObject[4].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8" >
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(5)" :src="getImg(imageObject[5].storage_id)" />
              </div>
            </i-col>
          </Row>
        </div>
        <div v-if="imageSize == 7" class="images">
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="12">
              <Row :gutter="6" :calss="$style.imagesRow">
                <i-col :class="$style.imgParent" :span="24">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(0)" :src="getImg(imageObject[0].storage_id, 40)" />
                  </div>
                </i-col>
              </Row>
              <Row :gutter="6" :calss="$style.imagesRow">
                <i-col :class="$style.imgParent" :span="24">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(1)" :src="getImg(imageObject[1].storage_id, 40)" />
                  </div>
                </i-col>
              </Row>
            </i-col>
            <i-col :class="$style.imgParent" :span="12">
              <Row :gutter="6" :calss="$style.imagesRow">
                <i-col :span="12">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(2)" :src="getImg(imageObject[2].storage_id, 40)" />
                  </div>
                </i-col>
                <i-col :span="12">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(3)" :src="getImg(imageObject[3].storage_id, 40)" />
                  </div>
                </i-col>
              </Row>
              <Row :gutter="6">
                <i-col :span="12">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(4)" :src="getImg(imageObject[4].storage_id, 40)" />
                  </div>
                </i-col>
              </Row>
              <Row :gutter="6" :calss="$style.imagesRow">
                <i-col :span="12">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(5)" :src="getImg(imageObject[5].storage_id, 40)" />
                  </div>
                </i-col>
                <i-col :span="12">
                  <div :class="$style.showImgBox">
                    <img class="per-feed-img" @click="showSwiper(6)" :src="getImg(imageObject[6].storage_id, 40)" />
                  </div>
                </i-col>
              </Row>
            </i-col>
          </Row>
        </div>
        <div v-if="imageSize == 8" class="images">
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(0)" :src="getImg(imageObject[0].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(1)" :src="getImg(imageObject[1].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(2)" :src="getImg(imageObject[2].storage_id)" />
              </div>
            </i-col>
          </Row>
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(3)" :src="getImg(imageObject[3].storage_id, 40)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(4)" :src="getImg(imageObject[4].storage_id, 40)" />
              </div>
            </i-col>
          </Row>
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(5)" :src="getImg(imageObject[5].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(6)" :src="getImg(imageObject[6].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(7)" :src="getImg(imageObject[7].storage_id)" />
              </div>
            </i-col>
          </Row>
        </div>
        <div v-if="imageSize == 9" class="images">
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(0)" :src="getImg(imageObject[0].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(1)" :src="getImg(imageObject[1].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(2)" :src="getImg(imageObject[2].storage_id)" />
              </div>
            </i-col>
          </Row>
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(3)" :src="getImg(imageObject[3].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(4)" :src="getImg(imageObject[4].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(5)" :src="getImg(imageObject[5].storage_id)" />
              </div>
            </i-col>
          </Row>
          <Row :gutter="6" :class="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(6)" :src="getImg(imageObject[6].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(7)" :src="getImg(imageObject[7].storage_id)" />
              </div>
            </i-col>
            <i-col :class="$style.imgParent" :span="8">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" @click="showSwiper(8)" :src="getImg(imageObject[8].storage_id)" />
              </div>
            </i-col>
          </Row>
        </div>
      </div>
    </i-col>
  </Row>
</template>

<script>
  import { createRequestURI } from '../utils/request';
  import { IMGSWIPER } from '../stores/types';

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
      // 获取单条图片
      getImg (id, process = 30) {
        return createRequestURI(`api/v1/storages/${id}/${process}`);
      },
      // 展示走马灯
      showSwiper (index) {
        let images = [];
        this.storages.forEach((storage) => {
          images.push(this.getImg(storage.storage_id, 40));
        });
        this.$store.dispatch(IMGSWIPER, cb => {
          cb({
            list:images,
            value: index,
            show: true
          });
        });
      }
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
    left: -3px;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
      position:  absolute;
      top: 0;
      left: 6px;
      bottom: 0;
      right: 0;
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
  .imagesRow {
    margin-bottom: 6px;
  }
</style>
