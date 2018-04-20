<template>
  <div
    @click.stop
    class="feed-video"
  >
    <video
      controls
      :poster="cover_file" 
      :ref="`video_${id}`"
    >
       <source 
        :src="video_file" 
        type="video/mp4"
      >
       Your browser does not support the video tag.
    </video> 
  </div>
</template>
<script>
export default {
  name: "feedVideo",
  data: () => ({
    videoFile: "",
    coverFile: "",
    play: false,
    ratio: 1
  }),
  props: {
    video: {
      type: Object,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    height() {
      return this.video.width < this.video.height
        ? 5.18
        : parseInt(this.video.height * this.ratio) / 100;
    },
    video_file() {
      return `/api/v2/files/${this.video.video_id}`;
    },
    cover_file() {
      return `/api/v2/files/${this.video.cover_id}`;
    }
  },
  methods: {
    getVideoUrl() {
      this.$http
        .get(`/files/${this.video.video_id}?json=1`, {
          validateStatus: s => s === 200
        })
        .then(({ data: { url = "" } = {} } = {}) => {
          this.videoFile = url;
        });
    },
    getCoverUrl() {
      this.$http
        .get(`/files/${this.video.cover_id}?json=1`, {
          validateStatus: s => s === 200
        })
        .then(({ data: { url = "" } = {} } = {}) => {
          this.coverFile = url;
        });
    }
  },
  created() {
    this.ratio = 518 / this.video.width;
    this.getVideoUrl();
    this.getCoverUrl();
  }
};
</script>
<style lang="less">
.feed-video {
  overflow: hidden;
  width: 518px;
  height: 518px;
  video {
    background-color: #000;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: block;
    margin: auto;
  }
}
</style>
