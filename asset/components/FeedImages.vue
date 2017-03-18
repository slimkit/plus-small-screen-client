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
          <img class="per-feed-img" :src="getImg(imageObject[0].storage_id, 40)" v-lazyload:opt.fadein="img">
        </i-col>
        <i-col :class="$style.imgParent" :span="12">
          <img class="per-feed-img" :src="getImg(imageObject[1].storage_id, 40)" v-lazyload:opt.fadein="img">
        </i-col>
      </Row>
    </div>
    <div v-if="imageSize == 3" class="images">
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" :src="getImg(imageObject[0].storage_id)" v-lazyload:opt.fadein="img" />
        </i-col>
        <i-col :class="$style.imgParent" :span="8" >
          <img class="per-feed-img" :src="getImg(imageObject[1].storage_id)" v-lazyload:opt.fadein="img" />
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" :src="getImg(imageObject[2].storage_id)" v-lazyload:opt.fadein="img" />
        </i-col>
      </Row>
    </div>
    <div v-if="imageSize == 4" class="images">
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="12">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[0].storage_id)" v-lazyload:opt.fadein="img" />
        </i-col>
        <i-col :class="$style.imgParent" :span="12" >
          <img class="per-feed-img" :src="getImg(imageObject[1].storage_id)" v-lazyload:opt.fadein="img" />
        </i-col>
      </Row>
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="12" >
          <img class="per-feed-img" :src="getImg(imageObject[2].storage_id)" v-lazyload:opt.fadein="img" />
        </i-col>
        <i-col :class="$style.imgParent" :span="12" >
          <img class="per-feed-img" :src="getImg(imageObject[3].storage_id)" v-lazyload:opt.fadein="img" />
        </i-col>
      </Row>
    </div>
    <Row v-if="imageSize == 5" :class="$style.imagesRow">
      5张图片
    </Row>
    <Row v-if="imageSize == 6">
      6张图片
    </Row>
    <Row v-if="imageSize == 7">
      7张图片
    </Row>
    <div v-if="imageSize == 8" class="images">
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[0].storage_id)" />
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[1].storage_id)" />
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[2].storage_id)" />
        </i-col>
      </Row>
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="12">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[3].storage_id, 40)" />
        </i-col>
        <i-col :class="$style.imgParent" :span="12">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[4].storage_id, 40)" />
        </i-col>
      </Row>
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[5].storage_id)" />
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[6].storage_id)" />
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[7].storage_id)" />
        </i-col>
      </Row>
    </div>
    <div v-if="imageSize == 9" class="images">
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[0].storage_id)" />
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[1].storage_id)" />
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[2].storage_id)" />
        </i-col>
      </Row>
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[3].storage_id)" />
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[4].storage_id)" />
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[5].storage_id)" />
        </i-col>
      </Row>
      <Row :gutter="6" :class="$style.imagesRow">
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[6].storage_id)" />
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[7].storage_id)" />
        </i-col>
        <i-col :class="$style.imgParent" :span="8">
          <img class="per-feed-img" v-lazyload:opt.fadein="img" :src="getImg(imageObject[8].storage_id)" />
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
  .imagesRow {
    margin-bottom: 6px;
  }
</style>

<style lang="css">
  img.per-feed-img {
    position:  absolute;
    top: 0;
    left: 6px;
    bottom: 0;
    right: 0;
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
</style>
