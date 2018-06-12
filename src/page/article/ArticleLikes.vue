<template>
  <div class="m-art-likes">
    <header class="m-pos-r" style="padding-top: 0.9rem">
      <div class="m-pos-f m-box m-justify-bet m-aln-center m-head-top m-bb1 m-main">
        <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
          <svg class='m-style-svg m-svg-def' @click='goBack'>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
          </svg>
        </div>
        <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">点赞列表</div>
        <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end"></div>
      </div>
    </header>
    <main>
      <jo-load-more
      ref="loadmore"
      :autoLoad="false"
      @onRefresh="onRefresh"
      @onLoadMore="onLoadMore">
        <user-item v-for="({ user, id }, index) in likes" :key="`likes-${id}-${user.id}-${index}`" :user="user" />
      </jo-load-more>
    </main>
  </div>
</template>
<script>
import UserItem from "@/components/UserItem.vue";
export default {
  name: "likes",
  components: {
    UserItem
  },
  data() {
    return {
      likes: [],
      maxId: 0
    };
  },
  computed: {
    type() {
      return this.$route.meta.type;
    },
    article() {
      return this.$route.params.article;
    },
    url() {
      // 动态  GET /feeds/:feed/likes
      // 资讯  GET /news/:news/likes
      // 帖子  GET /plus-group/group-posts/:post/likes

      switch (this.type) {
        case "feed":
          return `/feeds/${this.article}/likes`;
        case "news":
          return `/news/${this.article}/likes`;
        case "post":
          return `/plus-group/group-posts/${this.article}/likes`;
      }
    }
  },
  methods: {
    goBack() {
      window.history.length <= 1
        ? this.$router.push(`/feeds/${this.article}`)
        : this.$router.go(-1);
    },
    onRefresh(callback) {
      //  名称    类型       描述
      //  limit   Integer   获取条数，默认 20
      //  after   Integer   id 获取之后数据，默认 0
      this.$http
        .get(this.url, {
          params: {
            limit: 15
          }
        })
        .then(({ data = [] }) => {
          this.likes = data;
          data.length > 0 && (this.maxId = data[data.length - 1].id);
          callback(data.length < 15);
        });
    },
    onLoadMore(callback) {
      this.$http
        .get(this.url, {
          params: {
            limit: 15,
            after: this.maxId
          }
        })
        .then(({ data = [] }) => {
          this.likes = [...this.likes, ...data];
          data.length > 0 && (this.maxId = data[data.length - 1].id);
          callback(data.length < 15);
        });
    }
  },
  mounted() {
    this.$refs.loadmore.beforeRefresh();
  }
};
</script>
