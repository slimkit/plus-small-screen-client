<template>
  <article-card
  :liked="liked"
  :loading="loading"
  @on-like="likeFeed"
  @on-share="shareFeed"
  @on-more="moreAction"
  @on-comment="commentFeed"
  >
  <header slot="head" class="m-box m-justify-bet m-aln-center">
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
        v-if="props.src"
        :src="props.src">
        />
      </async-file>
      <p v-html="replaceURI(feedContent)"></p>
    </div>
    <div class="m-box m-aln-center m-justify-bet m-art-foot">
        <div class="m-flex-grow1 m-flex-shrink1 m-box m-aln-center m-art-like-list">
          <template v-if='likeCount > 0'>
            <ul class="m-box m-flex-grow0 m-flex-shrink0">
              <li 
              :key="id"
              :style="{ zIndex: 5-index }" 
              v-for="({user = {}, id}, index) in likes.slice(0, 5)"
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
    <!-- </div> -->
  </div>
  <div class="m-box-model m-art-comments" id="comment_list">
    <ul class="m-box m-aln-center m-art-comments-tabs">
      <li>{{ commentCount | formatNum }}条评论</li>
    </ul>
    <comment-item
      @on-click="replyComment"
      v-for="(comment) in pinnedCom"
      :pinned="true"
      :key="comment.id"
      :comment="comment"/>
    <comment-item
      @on-click="replyComment"
      v-for="(comment) in comments"
      :key="comment.id"
      :comment="comment"/>

      <div class="m-box m-aln-center m-justify-center load-more-box">
        <span v-if="noMoreCom" class="load-more-ph">---没有更多---</span>
        <span v-else class="load-more-btn" @click.stop="fetchFeedComments(maxComId)">
          {{fetchComing ? "加载中..." : "点击加载更多"}}
        </span>
      </div>
    </div>
  </article-card>
</template>
<script>
import wx from "@/util/share.js";
import bus from "@/bus.js";
import Wx from "weixin-js-sdk";
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

      comments: [],
      pinnedCom: [],

      fetchComing: false,
      noMoreCom: false,
      maxComId: 0,
      config: {
        appid: "",
        signature: "",
        timestamp: "",
        noncestr: ""
      },
      appList: [
        "onMenuShareQZone",
        "onMenuShareQQ",
        "onMenuShareAppMessage",
        "onMenuShareTimeline"
      ],
      share: {
        title: "",
        desc: "",
        link: ""
      }
    };
  },
  computed: {
    feedID() {
      return this.$route.params.feedID;
    },
    CURRENTUSER() {
      return this.$store.state.CURRENTUSER;
    },
    user() {
      const { user } = this.feed;
      return user && user.id === this.feed.user_id ? user : {};
    },
    isMine() {
      return this.feed.user_id === this.CURRENTUSER.id;
    },
    likes: {
      get() {
        return this.feed.likes || [];
      },
      set(val) {
        console.log(val);
        this.feed.likes = val;
      }
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
    images() {
      return this.feed.images || [];
    },
    time() {
      return this.feed.created_at || "";
    },
    feedContent() {
      return this.feed.feed_content || "";
    },
    // 分享第一张图片
    firstImage() {
      let images = this.images;
      if (!images.length) {
        return "";
      }
      const file = images[0] || {};
      return (
        this.$http.defaults.baseURL + "/files/" + file.file + "?w=300&h=300"
      );
    },
    isWechat() {
      return this.$store.state.BROWSER.isWechat;
    }
  },
  methods: {
    replaceURI(str) {
      const reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
      return str
        ? str.replace(
            reg,
            link =>
              `<a class="m-art-links" href="${link}" target="__blank">#网页链接#</a>`
          )
        : "";
    },
    shareSuccess() {
      this.$Message.success("分享成功");
    },
    shareCancel() {
      this.$Message.success("取消分享");
    },
    fetchFeed() {
      if (this.fetching) return;
      this.fetching = true;
      this.$http
        .get(`/feeds/${this.feedID}`)
        .then(({ data = {} }) => {
          this.feed = data;
          this.share.title = data.user.name + "的动态";
          this.share.desc = data.feed_content;
          this.oldID = this.feedID;
          this.fetching = false;
          this.fetchFeedComments();
          this.getWeChatConfig();
        })
        .catch(() => {
          this.$router.back();
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
            ? ((this.liked = true),
              (this.likeCount += 1),
              this.likes.length < 5 &&
                (this.likes = [
                  ...this.likes,
                  {
                    user: this.CURRENTUSER,
                    id: new Date().getTime(),
                    user_id: this.CURRENTUSER.id
                  }
                ]))
            : ((this.liked = false),
              (this.likeCount -= 1),
              (this.likes = this.likes.filter(like => {
                return like.user_id !== this.CURRENTUSER.id;
              })));

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
      if (this.isWechat) {
        this.$Message.success("请使用微信自带分享😳");
        return;
      }

      this.$Message.success("加紧开发中...😳");
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
    getWeChatConfig() {
      const url = window.location.origin + this.$route.fullPath;
      this.share.link = url;
      if (this.config.appid === "") {
        wx.getOauth(url).then(res => {
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
          Wx.ready(() => {});
          Wx.error(() => {
            // console.log(res);
          });
          Wx.onMenuShareTimeline({
            title: this.share.title,
            desc: this.share.desc,
            link: this.share.link,
            imgUrl: this.firstImage,
            success: () => {
              this.shareSuccess();
            },
            cancel: () => {
              this.shareCancel();
            }
          });
          Wx.onMenuShareAppMessage({
            title: this.share.title,
            desc: this.share.desc,
            link: this.share.link,
            imgUrl: this.firstImage,
            success: () => {
              this.shareSuccess();
            },
            cancel: () => {
              this.shareCancel();
            }
          });
          Wx.onMenuShareQQ({
            title: this.share.title,
            desc: this.share.desc,
            link: this.share.link,
            imgUrl: this.firstImage,
            success: () => {
              this.shareSuccess();
            },
            cancel: () => {
              this.shareCancel();
            }
          });
        });
      } else {
        this.$Message.success("请使用微信自带分享😳");
        Wx.config({
          debug: false,
          appId: this.config.appid,
          timestamp: this.config.timestamp,
          signature: this.config.signature,
          nonceStr: this.config.noncestr,
          jsApiList: this.appList
        });

        Wx.ready(() => {}),
          Wx.error(() => {
            // console.log(res);
          });
        Wx.onMenuShareTimeline({
          title: this.share.title,
          desc: this.share.desc,
          link: this.share.link,
          imgUrl: this.firstImage,
          success: () => {
            this.shareSuccess();
          },
          cancel: () => {
            this.shareCancel();
          }
        });
        Wx.onMenuShareAppMessage({
          title: this.share.title,
          desc: this.share.desc,
          link: this.share.link,
          imgUrl: this.firstImage,
          success: () => {
            this.shareSuccess();
          },
          cancel: () => {
            this.shareCancel();
          }
        });
        Wx.onMenuShareQQ({
          title: this.share.title,
          desc: this.share.desc,
          link: this.share.link,
          imgUrl: this.firstImage,
          success: () => {
            this.shareSuccess();
          },
          cancel: () => {
            this.shareCancel();
          }
        });
      }
    },
    replyComment(uid, uname) {
      uid === this.CURRENTUSER.id
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
    this.share = {
      title: "",
      desc: "",
      link: ""
    };
    this.config = {
      appid: "",
      timestamp: 0,
      noncestr: "",
      signature: ""
    };
  }
};
</script>
