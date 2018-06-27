<script>
import bus from "@/bus.js";
import FeedCard from "./FeedCard.vue";
import { collectGroupPost } from "@/api/group.js";
export default {
  name: "group-feed-card",
  extends: FeedCard,
  methods: {
    handleView() {
      this.$router.push(`/groups/${this.feed.group.id}/posts/${this.feed.id}`);
    },
    handleLike() {
      const method = this.liked ? "delete" : "post";
      const url = `/plus-group/group-posts/${this.feed.id}/likes`;
      if (this.fetching) return;
      this.fetching = true;
      this.$http({
        method,
        url,
        validataStatus: s => s === 201 || s === 204
      })
        .then(() => {
          method === "post"
            ? ((this.liked = true), (this.likeCount += 1))
            : ((this.liked = false), (this.likeCount -= 1));
          this.fetching = false;
        })
        .catch(() => {
          this.fetching = false;
        });
    },
    sendComment({ reply_user: replyUser, body }) {
      const params = {};
      if (body && body.length > 0) {
        params.body = body;
        replyUser && (params["reply_user"] = replyUser);
        this.$http
          .post(`/plus-group/group-posts/${this.feed.id}/comments`, params, {
            validataStatus: s => s === 201
          })
          .then(() => {
            this.$Message.success("评论成功");
            bus.$emit("commentInput:close", true);
          })
          .catch(() => {
            this.$Message.error("评论失败");
            bus.$emit("commentInput:close", true);
          });
      } else {
        this.$Message.error("评论内容不能为空");
      }
    },
    handleCollection() {
      collectGroupPost(this.feed.id, this.has_collect).then(() => {
        this.$Message.success("操作成功");
        this.has_collect = !this.has_collect;
      });
    },
    handleMore() {
      const base = [
        {
          text: this.has_collect ? "取消收藏" : "收藏",
          method: () => {
            this.handleCollection();
          }
        }
      ];
      bus.$emit("actionSheet", [...base], "取消");
    }
  },
  computed: {
    liked: {
      get() {
        return !!this.feed.liked;
      },
      set(val) {
        this.feed.liked = val;
      }
    },
    commentCount: {
      get() {
        return this.feed.comments_count || 0;
      },
      set(val) {
        this.feed.comments_count = ~~val;
      }
    },
    likeCount: {
      get() {
        return this.feed.likes_count || 0;
      },
      set(val) {
        this.feed.likes_count = ~~val;
      }
    },
    body() {
      return this.feed.summary || "";
    },
    images() {
      let images = [];
      this.feed.images.map(image => {
        image.file = image.id;
        images = [...images, image];
      });

      return images || [];
    },
    has_collect: {
      get() {
        return this.feed.collected || 0;
      },
      set(val) {
        this.feed.collected = val;
      }
    },
    viewCount() {
      return this.feed.views_count || 0;
    }
  }
};
</script>
