<script>
import bus from "@/bus.js";
import markdownIt from "markdown-it";
import plusImagePlugin from "markdown-it-plus-image";
import FeedDetail from "../feed/feedDetail.vue";
import wechatShare from "@/util/wechatShare.js";
import { limit } from "@/api/api.js";
import {
  likeGroupPost,
  collectGroupPost,
  applyTopPost,
  applyTopPostComment,
  deletePost,
  deletePostComment
} from "@/api/group.js";

export default {
  name: "group-post-detail",
  extends: FeedDetail,

  data: () => ({
    feed: {
      likes: []
    }
  }),
  computed: {
    feedID() {
      return this.$route.params.postID;
    },
    video_file() {
      return false;
    },
    cover_file() {
      return false;
    },
    postID() {
      return this.$route.params.postID;
    },
    groupID() {
      return this.$route.params.groupID;
    },
    likes() {
      return this.feed.likes || [];
    },
    liked: {
      get() {
        return !!this.feed.liked;
      },
      set(val) {
        this.feed.liked = val;
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
    commentCount: {
      get() {
        return this.feed.comments_count || 0;
      },
      set(val) {
        val > 0 && (this.feed.comments_count = val);
      }
    },
    images() {
      return this.feed.images || [];
    },
    firstImage() {
      let images = this.images;
      if (!images.length) {
        return "";
      }
      const file = images[0] || {};
      return this.$http.defaults.baseURL + "/files/" + file.id + "?w=300&h=300";
    },
    feedContent() {
      const { body = "" } = this.feed;

      // return render(body);
      // return this.$options.filters.markdownHtml(body);
      return body;
    },
    reward() {
      return (
        {
          amount: this.feed.reward_amount,
          count: this.feed.reward_number
        } || {}
      );
    }
  },
  created() {
    this.fetchFeed();
  },
  methods: {
    /**
     * 收藏
     * @Author   Wayne
     * @DateTime 2018-04-26
     * @Email    qiaobin@zhiyicx.com
     * @return   {[type]}            [description]
     */
    handleCollection() {
      collectGroupPost(this.feed.id, this.has_collect).then(() => {
        this.$Message.success("操作成功");
        this.has_collect = !this.has_collect;
      });
    },
    formatBody(body) {
      return markdownIt({
        html: true
      })
        .use(plusImagePlugin, `${this.$http.defaults.baseURL}/files/`)
        .render(body);
    },
    fetchFeed() {
      if (this.fetching) return;
      this.fetching = true;

      const shareUrl =
        window.location.origin +
        process.env.BASE_URL.substr(0, process.env.BASE_URL.length - 1) +
        this.$route.fullPath;
      const signUrl =
        this.$store.state.BROWSER.OS === "IOS" ? window.initUrl : shareUrl;

      this.$http
        .get(`/plus-group/groups/${this.groupID}/posts/${this.feedID}`)
        .then(({ data = {} }) => {
          this.feed = { ...data };
          this.user = this.feed.user;
          this.oldID = this.feedID;
          this.fetching = false;
          this.fetchFeedComments();
          this.fetchRewards();
          this.fetchLikes();
          this.isWechat &&
            wechatShare(signUrl, {
              title: `${data.user.name}的动态`,
              desc: `${data.feed_content}`,
              link: shareUrl,
              imgUrl:
                data.images.length > 0
                  ? `${this.$http.defaults.baseURL}/files/${
                      data.images[0].file
                    }`
                  : ""
            });
        })
        .catch(() => {
          this.$router.back();
        });
    },
    fetchRewards() {
      this.$http
        .get(`/plus-group/group-posts/${this.postID}/rewards`, {
          params: { limit: 10 }
        })
        .then(({ data = [] }) => {
          this.rewardList = data;
        });
    },
    fetchFeedComments(after = 0) {
      if (this.fetchComing) return;
      this.fetchComing = true;
      this.$http
        .get(`/plus-group/group-posts/${this.postID}/comments`, {
          params: {
            after
          }
        })
        .then(({ data: { pinneds = [], comments = [] } }) => {
          pinneds &&
            pinneds.length &&
            (this.pinnedCom = after ? [...this.pinneds, ...pinneds] : pinneds);

          if (comments.length) {
            this.comments = after ? [...this.comments, ...comments] : comments;
            this.maxComId = comments[comments.length - 1].id;
          }
          comments.length === limit
            ? (this.noMoreCom = false)
            : (this.noMoreCom = true);
          this.$nextTick(() => {
            this.fetchComing = false;
            this.loading = false;
          });
        })
        .catch(() => {
          this.loading = false;
          this.fetchComing = false;
        });
    },
    fetchLikes() {
      this.$http
        .get(
          `/plus-group/group-posts/${this.postID}/likes`,
          {
            params: { limit: 8 }
          },
          {
            validateStatus: s => s === 200
          }
        )
        .then(({ data = [] }) => {
          // this.feed.likes = data;
          this.feed = { ...this.feed, ...{ likes: data } };
        });
    },
    likeFeed() {
      likeGroupPost(this.postID, this.liked)
        .then(() => {
          !this.liked
            ? ((this.liked = true),
              (this.likeCount += 1),
              this.feed.likes.length < 5 &&
                (this.feed.likes = [
                  ...this.feed.likes,
                  {
                    user: this.CURRENTUSER,
                    id: new Date().getTime(),
                    user_id: this.CURRENTUSER.id
                  }
                ]))
            : ((this.liked = false),
              (this.likeCount -= 1),
              (this.feed.likes = this.feed.likes.filter(like => {
                return like.user_id !== this.CURRENTUSER.id;
              })));

          this.fetching = false;
        })
        .catch(() => {
          this.fetching = false;
        });
    },
    moreAction() {
      const defaultActions = [
        {
          text: this.has_collect ? "取消收藏" : "收藏",
          method: () => {
            // POST /feeds/:feed/collections
            // DELETE /feeds/:feed/uncollect
            let url;
            let txt;
            let method;
            this.has_collect
              ? ((txt = "取消收藏"),
                (method = "delete"),
                (url = `/feeds/${this.feedID}/uncollect`))
              : ((txt = "已加入我的收藏"),
                (method = "post"),
                (url = `/feeds/${this.feedID}/collections`));
            this.$http({
              url,
              method,
              validataStatus: s => s === 204 || s === 201
            }).then(() => {
              this.$Message.success(txt);
              this.has_collect = !this.has_collect;
            });
          }
        }
      ];

      const actions = this.isMine
        ? [
            {
              text: "申请帖子置顶",
              method: () => {
                bus.$emit("applyTop", {
                  type: "post",
                  api: applyTopPost,
                  payload: this.postID
                });
              }
            },
            {
              text: "删除帖子",
              method: () => {
                setTimeout(() => {
                  const actionSheet = [
                    {
                      text: "删除",
                      style: { color: "#f4504d" },
                      method: () => {
                        deletePost(this.postID).then(() => {
                          this.$Message.success("删除帖子成功");
                          this.goBack();
                        });
                      }
                    }
                  ];
                  bus.$emit("actionSheet", actionSheet, "取消", "确认删除?");
                }, 200);
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
    replyComment(uid, uname, commentId) {
      if (uid === this.CURRENTUSER.id) {
        const actionSheet = [
          {
            text: "申请评论置顶",
            method: () => {
              bus.$emit("applyTop", {
                type: "postComment",
                api: applyTopPostComment,
                payload: { postId: Number(this.postID), commentId }
              });
            }
          },
          { text: "删除评论", method: () => this.deleteComment(commentId) }
        ];
        bus.$emit("actionSheet", actionSheet, "取消");
      } else {
        bus.$emit("commentInput", {
          placeholder: `回复： ${uname}`,
          onOk: text => {
            this.sendComment({ reply_user: uid, body: text });
          }
        });
      }
    },
    sendComment({ reply_user: replyUser, body }) {
      const params = {};
      if (body && body.length > 0) {
        params.body = body;
        replyUser && (params["reply_user"] = replyUser);
        this.$http
          .post(`/plus-group/group-posts/${this.postID}/comments`, params, {
            validataStatus: s => s === 201
          })
          .then(({ data: { comment } = { comment: {} } }) => {
            this.$Message.success("评论成功");
            this.comments.unshift(comment);
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
    rewardFeed() {
      bus.$emit("reward:groupPost", this.postID);
    },
    deleteComment(commentId) {
      deletePostComment(this.postID, commentId).then(() => {
        this.fetchFeedComments();
        this.commentCount -= 1;
        this.$Message.success("删除评论成功");
      });
    }
  },
  activated() {
    if (this.postID) {
      this.postID !== this.oldID
        ? ((this.components = []), (this.rewardList = []), this.fetchFeed())
        : setTimeout(() => {
            this.loading = false;
          }, 600);
    }
  }
};
</script>
