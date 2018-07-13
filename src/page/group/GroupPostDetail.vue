<template>
  <article-card
    :liked="liked"
    :loading="loading"
    @on-like="likeFeed"
    @on-share="shareFeed"
    @on-more="moreAction"
    @on-comment="commentFeed">
    <header
      slot="head"
      class="m-box m-justify-bet m-aln-center m-art-head"
      style="padding: 0">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg
          class="m-style-svg m-svg-def"
          @click="goBack">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#base-back"/>
        </svg>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title m-text-cut">
        <avatar :user="user" />
        <span class="m-text-cut m-flex-grow1 m-flex-shrink1 username">
          {{ user.name }}
        </span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end">
        <template
          v-if="!isMine"
          :class="{ c_59b6d7: relation.status !== 'unFollow' }"
          @click="followUserByStatus(relation.status)">
          <svg class="m-style-svg m-svg-def">
            <use
              :xlink:href="relation.icon"
              xmlns:xlink="http://www.w3.org/1999/xlink"/>
          </svg>
        </template>
      </div>
    </header>
    <!-- 内容 -->
    <load-more
      ref="loadmore"
      :on-refresh="onRefresh">
      <main class="m-flex-shrink1 m-flex-grow1 m-art m-main">
        <div class="m-art-body">
          <h2 v-if="title">{{ title }}</h2>
          <video
            v-if="!!video"
            :poster="cover_file"
            class="feed-detail-video"
            controls
            autoplay>
            <source
              :src="video_file"
              type="video/mp4" >
          </video>
          <async-file
            v-for="img in images"
            v-if="img.file"
            :key="img.file"
            :file="img.file">
            <img
              v-if="props.src"
              slot-scope="props"
              :src="props.src"
              @click="onFileClick(img)">
          </async-file>
          <p
            class="m-text-box"
            v-html="formatBody(feedContent)" />
        </div>
        <div class="m-box m-aln-center m-justify-bet m-art-foot">
          <div class="m-flex-grow1 m-flex-shrink1 m-art-like-list">
            <router-link
              v-if="likeCount > 0"
              tag="div"
              class="m-box m-aln-center"
              to="likers"
              append>
              <ul class="m-box m-flex-grow0 m-flex-shrink0">
                <li
                  v-for="({user = {}, id}, index) in likes.slice(0, 5)"
                  :key="id"
                  :style="{ zIndex: 5-index }"
                  :class="`m-avatar-box-${user.sex}`"
                  class="m-avatar-box tiny">
                  <img :src="user.avatar">
                </li>
              </ul>
              <span>{{ likeCount | formatNum }}人点赞</span>
            </router-link>
          </div>
          <div class="m-box-model m-aln-end m-art-info">
            <span v-if="time">发布于{{ time | time2tips }}</span>
            <span>{{ feed.views_count || 0 | formatNum }}浏览</span>
          </div>
        </div>
        <div class="m-box-model m-box-center m-box-center-a m-art-reward">
          <button
            class="m-art-rew-btn"
            @click="rewardFeed">打 赏</button>
          <p class="m-art-rew-label"><a href="javascript:;">{{ reward.count | formatNum }}</a>人打赏，共<a href="javascript:;">{{ ~~reward.amount }}</a>积分</p>
          <router-link
            tag="ul"
            to="rewarders"
            append
            class="m-box m-aln-center m-art-rew-list">
            <li
              v-for="rew in rewardList"
              :key="rew.id"
              :class="`m-avatar-box-${rew.user.sex}`"
              class="m-flex-grow0 m-flex-shrink0 m-art-rew m-avatar-box tiny">
              <img :src="rew.user.avatar">
            </li>
            <li
              v-if="rewardList.length > 0"
              class="m-box m-aln-center">
              <svg
                class="m-style-svg m-svg-def"
                style="fill:#bfbfbf">
                <use
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  xlink:href="#base-arrow-r"/>
              </svg>
            </li>
          </router-link>
        </div>
      </main>

      <!-- 评论列表 -->
      <div
        id="comment_list"
        class="m-box-model m-art-comments">
        <ul class="m-box m-aln-center m-art-comments-tabs">
          <li>{{ commentCount | formatNum }}条评论</li>
        </ul>
        <comment-item
          v-for="(comment) in pinnedCom"
          :pinned="true"
          :key="`pinned-comment-${comment.id}`"
          :comment="comment"
          @click="replyComment"/>
        <comment-item
          v-for="(comment) in comments"
          :key="comment.id"
          :comment="comment"
          @click="replyComment"/>
        <div class="m-box m-aln-center m-justify-center load-more-box">
          <span
            v-if="noMoreCom"
            class="load-more-ph">---没有更多---</span>
          <span
            v-else
            class="load-more-btn"
            @click.stop="fetchFeedComments(maxComId)">
            {{ fetchComing ? "加载中..." : "点击加载更多" }}
          </span>
        </div>
      </div>
    </load-more>
  </article-card>
</template>

<script>
import bus from "@/bus.js";
import markdownIt from "markdown-it";
import plusImagePlugin from "markdown-it-plus-image";
import FeedDetail from "../feed/FeedDetail.vue";
import wechatShare from "@/util/wechatShare.js";
import { limit } from "@/api/api.js";
import * as api from "@/api/group.js";

export default {
  name: "GroupPostDetail",
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
    },
    has_collect: {
      get() {
        return this.feed.collected;
      },
      set(val) {
        this.feed.collected = val;
      }
    }
  },
  created() {
    this.fetchFeed(() => {
      this.$refs.loadmore.topEnd();
    });
  },
  activated() {
    if (this.postID) {
      if (this.postID !== this.oldID) {
        this.components = [];
        this.fetchFeed(() => {
          this.$refs.loadmore.topEnd();
        });
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 200);
      }
    }
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
      api.collectGroupPost(this.feed.id, this.has_collect).then(() => {
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
    fetchFeed(callback) {
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
          if (callback && typeof callback === "function") {
            callback();
          }
        })
        .catch(() => {
          this.goBack();
          if (callback && typeof callback === "function") {
            callback();
          }
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
      api
        .getPostComments(this.postID, { after })
        .then(({ data: { pinneds = [], comments = [] } }) => {
          if (!after) {
            this.pinnedCom = pinneds;
            // 过滤第一页中的置顶评论
            const pinnedIds = pinneds.map(p => p.id);
            this.comments = comments.filter(c => pinnedIds.indexOf(c.id) < 0);
          } else {
            this.comments = [...this.comments, ...comments];
          }

          if (comments.length) {
            this.maxComId = comments[comments.length - 1].id;
          }

          this.noMoreCom = comments.length !== limit;
          this.$nextTick(() => {
            this.loading = false;
            this.fetchComing = false;
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
      api
        .likeGroupPost(this.postID, this.liked)
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
      const defaultActions = [];
      if (this.has_collect) {
        defaultActions.push({
          text: "取消收藏",
          method: () => {
            api.uncollectPost(this.feedID).then(() => {
              this.$Message.success("取消收藏");
              this.has_collect = false;
            });
          }
        });
      } else {
        defaultActions.push({
          text: "收藏",
          method: () => {
            api.collectionPost(this.feedID).then(() => {
              this.$Message.success("已加入我的收藏");
              this.has_collect = true;
            });
          }
        });
      }

      const actions = this.isMine
        ? [
            {
              text: "申请帖子置顶",
              method: () => {
                bus.$emit("applyTop", {
                  type: "post",
                  api: api.applyTopPost,
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
                        api.deletePost(this.groupID, this.postID).then(() => {
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
      // 是否是自己的评论
      if (uid === this.CURRENTUSER.id) {
        // 是否是自己文章的评论
        const isOwner = uid === this.user.id;
        const actionSheet = [
          {
            text: isOwner ? "评论置顶" : "申请评论置顶",
            method: () => {
              bus.$emit("applyTop", {
                isOwner,
                type: "postComment",
                api: api.applyTopPostComment,
                payload: { postId: Number(this.postID), commentId },
                callback: this.fetchFeedComments
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
            validateStatus: s => s === 201
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
      const callback = amount => {
        this.fetchRewards();
        this.feed.reward_number += 1;
        this.feed.reward_amount += amount;
      };
      bus.$emit("reward", {
        type: "groupPost",
        api: api.rewardPost,
        payload: this.postID,
        callback
      });
    },
    deleteComment(commentId) {
      api.deletePostComment(this.postID, commentId).then(() => {
        this.fetchFeedComments();
        this.commentCount -= 1;
        this.$Message.success("删除评论成功");
      });
    }
  }
};
</script>
