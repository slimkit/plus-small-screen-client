<template>
  <article-card
  :liked="liked"
  :loading="loading"
  :canOprate="news.audit_status===0"
  @on-like="likeNews"
  @on-share="shareNews"
  @on-more="moreAction"
  @on-comment="commentNews"
  >
    <header slot="head" class="m-box m-justify-bet m-aln-center m-art-head" style="padding: 0">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg class='m-style-svg m-svg-def' @click='goBack'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title m-text-cut">
        资讯详情
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end">
        <!-- <svg v-if="!isWechat" class='m-style-svg m-svg-def'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-share"></use>
        </svg> -->
      </div>
    </header>
    <div class="m-flex-shrink1 m-flex-grow1 m-art m-main">
      <section class="m-art-head">
         <h1>{{ news.title }}</h1>
         <p>
          <i class="m-art-cate">{{ cate }}</i>
          <span>来自 {{ news.from || '原创' }}</span>
        </p>
      </section>
      <p class="m-art-subject" v-if="news.subject">{{ news.subject }}</p>
      <div class="m-art-body" v-html='body'></div>
      <div class="m-box m-aln-center m-justify-bet m-art-foot">
        <div class="m-flex-grow1 m-flex-shrink1 m-box m-aln-center m-art-like-list">
          <template v-if='likeCount > 0 && news.audit_status===0'>
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
          <span>{{ news.hits || 0 | formatNum }}浏览</span>
        </div>
      </div>
      <!-- todo 打赏功能 -->
      <!--<div class="m-box-model m-box-center m-box-center-a m-art-reward">
        <button class="m-art-rew-btn">打 赏</button>
      </div>-->
    </div>

    <div class="m-box-model m-art-comments">
      <ul class="m-box m-aln-center m-art-comments-tabs">
        <li>{{ commentCount | formatNum }}条评论</li>
      </ul>
      <comment-item
        v-if="news.audit_status===0"
        v-for="(comment) in pinnedCom"
        :pinned="true"
        :key="`pinned-${comment.id}`"
        :comment="comment"/>
      <comment-item
        v-if="news.audit_status===0"
        @click="replyComment"
        v-for="(comment) in comments"
        :key="`comment-${comment.id}`"
        :comment="comment"/>

        <div v-if="news.audit_status===0" class="m-box m-aln-center m-justify-center load-more-box">
          <span v-if="noMoreCom" class="load-more-ph">---没有更多---</span>
          <span v-else class="load-more-btn" @click.stop="fetchNewsComments(maxComId)">
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
import wechatShare from "@/util/wechatShare.js";
import ArticleCard from "@/page/article/ArticleCard.vue";
import CommentItem from "@/page/article/ArticleComment.vue";
export default {
  name: "news-detail",
  components: {
    ArticleCard,
    CommentItem
  },
  data() {
    return {
      oldID: 0,
      news: {},
      loading: true,
      fetching: false,

      likes: [],
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
    firstImage() {
      let images = this.news.image;
      if (!Object.keys(images).length) {
        return "";
      }
      return (
        this.$http.defaults.baseURL + "/files/" + images.id + "?w=300&h=300"
      );
    },
    newsID() {
      return this.$route.params.newsID;
    },
    uid() {
      return this.$store.state.CURRENTUSER.id;
    },
    isMine() {
      return this.news.user_id === this.uid;
    },
    liked: {
      get() {
        return !!this.news.has_like;
      },
      set(val) {
        this.news.has_like = val;
      }
    },
    likeCount: {
      get() {
        return this.news.digg_count || 0;
      },
      set(val) {
        val && (this.news.digg_count = val);
      }
    },
    commentCount: {
      get() {
        return this.news.comment_count || 0;
      },
      set(val) {
        val > 0, (this.news.comment_count = val);
      }
    },
    time() {
      return this.news.created_at || "";
    },
    cate() {
      const { category: { name = "未分类" } = {} } = this.news;
      return name;
    },
    body() {
      return md(this.news.content || "");
    },
    isWechat() {
      return this.$store.state.BROWSER.isWechat;
    }
  },
  methods: {
    shareSuccess() {
      this.$Message.success("分享成功");
    },
    shareCancel() {
      this.$Message.success("取消分享");
    },
    fetchNews() {
      if (this.fetching) return;
      this.fetching = true;
      this.$http
        .get(`/news/${this.newsID}`)
        .then(({ data = {} }) => {
          this.news = data;
          this.oldID = this.newsID;
          this.share.title = data.title;
          this.share.desc = data.subject;
          setTimeout(() => {
            this.loading = false;
            this.fetching = false;
            this.fetchNewsComments();
            this.fetchNewsLikes();
          }, 800);
          if (this.isWechat) {
            const shareUrl =
              window.location.origin +
              process.env.BASE_URL.substr(0, process.env.BASE_URL.length - 1) +
              this.$route.fullPath;
            const signUrl =
              this.$store.state.BROWSER.OS === "IOS"
                ? window.initUrl
                : shareUrl;
            wechatShare(signUrl, {
              title: data.title,
              desc: data.subject,
              link: shareUrl,
              imgUrl: this.firstImage
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$router.back();
        });
    },
    fetchNewsLikes() {
      // GET /news/{news}/likes
      this.$http.get(`/news/${this.newsID}/likes`).then(({ data = [] }) => {
        data && data.length, (this.likes = data);
      });
    },
    fetchNewsComments(after = 0) {
      // GET /news/{news}/comments
      if (this.fetchComing) return;
      this.fetchComing = true;
      this.$http
        .get(`/news/${this.newsID}/comments`, {
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
    likeNews() {
      // DELETE /news/{news}/likes
      const method = this.liked ? "delete" : "post";
      if (this.fetching) return;
      this.fetching = true;
      this.$http({
        method,
        url: `/news/${this.newsID}/likes`,
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
    commentNews() {
      bus.$emit("commentInput", {
        onOk: text => {
          this.sendComment({ body: text });
        }
      });
    },
    shareNews() {
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

    replyComment(uid, uname) {
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
          .post(`/news/${this.newsID}/comments`, params, {
            validataStatus: s => s === 201
          })
          .then(({ data }) => {
            this.$Message.success("评论成功");
            console.log(data);
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
    if (this.newsID) {
      this.newsID !== this.oldID
        ? this.fetchNews()
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
