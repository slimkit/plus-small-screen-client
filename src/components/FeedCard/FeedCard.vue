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
            <span v-if="pinned" class="m-art-comment-icon-top">置顶</span>
            <span>{{ time | time2tips }}</span>
          </div>
        </header>
        <article class="m-text-box m-card-body" @click="handelView">
          <p class="m-text-box m-box m-card-con" v-if="body.length > 0">
            <span v-html="replaceURI(body)"></span>
            <span class="m-text-shadow" v-if="needPay"> 付费节点，购买后方可查看原文详情</span></p>
          <feed-image
            v-if="images.length > 0"
            :id="feedID"
            :pics="images" />
       </article>
     </section>
   </div>
   <footer class="m-box-model m-card-foot m-bt1">
     <div class="m-box m-aln-center m-card-tools m-lim-width">
      <a class="m-box m-aln-center" @click.prevent="handelLike">
        <svg class='m-style-svg m-svg-def'>
          <use :xlink:href="liked ? '#feed-like' :'#feed-unlike'"></use>
        </svg>
        <span>{{ likeCount | formatNum }}</span>
      </a>
      <a class="m-box m-aln-center"  @click.prevent="handelComment">
        <svg class='m-style-svg m-svg-def'>
          <use xlink:href="#feed-comment"></use>
        </svg>
        <span>{{ commentCount | formatNum }}</span>
      </a>
      <a class="m-box m-aln-center" @click.prevent="handelView">
        <svg class='m-style-svg m-svg-def'>
          <use xlink:href="#feed-eye"></use>
        </svg>
        <span>{{ viewCount | formatNum }}</span>
      </a>
      <div class="m-box m-justify-end m-flex-grow1 m-flex-shrink1">
        <a class="m-box m-aln-center" @click.prevent="handelMore">
          <svg class='m-style-svg m-svg-def'>
            <use xlink:href="#feed-more"></use>
          </svg>
        </a>
      </div>
     </div>
    <ul v-if="commentCount > 0" class="m-card-comments">
      <li
      v-for="com in comments"
      v-if="com.id"
      :key="com.id">
        <comment-item :comment="com" @on-click="commentAction"/>
      </li>
    </ul>
   </footer>
  </div>
</template>
<script>
import bus from "@/bus.js";
import { time2txt } from "@/filters.js";
import FeedImage from "@/components/FeedCard/FeedImage.vue";
import CommentItem from "@/components/FeedCard/CommentItem.vue";
export default {
  name: "feed-card",
  components: {
    FeedImage,
    CommentItem
  },
  props: {
    timeLine: {
      type: Boolean,
      default: false
    },
    pinned: {
      type: Boolean,
      default: false
    },
    feed: {
      required: true
    }
  },
  computed: {
    feedID() {
      return this.feed.id;
    },
    comments() {
      return this.feed.comments.slice(0, 5);
    },
    liked: {
      get() {
        return !!this.feed.has_like;
      },
      set(val) {
        this.feed.has_like = val;
      }
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
    needPay() {
      const { paid_node } = this.feed;
      return paid_node && !paid_node.paid;
    },
    images() {
      return this.feed.images || [];
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
    }
  },
  methods: {
    replaceURI(str) {
      const reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
      return str
        ? str.replace(
            reg,
            link =>
              `<a class="m-art-links" href="${link}" target="__blank"> ##网页链接## </a>`
          )
        : "";
    },
    handelView() {
      const { paid_node } = this.feed;
      paid_node && !paid_node.paid
        ? bus.$emit("payfor", {
            onCancel: () => {},
            onSuccess: data => {
              this.$Message.success(data);
              this.$router.push(`/feed/${this.feedID}`);
            },
            node: paid_node.node,
            amount: paid_node.amount
          })
        : this.$router.push(`/feed/${this.feedID}`);
    },
    handelLike() {
      const method = this.liked ? "delete" : "post";
      const url = this.liked
        ? `/feeds/${this.feedID}/unlike`
        : `/feeds/${this.feedID}/like`;
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
    handelComment({ placeholder, reply_user }) {
      bus.$emit("commentInput", {
        placeholder,
        onOk: text => {
          this.sendComment({ body: text, reply_user });
        }
      });
    },
    handelMore() {
      const actions = [
        {
          text: "收藏",
          method: () => {
            console.log("收藏");
          }
        },
        {
          text: "举报",
          method: () => {
            console.log("举报");
          }
        }
      ];
      bus.$emit("actionSheet", actions, "取消");
    },
    commentAction({ isMine = false, placeholder, reply_user }) {
      isMine
        ? bus.$emit("actionSheet", [
            {
              text: "申请评论置顶",
              method: () => {
                console.log("申请评论置顶");
              }
            },
            {
              text: "删除评论",
              method: () => {
                console.log("删除评论");
              }
            }
          ])
        : this.handelComment({
            placeholder,
            reply_user
          });
    },
    sendComment({ reply_user: replyUser, body }) {
      const params = {};
      if (body && body.length > 0) {
        params.body = body;
        replyUser && (params["reply_user"] = replyUser);
        this.$http
          .post(`/feeds/${this.feedID}/comments`, params, {
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
    }
  },
  mounted() {
    this.user && this.$store.commit("SAVE_USER", this.user);
    this.$el.querySelectorAll(".m-art-links").forEach(node => {
      node.addEventListener("click", e => {
        e.stopPropagation();
      });
    });
  }
};
</script>

<style lang="less">
.m-card {
  padding: 30px 20px 0;
  box-sizing: border-box;
  background-color: #fff;
  border-top: 1px solid @border-color;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /*no*/
  &:first-child {
    margin-top: -1px; /*no*/
  }
  &-time-line {
    width: 60px;
    font-size: 24px;
    text-align: center;
    span:last-child {
      order: -1;
      font-size: 44px;
    }
  }
  &-usr {
    font-size: 24px;
    color: #ccc;
    margin-bottom: 30px;
    h4 {
      color: #000;
      font-size: 26px;
    }
    span + span {
      margin-left: 15px;
    }
  }
  &-main {
    margin-left: 20px;
  }
  &-con {
    overflow: hidden;
    font-size: 30px;
    line-height: 42px;
    color: @text-color2;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: -o-ellipsis-lastline;
    max-height: 43 * 3px;
    margin-bottom: 20px;
    .m-text-shadow {
      text-shadow: 0 0 10px @text-color2;
      color: rgba(255, 255, 255, 0);
      // filter: DXImageTransform.Microsoft.Blur(pixelradius=2);
      zoom: 1;
      pause-before: 3s;
    }
  }
  &-foot {
    margin-top: 20px;
    margin-left: -20px;
    margin-right: -20px;
    padding: 0 20px 0 120px;
  }
  &-tools {
    padding: 30px 0;
    color: #b3b3b3;
    font-size: 24px;
    a {
      color: inherit;
      + a {
        margin-left: 60px;
      }
    }
    span {
      margin-left: 10px;
    }
  }
  &-comments {
    margin-bottom: 30px;
    line-height: 42px;
    color: @text-color3;
    font-size: 26px;
  }
}
.m-comment-usr a {
  margin: 0 5px;
  color: @text-color1;
}
.m-comment-body:before {
  margin-left: -5px;
  content: "：";
  color: @text-color3;
}
</style>
