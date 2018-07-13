<template>
  <a
    :href="ad.data.link"
    class="news-card">
    <section class="body">
      <h2>{{ ad.data.title }}</h2>
      <p>
        <i class="news-cate">广告</i>
        <span>{{ ad.data.time | formatDate('MM-dd') }}</span>
      </p>
    </section>
    <div
      v-if="ad.data.image"
      class="poster">
      <img :src="ad.data.image">
    </div>
  </a>
</template>

<script>
import NewsCard from "./NewsCard.vue";

export default {
  name: "AdCard",
  extends: NewsCard,
  props: {
    ad: { type: Object, required: true }
  },
  methods: {
    formatData() {} // please keep it exist because it extended NewsCard.vue and mounted this method.
  }
};
</script>
