<template>
  <div class="m-box-model m-card">
    <div class="m-box">
      <div 
      v-if="timeLine" 
      v-html="timeLineText"
      class="m-box-model m-aln-center m-flex-grow0 m-flex-shrink0 m-card-time-line" 
      ></div>
      <avatar v-else :user='user' />
      <section class="m-box-model m-flex-grow1 m-flex-shrink1 m-card-main">
        <header class="m-box m-aln-center m-justify-bet m-card-usr" v-if="!timeLine">
          <h4 class="m-flex-grow1 m-flex-shrink1">{{ user.name }}</h4>
          <div class="m-box m-aln-center">
            <span>{{ time | time2tips }}</span>
          </div>
        </header>
        <article class="m-card-body" @click="handleView">
          <h2 v-if="title">{{ title }}</h2>
          <div class="m-card-con" v-if="body.length > 0">
            <p
            class="m-text-box m-text-cut-3"
            v-html="replaceURI(body)"></p>
          </div>
          <feed-image
            v-if="images.length > 0"
            :id="feedID"
            :pics="images" />
          <feed-video
            v-if="video"
            :id="feedID"
            :video="video"
          />
       </article>
     </section>
   </div>
   <footer class="m-box-model m-card-foot m-bt1">
   </footer>
  </div>
</template>
<script>
import { time2txt } from "@/filters.js";
import FeedImage from "@/components/FeedCard/FeedImage.vue";
import FeedVideo from "@/components/FeedCard/FeedVideo.vue";
export default {
  name: "profile-collection-feeds-item",
  components: {
    FeedImage,
    FeedVideo
  },
  props: {
    feed: {
      required: Object
    },
    timeLine: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    feedID() {
      return this.feed.id;
    },
    likeCount: {
      get() {
        return this.feed.like_count || 0;
      },
      set(val) {
        this.feed.like_count = ~~val;
      }
    },
    commentCount: {
      get() {
        return this.feed.feed_comment_count || 0;
      },
      set(val) {
        val > 0, (this.feed.feed_comment_count = val);
      }
    },
    viewCount() {
      return this.feed.feed_view_count || 0;
    },
    time() {
      return this.feed.created_at || "";
    },
    user() {
      const user = this.feed.user;
      return user && user.id ? user : {};
    },
    images() {
      return this.feed.images || [];
    },
    video() {
      return this.feed.video || false;
    },
    body() {
      return this.feed.feed_content || "";
    },
    timeLineText() {
      const text = time2txt(this.time);
      const len = text.length;
      return len > 4
        ? `<span>${text.substr(0, len - 2)}</span><span>${text.substr(
            -2,
            2
          )}</span>`
        : `<span>${text}</span>`;
    },
    title() {
      return this.feed.title || "";
    }
  },
  methods: {
    handleView() {
      this.$router.push(`/feeds/${this.feedID}`);
    },
    replaceURI(str) {
      const reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
      return str
        ? str.replace(
            reg,
            link =>
              `<a class="m-art-links" href="${link}" onclick='event.stopPropagation()' target="__blank">#网页链接#</a>`
          )
        : "";
    }
  }
};
</script>
<style>
</style>
