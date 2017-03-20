<template>
  <div :class="$style.FeedImages">
    <div v-if="imageSize == 1" class="images">
      <Row :class="$style.imagesRow">
        <i-col :span="24">
          <img :src="getImg(imageObject[0].storage_id, 60)" v-lazyload:opt.fadein="img"/>
        </i-col>
      </Row>
    </div>
    <div v-if="imageSize == 2" class="images">
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="12">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[0].storage_id, 40)" v-lazyload:opt.fadein="img">
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="12">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[1].storage_id, 40)" v-lazyload:opt.fadein="img">
          </div>
        </i-col>
      </Row>
    </div>
    <div v-if="imageSize == 3" class="images">
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[0].storage_id)" v-lazyload:opt.fadein="img" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8" >
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[1].storage_id)" v-lazyload:opt.fadein="img" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[2].storage_id)" v-lazyload:opt.fadein="img" />
          </div>
        </i-col>
      </Row>
    </div>
    <div v-if="imageSize == 4" class="images">
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="12">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[0].storage_id)" v-lazyload:opt.fadein="img" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="12" >
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[1].storage_id)" v-lazyload:opt.fadein="img" />
          </div>
        </i-col>
      </Row>
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="12" >
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[2].storage_id)" v-lazyload:opt.fadein="img" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="12" >
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[3].storage_id)" v-lazyload:opt.fadein="img" />
          </div>
        </i-col>
      </Row>
    </div>
    <div v-if="imageSize == 5" class="images">
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="16">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[0].storage_id, 40)" />
          </div>
        </i-col>
        <i-col :span="8">
          <Row :gutter="6" style="margin-bottom: 6px;">
            <i-col :class="$style.imgParent" :span="24">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[1].storage_id, 40)" />
              </div>
            </i-col>
          </Row>
          <Row :gutter="6">
            <i-col :class="$style.imgParent" :span="24">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[2].storage_id, 40)" />
              </div>
            </i-col>
          </Row>
        </i-col>
      </Row>
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="12" >
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[3].storage_id)" v-lazyload:opt.fadein="img" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="12" >
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[4].storage_id)" v-lazyload:opt.fadein="img" />
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
                <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[0].storage_id, 40)" />
              </div>
            </i-col>
          </Row>
          <Row :gutter="6" :calss="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="24">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[1].storage_id, 40)" />
              </div>
            </i-col>
          </Row>
        </i-col>
        <i-col :class="$style.imgParent" :span="12">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[2].storage_id, 40)" />
          </div>
        </i-col>
      </Row>
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="8" >
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[3].storage_id)" v-lazyload:opt.fadein="img" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8" >
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[4].storage_id)" v-lazyload:opt.fadein="img" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8" >
          <div :class="$style.showImgBox">
            <img class="per-feed-img" :src="getImg(imageObject[5].storage_id)" v-lazyload:opt.fadein="img" />
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
                <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[0].storage_id, 40)" />
              </div>
            </i-col>
          </Row>
          <Row :gutter="6" :calss="$style.imagesRow">
            <i-col :class="$style.imgParent" :span="24">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[1].storage_id, 40)" />
              </div>
            </i-col>
          </Row>
        </i-col>
        <i-col :class="$style.imgParent" :span="12">
          <Row :gutter="6" :calss="$style.imagesRow">
            <i-col :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[2].storage_id, 40)" />
              </div>
            </i-col>
            <i-col :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[3].storage_id, 40)" />
              </div>
            </i-col>
          </Row>
          <Row :gutter="6">
            <i-col :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[4].storage_id, 40)" />
              </div>
            </i-col>
          </Row>
          <Row :gutter="6" :calss="$style.imagesRow">
            <i-col :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[5].storage_id, 40)" />
              </div>
            </i-col>
            <i-col :span="12">
              <div :class="$style.showImgBox">
                <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[6].storage_id, 40)" />
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
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[0].storage_id)" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[1].storage_id)" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[2].storage_id)" />
          </div>
        </i-col>
      </Row>
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="12">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[3].storage_id, 40)" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="12">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[4].storage_id, 40)" />
          </div>
        </i-col>
      </Row>
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[5].storage_id)" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[6].storage_id)" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[7].storage_id)" />
          </div>
        </i-col>
      </Row>
    </div>
    <div v-if="imageSize == 9" class="images">
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[0].storage_id)" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[1].storage_id)" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[2].storage_id)" />
          </div>
        </i-col>
      </Row>
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[3].storage_id)" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[4].storage_id)" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[5].storage_id)" />
          </div>
        </i-col>
      </Row>
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[6].storage_id)" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[7].storage_id)" />
          </div>
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <div :class="$style.showImgBox">
            <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[8].storage_id)" />
          </div>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
  import { createRequestURI } from '../utils/request';

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
      getImg (id, process = 30) {
        return createRequestURI(`api/v1/storages/${id}/${process}`);
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
