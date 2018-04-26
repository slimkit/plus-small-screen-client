<script>
import bus from "@/bus.js";
import Wx from "weixin-js-sdk";
import wx from "@/util/share.js";
import markdownIt from "markdown-it";
import FeedDetail from "../feed/feedDetail.vue";
import plusImagePlugin from "markdown-it-plus-image";
import { likeGroupPost, collectGroupPost } from "@/api/group.js";

export default {
  name: "group-post-detail",
  extends: FeedDetail,
  data: () => ({
    feed: {
      likes: []
    }
  }),
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
      this.$http
        .get(`/plus-group/groups/${this.groupID}/posts/${this.postID}`)
        .then(({ data = {} }) => {
          this.feed = { ...data };
          this.share.title = data.title;
          this.share.desc = data.summary;
          this.oldID = this.postID;
          this.fetching = false;
          this.fetchFeedComments();
          this.fetchRewards();
          this.fetchLikes();
          if (this.isWechat) {
            this.getWeChatConfig(this.feed.title, this.feed.summary);
          }
        })
        .catch(() => {
          this.$router.back();
        });
    },
    getWeChatConfig(title = "", desc = "") {
      const link =
        window.location.origin +
        process.env.BASE_URL.substr(0, process.env.BASE_URL.length - 1) +
        this.$route.fullPath;

      const imgUrl = this.firstImage ? this.firstImage : "";
      if (this.config.appid === "") {
        wx.getOauth(link).then(res => {
          this.config.timestamp = res.timestamp || "";
          this.config.signature = res.signature || "";
          this.config.appid = res.appid || "";
          this.config.noncestr = res.noncestr || "";
          Wx.config({
            debug: false,
            appId: this.config.appid,
            timestamp: this.config.timestamp,
            signature: this.config.signature,
            nonceStr: this.config.noncestr,
            jsApiList: this.appList
          });
          Wx.error(() => {
            // console.log(res);
          });
          Wx.ready(() => {
            Wx.onMenuShareTimeline({
              title,
              desc,
              link,
              imgUrl,
              success: () => {
                this.shareSuccess();
              },
              cancel: () => {
                this.shareCancel();
              }
            });
            Wx.onMenuShareAppMessage({
              title,
              desc,
              link,
              success: () => {
                this.shareSuccess();
              },
              cancel: () => {
                this.shareCancel();
              }
            });
            Wx.onMenuShareQQ({
              title,
              desc,
              link,
              imgUrl,
              success: () => {
                this.shareSuccess();
              },
              cancel: () => {
                this.shareCancel();
              }
            });
          });
        });
      } else {
        Wx.config({
          debug: false,
          appId: this.config.appid,
          timestamp: this.config.timestamp,
          signature: this.config.signature,
          nonceStr: this.config.noncestr,
          jsApiList: this.appList
        });

        Wx.ready(() => {
          Wx.onMenuShareTimeline({
            title,
            desc,
            link,
            imgUrl,
            success: () => {
              this.shareSuccess();
            },
            cancel: () => {
              this.shareCancel();
            }
          });
          Wx.onMenuShareAppMessage({
            title,
            desc,
            link,
            success: () => {
              this.shareSuccess();
            },
            cancel: () => {
              this.shareCancel();
            }
          });
          Wx.onMenuShareQQ({
            title,
            desc,
            link,
            imgUrl,
            success: () => {
              this.shareSuccess();
            },
            cancel: () => {
              this.shareCancel();
            }
          });
        }),
          Wx.error(() => {});
      }
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
          comments && comments.length
            ? ((this.comments = after
                ? [...this.comments, ...comments]
                : comments),
              (this.maxComId = comments[comments.length - 1].id))
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
    }
  },
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
        val > 0, (this.feed.comments_count = val);
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
<style>
</style>
