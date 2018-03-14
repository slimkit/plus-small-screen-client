<template>
  <article-card
  :liked="liked"
  :loading="loading"
  @on-like="likeFeed"
  @on-share="shareFeed"
  @on-more="moreAction"
  @on-comment="commentFeed"
  >
  <header slot="head" class="m-box m-head-top m-justify-bet m-aln-center m-lim-width m-pos-f m-main m-bb1">
    <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
      <svg class='m-style-svg m-svg-def' @click='goBack'>
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
      </svg>
    </div>
    <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
      <div class="m-avatar-box small">
        <img :src="user.avatar">
      </div>
    </div>
    <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end">
      <svg class='m-style-svg m-svg-def'>
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-share"></use>
      </svg>
    </div>
  </header>
  <div class="m-flex-shrink1 m-flex-grow1 m-art m-main">
    <div class="m-art-body">
      <async-file
        v-for="img in images"
        v-if="img.file"
        :key="img.file"
        :file="img.file">
        <img 
        slot-scope="props"
        :src="props.src">
        />
      </async-file>
      <p>{{ feedContent }}</p>
    </div>
    <div class="m-box m-aln-center m-justify-bet m-art-foot">
        <div class="m-flex-grow1 m-flex-shrink1 m-box m-aln-center m-art-like-list">
          <template v-if='likeCount > 0'>
            <ul class="m-box m-flex-grow0 m-flex-shrink0">
              <li 
              :key="id"
              :style="{ zIndex: 5-index }" 
              v-for="({user, id}, index) in likes.slice(0, 5)"
              class="m-avatar-box tiny">
                <img :src="user.avatar">
              </li>
            </ul>
            <span>{{ likeCount | formatNum }}人点赞</span>
          </template>
        </div>
        <div class="m-box-model m-aln-end m-art-info">
          <span>发布于{{ time | time2tips }}</span>
          <span>{{ feed.feed_view_count || 0 | formatNum }}浏览</span>
        </div>
      </div>
      <!-- todo 打赏功能 -->
      <!--<div class="m-box-model m-box-center m-box-center-a m-art-reward">
        <button class="m-art-rew-btn">打 赏</button>
      </div>-->
    </div>
  </div>
  <div class="m-box-model m-art-comments">
    <ul class="m-box m-aln-center m-art-comments-tabs">
      <li>{{ commentCount | formatNum }}条评论</li>
    </ul>
    <comment-item 
      v-for="(comment) in pinnedCom"
      :pinned="true"
      :key="comment.id"
      :comment="comment"/>
    <comment-item
      @click="replyComment"
      v-for="(comment) in comments"
      :key="comment.id"
      :comment="comment"/>

      <div class="m-box m-aln-center m-justify-center load-more-box">
        <span v-if="noMoreCom" class="load-more-ph">---没有更多---</span>
        <span v-else class="load-more-btn" @click.stop="fetchFeedComments(maxComId)">
          {{fetchComing ? "加载中..." : "点击加载更多"}}
        </span>
        <!-- <button v-else class="load-more-btn" @click.stop="fetchNewsComments(maxComId)"></button> -->
      </div>
    </div>
  </article-card>
</template>
<script>
import bus from "@/bus.js";
import md from "@/util/markdown.js";
import ArticleCard from "@/page/article/ArticleCard.vue";
import CommentItem from "@/page/article/ArticleComment.vue";

export default {
  name: "feed-detail",
  components: {
    ArticleCard,
    CommentItem
  },
  data() {
    return {
      oldID: 0,
      feed: {},
      loading: true,
      fetching: false,

      likes: [],
      comments: [],
      pinnedCom: [],

      fetchComing: false,
      noMoreCom: false,
      maxComId: 0
    };
  },
  computed: {
    feedID() {
      return this.$route.params.feedID;
    },
    uid() {
      return this.$store.state.CURRENTUSER.id;
    },
    user() {
      const { user } = this.feed;
      return user && user.id === this.feed.user_id ? user : {};
    },
    isMine() {
      return this.feed.user_id === this.uid;
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
        val && (this.feed.like_count = val);
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
    images() {
      return this.feed.images || [];
    },
    time() {
      return this.feed.created_at || "";
    },
    feedContent() {
      return this.feed.feed_content || "";
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    fetchFeed() {
      if (this.fetching) return;
      this.fetching = true;
      this.$http
        .get(`/feeds/${this.feedID}`)
        .then(({ data = {} }) => {
          this.feed = data;
          this.oldID = this.feedID;
          setTimeout(() => {
            this.loading = false;
            this.fetching = false;
            this.fetchFeedComments();
            this.fetchFeedLikes();
          }, 800);
        })
        .catch(err => {
          console.log(err);
          this.$router.back();
        });
    },
    fetchFeedLikes() {
      this.$http.get(`/feeds/${this.feedID}/likes`).then(({ data = [] }) => {
        data && data.length, (this.likes = data);
      });
    },
    fetchFeedComments(after = 0) {
      if (this.fetchComing) return;
      this.fetchComing = true;
      this.$http
        .get(`/feeds/${this.feedID}/comments`, {
          params: {
            after
          }
        })
        .then(({ data: { pinneds = [], comments = [] } }) => {
          pinneds &&
            pinneds.length &&
            (this.pinnedCom = after ? [...this.pinneds, ...pinneds] : pinneds);
          comments && comments.length
            ? ((this.comments = after
                ? [...this.comments, ...comments]
                : comments),
              (this.maxComId = comments[comments.length - 1].id))
            : (this.noMoreCom = true);
          this.fetchComing = false;
        })
        .catch(() => {
          this.fetchComing = false;
        });
    },
    likeFeed() {
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
    commentFeed() {
      bus.$emit("commentInput", {
        onOk: text => {
          this.sendComment({ body: text });
        }
      });
    },
    shareFeed() {
      console.log("分享");
    },
    moreAction() {
      const defaultActions = [
        {
          text: "收藏",
          method() {
            console.log("收藏");
          }
        }
      ];

      const actions = this.isMine
        ? [
            {
              text: "申请文章置顶",
              method: () => {
                this.$Message.info("置顶功能开发中，敬请期待");
              }
            },
            {
              text: "删除",
              method: () => {
                this.$Message.info("资讯删除功能开发中，敬请期待");
              }
            }
          ]
        : [
            {
              text: "举报",
              method: () => {
                this.$Message.info("举报功能开发中，敬请期待");
              }
            }
          ];
      bus.$emit("actionSheet", [...defaultActions, ...actions], "取消");
    },

    replyComment(uid, uname, cid) {
      uid === this.uid
        ? bus.$emit(
            "actionSheet",
            [
              {
                text: "申请评论置顶",
                method: () => {
                  this.$Message.info("置顶功能开发中，敬请期待");
                }
              },
              {
                text: "删除评论",
                method: () => {
                  this.$Message.info("评论删除功能开发中，敬请期待");
                }
              }
            ],
            "取消"
          )
        : bus.$emit("commentInput", {
            placeholder: `回复： ${uname}`,
            onOk: text => {
              this.sendComment({ reply_user: uid, body: text });
            }
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
          .then(({ data }) => {
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
  activated() {
    if (this.feedID) {
      this.feedID !== this.oldID
        ? this.fetchFeed()
        : setTimeout(() => {
            this.loading = false;
          }, 600);
    }
  },
  deactivated() {
    this.loading = true;
  }
};
</script>
