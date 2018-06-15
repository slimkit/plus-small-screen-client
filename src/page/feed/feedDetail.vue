<template>
  <article-card
  :liked="liked"
  :loading="loading"
  @on-like="likeFeed"
  @on-share="shareFeed"
  @on-more="moreAction"
  @on-comment="commentFeed"
  >
  <header slot="head" class="m-box m-justify-bet m-aln-center m-art-head" style="padding: 0">
    <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
      <svg class='m-style-svg m-svg-def' @click='goBack'>
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
      </svg>
    </div>
    <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title m-text-cut">
      <avatar :user="user" />
      <span
      class="m-text-cut m-flex-grow1 m-flex-shrink1"
      style="font-size: 0.32rem; margin-left: 0.1rem">{{ user.name }}</span>
    </div>
    <div
      class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end"
      :class="{ c_59b6d7: relation.status !== 'unFollow' }"
      @click="followUserByStatus(relation.status)"
      v-if="!isMine">
      <svg class="m-style-svg m-svg-def">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="relation.icon"></use>
      </svg>
    </div>
  </header>
  <!-- 内容 -->
  <main class="m-flex-shrink1 m-flex-grow1 m-art m-main">
    <div class="m-art-body">
      <h2 v-if="title">{{ title }}</h2>
      <video
        v-if="!!video"
        class="feed-detail-video"
        controls
        autoplay
        :poster="cover_file"
      >
        <source :src="video_file" type="video/mp4" />
      </video>
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
      <p class="m-text-box" v-html="formatBody(feedContent)"></p>
    </div>
    <div class="m-box m-aln-center m-justify-bet m-art-foot">
      <div class="m-flex-grow1 m-flex-shrink1 m-art-like-list">
        <router-link tag="div" class="m-box m-aln-center" to="likers" append v-if='likeCount > 0'>
          <ul class="m-box m-flex-grow0 m-flex-shrink0">
            <li
            :key="id"
            :style="{ zIndex: 5-index }"
            v-for="({user = {}, id}, index) in likes.slice(0, 5)"
            class="m-avatar-box tiny"
            :class="`m-avatar-box-${user.sex}`">
              <img :src="user.avatar">
            </li>
          </ul>
          <span>{{ likeCount | formatNum }}人点赞</span>
        </router-link>
      </div>
      <div class="m-box-model m-aln-end m-art-info">
        <span>发布于{{ time | time2tips }}</span>
        <span>{{ feed.feed_view_count || 0 | formatNum }}浏览</span>
      </div>
    </div>
    <!-- todo 打赏功能 -->
    <div class="m-box-model m-box-center m-box-center-a m-art-reward">
      <button class="m-art-rew-btn" @click="rewardFeed">打 赏</button>
      <p class="m-art-rew-label"><a href="javascript:;">{{ reward.count | formatNum }}</a>人打赏，共<a href="javascript:;">{{ (~~(reward.amount)/100).toFixed(2) }}</a>元</p>
      <router-link tag="ul" to="rewarders" append class="m-box m-aln-center m-art-rew-list">
        <li
        :key="rew.id"
        v-for="rew in rewardList"
        :class="`m-avatar-box-${rew.user.sex}`"
        class="m-flex-grow0 m-flex-shrink0 m-art-rew m-avatar-box tiny">
          <img :src="rew.user.avatar">
        </li>
        <li class="m-box m-aln-center" v-if="rewardList.length > 0">
          <svg class="m-style-svg m-svg-def" style="fill:#bfbfbf">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
          </svg>
        </li>
      </router-link>
    </div>
  </main>
  <!-- 评论列表 -->
  <div class="m-box-model m-art-comments" id="comment_list">
    <ul class="m-box m-aln-center m-art-comments-tabs">
      <li>{{ commentCount | formatNum }}条评论</li>
    </ul>
    <comment-item
      @on-click="replyComment"
      v-for="(comment) in pinnedCom"
      :pinned="true"
      :key="`pinned-comment-${comment.id}`"
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
import bus from "@/bus.js";
import ArticleCard from "@/page/article/ArticleCard.vue";
import CommentItem from "@/page/article/ArticleComment.vue";
import wechatShare from "@/util/wechatShare.js";
import { limit } from "@/api/api.js";
import { getFeedComments } from "@/api/feeds.js";
import { followUserByStatus, getUserInfoById } from "@/api/user.js";

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
      rewardList: [],

      fetchComing: false,
      noMoreCom: false,
      maxComId: 0,
      user: {}
    };
  },
  computed: {
    feedID() {
      return this.$route.params.feedID;
    },
    video() {
      return this.feed.video;
    },
    video_file() {
      return this.video ? `/api/v2/files/${this.video.video_id}` : false;
    },
    title() {
      return this.feed.title;
    },
    cover_file() {
      return this.video ? `/api/v2/files/${this.video.video_id}` : false;
    },
    CURRENTUSER() {
      return this.$store.state.CURRENTUSER;
    },
    isMine() {
      return this.feed.user_id === this.CURRENTUSER.id;
    },
    likes: {
      get() {
        return this.feed.likes || [];
      },
      set(val) {
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
    reward() {
      return this.feed.reward || {};
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
    isWechat() {
      return this.$store.state.BROWSER.isWechat;
    },
    has_collect: {
      get() {
        return this.feed.has_collect;
      },
      set(val) {
        this.feed.has_collect = val;
      }
    },
    relation: {
      get() {
        const relations = {
          unFollow: {
            text: "关注",
            status: "unFollow",
            icon: `#base-unFollow`
          },
          follow: {
            text: "已关注",
            status: "follow",
            icon: `#base-follow`
          },
          eachFollow: {
            text: "互相关注",
            status: "eachFollow",
            icon: `#base-eachFollow`
          }
        };
        const { follower, following } = this.user;
        return relations[
          follower && following
            ? "eachFollow"
            : follower
              ? "follow"
              : "unFollow"
        ];
      },

      set(val) {
        this.user.follower = val;
      }
    }
  },
  methods: {
    formatBody(str) {
      // 脚本内容以纯文本方式显示
      const scriptRegex = /<\s*script\s*>(.*?)<\s*\/\s*script\s*>/i;
      str = str.replace(scriptRegex, "&lt;script&gt;$1&lt;/script&gt;");

      // 换行符转换
      str = str.replace(/\n/g, "<br>");

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
      const shareUrl =
        window.location.origin +
        process.env.BASE_URL.substr(0, process.env.BASE_URL.length - 1) +
        this.$route.fullPath;
      const signUrl =
        this.$store.state.BROWSER.OS === "IOS" ? window.initUrl : shareUrl;
      this.$http
        .get(`/feeds/${this.feedID}`)
        .then(({ data = {} }) => {
          this.feed = data;
          this.oldID = this.feedID;
          this.fetching = false;
          this.fetchUserInfo();
          this.fetchFeedComments();
          this.fetchRewards();
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
          this.goBack();
        });
    },
    fetchUserInfo() {
      getUserInfoById(this.feed.user_id, true).then(user => {
        this.user = Object.assign({}, this.user, user);
        this.loading = false;
      });
    },
    fetchFeedComments(after = 0) {
      if (this.fetchComing) return;
      this.fetchComing = true;
      // this.$http.get(`/feeds/${this.feedID}/comments`, {
      //   params: {
      //     after
      //   }
      // });
      getFeedComments({ feedId: this.feedID, after })
        .then(({ data: { pinneds = [], comments = [] } }) => {
          this.pinnedCom = after ? [...this.pinneds, ...pinneds] : pinneds;
          if (comments && comments.length) {
            (this.comments = after
              ? [...this.comments, ...comments]
              : comments),
              (this.maxComId = comments[comments.length - 1].id);
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
    fetchRewards() {
      this.$http
        .get(`/feeds/${this.feedID}/rewards`, {
          params: { limit: 10 }
        })
        .then(({ data = [] }) => {
          this.rewardList = data;
        });
    },
    rewardFeed() {
      bus.$emit("reward:feed", this.feedID);
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
              text: "申请文章置顶",
              method: () => {
                this.$Message.info("置顶功能开发中，敬请期待");
              }
            },
            {
              text: "删除",
              method: () => {
                // DELETE /feeds/:feed
                setTimeout(() => {
                  bus.$emit(
                    "actionSheet",
                    [
                      {
                        text: "删除",
                        style: {
                          color: "#f4504d"
                        },
                        method: () => {
                          this.$http
                            .delete(`/feeds/${this.feedID}`, {
                              validataStatus: s => s === 204
                            })
                            .then(() => {
                              this.$Message.success("删除动态成功");
                              this.goBack();
                            });
                        }
                      }
                    ],
                    "取消",
                    "确认删除?"
                  );
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
          .then(({ data: { comment } = { comment: {} } }) => {
            this.$Message.success("评论成功");
            this.comments.unshift(comment);
            this.commentCount += 1;
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
    followUserByStatus(status) {
      if (!status || this.fetchFollow) return;
      this.fetchFollow = true;

      followUserByStatus({
        id: this.user.id,
        status
      }).then(follower => {
        this.relation = follower;
        this.fetchFollow = false;
      });
    }
  },
  activated() {
    if (this.feedID) {
      this.feedID !== this.oldID
        ? ((this.comments = []),
          (this.feed = {}),
          (this.rewardList = []),
          this.fetchFeed())
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
<style lang="less">
.feed-detail-video {
  height: 100vw;
  width: 100vw;
  // object-fit: cover;
  margin-left: -20px;
  background: #000;
}
.m-art-head {
  .m-avatar-box-def {
    width: 52px;
    height: 52px;
  }
}
</style>
