<template>
  <div :class="FeedImages">
    <div v-if="imageSize == 1" class="images">
      <Row>
        <i-col :span="24">
          <img :src="getImg(imageObject[0].storage_id)" />
        </i-col>
      </Row>
    </div>
    <div v-if="imageSize == 2" class="images">
      <Row>
        <i-col :span="11">
          <img :src="getImg(imageObject[0].storage_id)" />
        </i-col>
        <i-col :span="11" offset="2">
          <img :src="getImg(imageObject[1].storage_id)" />
        </i-col>
      </Row>
    </div>
    <div v-if="imageSize == 3" class="images">
      <Row>
        <i-col :span="7">
          <img :src="getImg(imageObject[0].storage_id)" />
        </i-col>
        <i-col :span="7" offset="1">
          <img :src="getImg(imageObject[1].storage_id)" />
        </i-col>
        <i-col :span="7" offset="1">
          <img :src="getImg(imageObject[2].storage_id)" />
        </i-col>
      </Row>
    </div>
    <div v-if="imageSize == 4" class="images">
      <Row>
        <i-col :span="11">
          <img :src="getImg(imageObject[0].storage_id)" />
        </i-col>
        <i-col :span="11" offset="2">
          <img :src="getImg(imageObject[1].storage_id)" />
        </i-col>
      </Row>
      <Row>
        <i-col :span="11">
          <img :src="getImg(imageObject[2].storage_id)" />
        </i-col>
        <i-col :span="11" offset="2">
          <img :src="getImg(imageObject[3].storage_id)" />
        </i-col>
      </Row>
    </div>
    <Row v-if="imageSize == 5">
      5张图片
    </Row>
    <Row v-if="imageSize == 6">
      6张图片
    </Row>
    <Row v-if="imageSize == 7">
      7张图片
    </Row>
    <div v-if="imageSize == 8" class="images">
      <Row>
        <i-col :span="7">
          <img :src="getImg(imageObject[0].storage_id)" />
        </i-col>
        <i-col :span="7" offset="1">
          <img :src="getImg(imageObject[1].storage_id)" />
        </i-col>
        <i-col :span="7" offset="1">
          <img :src="getImg(imageObject[2].storage_id)" />
        </i-col>
      </Row>
      <Row>
        <i-col :span="11">
          <img :src="getImg(imageObject[3].storage_id)" />
        </i-col>
        <i-col :span="11" offset="2">
          <img :src="getImg(imageObject[4].storage_id)" />
        </i-col>
      </Row>
      <Row>
        <i-col :span="7">
          <img :src="getImg(imageObject[5].storage_id)" />
        </i-col>
        <i-col :span="7" offset="1">
          <img :src="getImg(imageObject[6].storage_id)" />
        </i-col>
        <i-col :span="7" offset="1">
          <img :src="getImg(imageObject[7].storage_id)" />
        </i-col>
      </Row>
    </div>
    <div v-if="imageSize == 9" class="images">
      <Row>
        <i-col :span="7">
          <img :src="getImg(imageObject[0].storage_id)" />
        </i-col>
        <i-col :span="7" offset="1">
          <img :src="getImg(imageObject[1].storage_id)" />
        </i-col>
        <i-col :span="7" offset="1">
          <img :src="getImg(imageObject[2].storage_id)" />
        </i-col>
      </Row>
      <Row>
        <i-col :span="7">
          <img :src="getImg(imageObject[3].storage_id)" />
        </i-col>
        <i-col :span="7" offset="1">
          <img :src="getImg(imageObject[4].storage_id)" />
        </i-col>
        <i-col :span="7" offset="1">
          <img :src="getImg(imageObject[5].storage_id)" />
        </i-col>
      </Row>
      <Row>
        <i-col :span="7">
          <img :src="getImg(imageObject[6].storage_id)" />
        </i-col>
        <i-col :span="7" offset="1">
          <img :src="getImg(imageObject[7].storage_id)" />
        </i-col>
        <i-col :span="7" offset="1">
          <img :src="getImg(imageObject[8].storage_id)" />
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
      getImg (id, process = 50) {
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
  }
</style>