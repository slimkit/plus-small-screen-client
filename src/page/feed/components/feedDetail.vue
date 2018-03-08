<template>
  <div class="feed-detail">
    <head-top :go-back='goBack' title='动态详情'></head-top>
    <div class="ffd-body">
      <div ref="images" class="ffd-body-images">
        <img v-for="image in imagesFormat" :key="image.url" :src="image.url" :width="image.width" :height="image.height" />
      </div>
      <div ref="content" class="ffd-body-content" v-html='body'>
      </div>
      <div class="ffd-body-foot">
        <div class="ffd-body-l">
          <div :class="{'ffd-like-list-none': likes_count === 0}" class="ffd-like-list">
            <div class="ffd-like-list-item" v-for='({user}) in likesList' :key="user.id">
              <v-avatar :src='user.avatar' size='small' :sex='user.sex' :key='user.id'></v-avatar>
            </div>
          </div>
          <span>{{ likes_count }}人点赞</span>
        </div>
        <div class="ffd-body-r">
          <p>发布于{{ created_at | time2tips }}</p>
          <p>{{ views_count }}人预览</p>
        </div>
      </div>
    </div>
    <div class="ffd-foot">
      <div class="ffd-foot-head">
        {{ comments_count }}条评论
      </div>
      <div class="gdf-comment-list">
        <div class="ffd-comment-item" v-for='comment in pinneds' :key="comment.id">
          <router-link :to="`/user/${comment.user.id}`">
            <v-avatar :src='comment.user.avatar' :sex='comment.user.sex'></v-avatar>
          </router-link>
          <div class="ffd-comment-body">
            <section class="ffd-comment-body-top">
              <router-link :to="`/user/${comment.user.id}`" tag="span">{{ comment.user.name }}</router-link>
              <span>置顶</span>
              <span>{{ comment.created_at | time2tips }}</span>
            </section>
            <p v-if="!comment.reply_user" @click="commentAction(comment.user_id, comment.user.name, comment.id)">{{ comment.body }}</p>
            <section v-else class="ffd-comment-body-reply" @click.stop="commentAction(comment.user_id, comment.user.name, comment.id)">
              回复
              <span @click.prevent="goToUserHome(comment.reply.id)">{{ comment.reply.name }}</span>>: 
              <i @click.stop="commentAction(comment.user_id, comment.user.name, comment.id)">{{comment.body}}</i>
            </section>
          </div>
        </div>
      </div>
      <div class="gdf-comment-list">
        <div class="ffd-comment-item" v-for='comment in comments' :key="comment.id">
          <router-link :to="`/user/${comment.user.id}`">
            <v-avatar :src='comment.user.avatar' :sex='comment.user.sex'></v-avatar>
          </router-link>
          <div class="ffd-comment-body">
            <section class="ffd-comment-body-usually">
              <router-link :to="`/user/${comment.user.id}`" tag="span">{{ comment.user.name }}</router-link>
              <span>{{ comment.created_at | time2tips }}</span>
            </section>
            <p v-if="!comment.reply_user" @click="commentAction(comment.user_id, comment.user.name, comment.id)">{{ comment.body }}</p>
            <section v-else class="ffd-comment-body-reply">
              回复
              <span @click.prevent="goToUserHome(comment.reply.id)">{{ comment.reply.name }}</span>: 
              <i @click.stop="commentAction(comment.user_id, comment.user.name, comment.id)">{{comment.body}}</i>
            </section>
          </div>
        </div>
      </div>
    </div>
    <div class="ffd-action">
      <div class="ffd-action-item" @click='likeFeed'>
        <v-icon :type='`${ liked ? "feed-like":"feed-unlike"}`'></v-icon>
        <p>喜欢</p>
      </div>
      <div class="ffd-action-item" @click='showCommentInput'>
        <v-icon type='feed-comment'></v-icon>
        <p>评论</p>
      </div>
      <div class="ffd-action-item">
        <v-icon type='base-share'></v-icon>
        <p>分享</p>
      </div>
      <div class="ffd-action-item">
        <v-icon type='feed-more'></v-icon>
        <p>更多</p>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import HeadTop from "@/components/HeadTop";
export default {
  name: "feedDetail",
  components: {
    HeadTop
  },
  data() {
    return {
      body: "",
      created_at: "",
      images: [],
      comments: [],
      comments_count: 0,
      liked: false,
      likes_count: 0,
      views_count: 0,
      user: {},
      likesList: [],
      pinneds: []
    };
  },
  computed: {
    bodyWith() {
      return this.$refs.body;
    },
    feedID() {
      return this.$route.params.feedID;
    },
    currentUserId() {
      return this.$store.state.CURRENTUSER.id || 0;
    },
    currentUserToken() {
      return this.$store.state.CURRENTUSER.token || "";
    },
    clientWidth() {
      return this.$refs.content.clientWidth || 0;
    },
    baseUrl() {
      return document.head.querySelector('meta[name="api-basename"]').content;
    },
    // 图片展示
    imagesFormat() {
      if (this.images.length === 0) {
        return [];
      }

      return this.images.map(item => {
        let newItem = {};
        let size = _.split(item.size, "x");
        let rato = parseInt(size[0]) / this.clientWidth;
        newItem.width = this.clientWidth;
        newItem.height = parseInt(parseInt(size[1]) / rato);
        newItem.url = `${this.baseUrl}/files/${item.file}?token=${
          this.currentUserToken
        }`;

        return newItem;
      });
    }
  },
  methods: {
    goToUserHome(id) {
      this.$router.push(`/user/${id}`);
    },
    async initData() {
      const {
        data: {
          feed_content: body,
          created_at: createdAt,
          images,
          feed_comment_count: commentsCount,
          has_like: liked,
          like_count: likesCount,
          feed_view_count: viewsCount,
          user
        }
      } = await this.$http.get(`/feeds/${this.feedID}`);

      this.body = body;
      this.created_at = createdAt;
      this.images = images;
      this.comments_count = commentsCount;
      this.liked = liked;
      this.likes_count = likesCount;
      this.views_count = viewsCount;
      this.user = user;
    },

    // 获取评论列表
    async getComments() {
      const { data } = await this.$http.get(`/feeds/${this.feedID}/comments`, {
        limit: 15
      });
      this.comments = data.comments;
      this.pinneds = data.pinneds;
    },

    // 获取点赞列表
    async getFeedLikes() {
      const { data } = await this.$http.get(`/feeds/${this.feedID}/likes`, {
        limit: 5
      });
      this.likesList = data;
    },

    goBack() {
      this.$router.go(-1);
    },
    to(path) {
      path = typeof path === "string" ? { path } : path;
      if (path) {
        this.$router.push(path);
      }
    },

    likeFeed() {
      const method = this.liked ? "delete" : "post";
      const url = this.liked
        ? `/feeds/${this.feedID}/unlike`
        : `/feeds/${this.feedID}/like`;
      const num = this.liked ? this.likes_count - 1 : this.likes_count + 1;
      this.$http({
        method,
        url
      }).then(() => {
        this.liked = !this.liked;
        this.likes_count = num;
        let user = this.$store.getters.getUserById(this.currentUserId);
        if (!this.liked) {
          _.remove(this.likesList, n => n.user_id === this.currentUserId);
        } else {
          this.likesList.unshift({
            user,
            user_id: this.currentUserId
          });
        }
      });
    },
    /**
     * 评论帖子
     * @author jsonleex <jsonlseex@163.com>
     * @param  {String} txt
     * @param  {[type]} option
     */
    commentFeed(body, replyUser) {
      this.$http
        .post(`/feeds/${this.feedID}/comments`, {
          body,
          reply_user: replyUser
        })
        .then(({ data: { message, comment } = {} }) => {
          this.comments.unshift(comment);
          this.comments_count += 1;
          this.$Modal.remove();
          this.$Message.success(message);
        });
    },
    /**
     * 弹出评论操作框
     * @author jsonleex <jsonlseex@163.com>
     */
    commentAction(uId, uName, cId) {
      if (uId === this.$store.state.CURRENTUSER.id) {
        this.showCommentAction(cId);
      } else {
        const placeholder = uName && uId ? `回复: ${uName}` : "随便说说";
        this.showCommentInput({ placeholder, reply_user: uId });
      }
    },
    deleteComment(id) {
      this.$http
        .delete(`/feeds/${this.feedID}/comments/${id}`, {
          validateStatus: s => s === 204
        })
        .then(() => {
          this.$Message.success("删除成功");
          this.comments_count -= 1;
          _.remove(this.comments, n => n.id === id);
        });
    },
    /**
     * 显示评论操作弹层
     * @author jsonleex <jsonlseex@163.com>
     */
    showCommentAction(id) {
      const that = this;
      that.$Modal.info({
        render(h) {
          return h("div", {}, [
            h(
              "button",
              {
                on: {
                  click: () => {
                    that.$Modal.remove();
                    that.deleteComment(id);
                  }
                }
              },
              "删除"
            ),
            h(
              "button",
              {
                on: {
                  click: () => {
                    that.$Modal.remove();
                    // that.pinnedComment(id)
                    that.$Message.error("还得再等等...");
                  }
                }
              },
              "申请评论置顶"
            )
          ]);
        },
        onOk() {
          this.$Modal.remove();
        }
      });
    },
    /**
     * 显示评论输入框
     * @author jsonleex <jsonlseex@163.com>
     */
    showCommentInput(options = {}) {
      const that = this;
      const { reply_user } = options;
      options = Object.assign(
        {},
        {
          onOk(txt) {
            that.commentFeed(txt, reply_user);
          }
        },
        options
      );
      this.$Modal.commentInpt(options);
    }
  },
  created() {
    this.initData();
    this.getFeedLikes();
    this.getComments();
  }
};
</script>
<style lang='less'>
.feed-detail {
  font-size: 30px;
  &-content {
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
  }
  .head-top + * {
    padding-top: 90px;
  }
}

.ffd {
  &-head {
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
    h1 {
      font-size: 50px;
      padding: 0;
      margin: 10px 0;
    }
    p {
      color: #ccc;
      font-size: 24px;
      a {
        color: #59b6d7;
      }
    }
  }

  &-like-list {
    display: flex;
    margin-right: 25px;
    &-item {
      width: 24px;
    }
  }
  &-like-list-none {
    margin-right: 0;
  }

  &-body {
    padding-top: 90px;
    padding: 50px 0;
    background-color: #fff;
    &-images {
      width: 100%;
      img {
        background-color: #f4f5f5;
      }
    }

    &-content {
      width: 100%;
      overflow-x: auto;
      word-break: break-all;
      padding: 10px 20px;
    }
    &-l {
      color: #59b6d7;
      display: flex;
      align-items: center;
    }
    &-r {
      text-align: right;
      color: #999;
    }
    p {
      padding-left: 20px;
      padding-right: 20px;
    }
    &-foot {
      margin-top: 50px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        margin: 0;
        padding: 0;
      }
    }
  }

  &-foot {
    background-color: #fff;
    margin-top: 10px;
    padding-bottom: 95px;
    &-head {
      padding-left: 20px;
      padding-right: 20px;
      border-bottom: 1px solid #ededed;
      /*no*/
      height: 80px;
      line-height: 80px;
    }
  }
  &-comment {
    &-item {
      display: flex;
      padding: 28px 20px 0;
      min-height: 125px;
      align-items: flex-start;
      justify-content: flex-start;
      .v-avatar {
        flex: 0 0 auto;
      }
      & + & {
        border-top: 1px solid #ededed;
        /*no*/
      }
      p {
        margin: 0;
        margin-bottom: 28px;
      }
    }

    &-body {
      max-width: calc(~"100% - " 76px);
      overflow-x: hidden;
      flex: 1 1 auto;
      margin: 0 0 0 30px;
      color: #999;
      p {
        margin-top: 10px;
      }
      &-reply {
        margin-top: 10px;
        margin-bottom: 28px;
        span {
          color: #333;
        }
        i {
          font-style: normal;
        }
      }
      &-top {
        span {
          color: #333;
          + span {
            color: #4bb893;
            border: 1px solid #4bb893;
            padding: 2px;
            font-size: 22px;
            margin-left: 10px;
            + span {
              margin-right: 0;
            }
          }
        }
      }
      &-usually {
        display: flex;
        justify-content: space-between;
        span {
          color: #333;
          + span {
            color: #999;
            font-size: 22px;
          }
        }
      }
    }
  }

  &-action {
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 95px;
    line-height: 95px;
    text-align: center;
    background-color: #fff;
    border-top: 1px solid #ededed;
    &-item {
      line-height: 1.4;
      font-size: 24px;
      color: #b3b3b3;
      .v-icon {
        width: 38px;
        height: 38px;
      }
      p {
        margin: 0;
      }
    }
  }
}
</style>
