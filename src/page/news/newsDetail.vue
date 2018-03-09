<template>
  <div class="news-detail">
    <head-top ref='head' :go-back='true' title='资讯详情'></head-top>
    <load-more
    ref='loadmore'
    :onRefresh='onRefresh'
    class="news-detail--body">
    <div class="head">
      <h1 class="title">{{ news.title }}</h1>
      <p><i class="news-cate">{{ cate }}</i> 来自 {{ news.from || '原创' }}</p>
    </div>
    <div class="subject">{{ news.subject }}</div>
    <div class="content" v-html='content'></div>
    <div class="foot">
      <div class="foot-left">
        <ul class="likes-list">
          <li
          v-for='(like,index) in likes.slice(0,5)'
          v-if='like.id'
          :key="index"
          :style='{zIndex: 5-index, position: "relative"}'
          ><v-avatar :sex='like.user.sex' :src='like.user.avatar' size='small'></v-avatar></li>
        </ul>
        <span v-if='likes.length > 0'>{{ likes.length | formatNum }}人点赞</span>
      </div>
      <div class="foot-right">
        <span>发布于{{ time | time2tips }}</span><br>
        <span>{{ news.hits || 0 | formatNum }}浏览</span>
      </div>
    </div>
    <section class="m-panel bt10 bdcf4f5f6">
      <h3><span>相关资讯</span></h3>
      <div class="rec-news-list">
        <news-item
        v-for='item in recs'
        v-if='item.id'
        :key='item.id'
        :news='item' />
      </div>
    </section>
    <section class="m-panel bt10 bdcf4f5f6">
      <h3><span>评论</span></h3>
      <div class="comments">
        <comment-item
        v-for='item in pinneds'
        v-if='item.id'
        :key='item.id'
        :pinned='true'
        :comment='item'/>
        <comment-item
        v-for='item in comments'
        v-if='item.id'
        :key='item.id'
        :comment='item'/>
      </div>
    </section>
    </load-more>
    <news-tool-bar
    :liked='liked'
    @handleLike='handleLike'
    @handleMore='handleMore'
    @handleShare='handleShare'
    @handleComment='handleComment'
    ref='foot' />
  </div>
</template>
<script>
import HeadRoom from "headroom.js";
import newsItem from "./components/newsItem.vue";
import newsToolBar from "./components/newsToolBar.vue";
import commentItem from "./components/commentItem.vue";
import md from "../../util/markdown";

export default {
  name: "news-detail",
  components: {
    newsItem,
    newsToolBar,
    commentItem
  },
  data() {
    return {
      preID: 0,
      news: {},
      recs: [],
      likes: [],
      pinneds: [],
      comments: [],
      headroom: null,
      footroom: null
    };
  },
  watch: {
    newsID(val) {
      if (val && val !== this.preID) {
        this.$refs.loadmore.beforeRefresh();
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    }
  },
  computed: {
    liked: {
      get() {
        return this.news.has_like || false;
      },
      set(val) {
        this.news.has_like = val;
      }
    },
    time() {
      return this.news.created_at || "";
    },
    cate() {
      const { category: { name = "未分类" } = {} } = this.news;
      return name;
    },
    digg_count() {
      return this.news.digg_count || 0;
    },
    created_at() {
      return this.news.created_at;
    },
    content() {
      return md.render(this.news.content || "");
    },
    newsID() {
      return ~~this.$route.params.newsID;
    }
  },
  activated() {},
  methods: {
    onRefresh() {
      this.preID = this.newsID;
      this.$http.get(`/news/${this.preID}`).then(({ data = {} }) => {
        this.news = data;
        this.$refs.loadmore.topEnd(false);
      });
      this.$http
        .get(`/news/${this.preID}/comments`)
        .then(({ data: { comments = [], pinneds = [] } = {} }) => {
          this.comments = comments || [];
          this.pinneds = pinneds || [];
        });
      // GET /news/{news}/likes
      this.$http.get(`/news/${this.preID}/likes`).then(({ data = [] }) => {
        this.likes = data || [];
      });

      // /news/{news}/correlations
      this.$http
        .get(`/news/${this.preID}/correlations`)
        .then(({ data = [] } = {}) => {
          this.recs = data;
        });
    },
    handleLike() {
      const method = this.liked ? "delete" : "post";
      this.$http({
        method,
        url: `/news/${this.preID}/likes`,
        validateStatus: s => s === 201
      }).then(() => {
        this.liked = !this.liked;
      });
    },
    handleComment({ placeholder, reply_user: replyUser } = {}) {
      this.$Modal.commentInpt({
        placeholder,
        onOk: val => {
          this.$http
            .post(`/news/${this.preID}/comments`, {
              params: {
                body: val,
                reply_user: replyUser
              },
              validateStatus: s => s === 201
            })
            .then(
              ({
                data: { comment = {}, message = { message: "评论成功" } } = {}
              }) => {
                if (comment && comment.id) {
                  this.$Modal.remove();
                  this.comments.push(comment);
                  this.$Message.success(message);
                }
              }
            );
        }
      });
    },
    handleShare() {},
    handleMore() {}
  },
  mounted() {
    this.headroom = new HeadRoom(this.$refs.head.$el, {
      tolerance: 5,
      offset: 50,
      classes: {
        initial: "headroom-head",
        pinned: "headroom--headShow",
        unpinned: "headroom--headHide"
      }
    });
    this.footroom = new HeadRoom(this.$refs.foot.$el, {
      tolerance: 5,
      offset: 50,
      classes: {
        initial: "headroom-foot",
        pinned: "headroom--footShow",
        unpinned: "headroom--footHide"
      }
    });
    this.headroom.init();
    this.footroom.init();
  }
};
</script>
<style lang="less" src='./style/newsDetail.less'>
</style>
