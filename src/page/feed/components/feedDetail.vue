<template>
  <div class="group-feed-detail">
    <head-top :go-back='goBack' title='动态详情'></head-top>
    <div class="gfd-body">
      <div class="gfd-body-content" v-html='body'></div>
      <div class="gfd-body-foot">
        <div class="gfd-body-l">
          <div class="gfd-like-list">
            <div class="gfd-like-list-item" v-for='({user}) in likesList'>
              <v-avatar :src='user.avatar' size='small' :sex='user.sex' :key='user.id'></v-avatar>
            </div>
          </div>
          <span>{{ likes_count }}人点赞</span>
        </div>
        <div class="gfd-body-r">
          <p>发布于{{ created_at | time2tips }}</p>
          <p>{{ views_count }}人预览</p>
        </div>
      </div>
    </div>
    <div class="gfd-foot">
      <div class="gfd-foot-head">
        {{ comments_count }}条评论
      </div>
      <div class="gdf-comment-list">
        <div class="gfd-comment-item" v-for='comment in pinneds'>
          <router-link :to="`/user/${comment.user.id}`">
            <v-avatar :src='comment.user.avatar' :sex='comment.user.sex'></v-avatar>
          </router-link>
          <div class="gfd-comment-body">
            <section class="gfd-comment-body-top">
              <router-link :to="`/user/${comment.user.id}`" tag="span">{{ comment.user.name }}</router-link>
              <span>置顶</span>
              <span>{{ comment.created_at | time2tips }}</span>
            </section>
            <p v-if="!comment.reply_user" @click="commentAction(comment.user_id, comment.user.name, comment.id)">{{ comment.body }}</p>
            <section v-else class="gfd-comment-body-reply" @click.stop="commentAction(comment.user_id, comment.user.name, comment.id)">
              回复
              <span @click.prevent="goToUserHome(comment.reply.id)">{{ comment.reply.name }}</span>>: 
              <i @click.stop="commentAction(comment.user_id, comment.user.name, comment.id)">{{comment.body}}</i>
            </section>
          </div>
        </div>
      </div>
      <div class="gdf-comment-list">
        <div class="gfd-comment-item" v-for='comment in comments'>
          <router-link :to="`/user/${comment.user.id}`">
            <v-avatar :src='comment.user.avatar' :sex='comment.user.sex'></v-avatar>
          </router-link>
          <div class="gfd-comment-body">
            <section class="gfd-comment-body-usually">
              <router-link :to="`/user/${comment.user.id}`" tag="span">{{ comment.user.name }}</router-link>
              <span>{{ comment.created_at | time2tips }}</span>
            </section>
            <p v-if="!comment.reply_user" @click="commentAction(comment.user_id, comment.user.name, comment.id)">{{ comment.body }}</p>
            <section v-else class="gfd-comment-body-reply">
              回复
              <span @click.prevent="goToUserHome(comment.reply.id)">{{ comment.reply.name }}</span>: 
              <i @click.stop="commentAction(comment.user_id, comment.user.name, comment.id)">{{comment.body}}</i>
            </section>
          </div>
        </div>
      </div>
    </div>
    <div class="gfd-action">
      <div class="gfd-action-item" @click='likeFeed'>
        <v-icon :type='`${ liked ? "feed-like":"feed-unlike"}`'></v-icon>
        <p>喜欢</p>
      </div>
      <div class="gfd-action-item" @click='showCommentInput'>
        <v-icon type='feed-comment'></v-icon>
        <p>评论</p>
      </div>
      <div class="gfd-action-item">
        <v-icon type='base-share'></v-icon>
        <p>分享</p>
      </div>
      <div class="gfd-action-item">
        <v-icon type='feed-more'></v-icon>
        <p>更多</p>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import HeadTop from '@/components/HeadTop'
export default {
  name: 'feedDetail',
  components: {
    HeadTop
  },
  data() {
    return {
      body: '',
      created_at: '',
      images: [],
      comments: [],
      comments_count: 0,
      liked: false,
      likes_count: 0,
      views_count: 0,
      user: {},
      likesList: [],
      pinneds: []
    }
  },
  computed: {
    feedID() {
      return this.$route.params.feedID
    },
    currentUserId () {
      return this.$store.state.CURRENTUSER.id;
    },
    currentUser () {
      // return this.$store.getters.getUserById(this.currentUserId);
    }
  },
  methods: {
    goToUserHome (id) {
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
      } = await this.$http.get(`/feeds/${this.feedID}`)

      this.body = body
      this.created_at = createdAt
      this.images = images
      this.comments_count = commentsCount
      this.liked = liked
      this.likes_count = likesCount
      this.views_count = viewsCount
      this.user = user
    },

    // 获取评论列表
    async getComments () {
      const {
        data
      } = await this.$http.get(`/feeds/${this.feedID}/comments`, {
        limit: 15
      });
      this.comments = data.comments;
      this.pinneds = data.pinneds;
    },

    // 获取点赞列表
    async getFeedLikes() {
      const {
        data
      } = await this.$http.get(`/feeds/${this.feedID}/likes`, {
        limit: 5
      })
      this.likesList = data
    },

    goBack () {
      this.$router.go(-1);
    },
    to(path) {
      path = typeof path === 'string' ? { path } : path
      if (path) {
        this.$router.push(path)
      }
    },

    likeFeed() {
      const method = this.liked ? 'delete' : 'post'
      const url = this.liked
        ? `/feeds/${this.feedID}/unlike`
        : `/feeds/${this.feedID}/like`;
      const num = this.liked
        ? this.likes_count - 1
        : this.likes_count + 1;
      this.$http({
        method,
        url
      }).then(({ data }) => {
        this.liked = !this.liked
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
      })
    },
    /**
     * 评论帖子
     * @author jsonleex <jsonlseex@163.com>
     * @param  {String} txt
     * @param  {[type]} option
     */
    commentFeed(body, replyUser, cb) {
      this.$http.post(`/feeds/${this.feedID}/comments`, {
        body,
        reply_user: replyUser
      }).then(({ data: { message, comment } = {} }) => {
        this.comments.unshift(comment)
        this.comments_count += 1
        this.$Modal.remove();
        this.$Message.success(message);
      })
    },
    /**
     * 弹出评论操作框
     * @author jsonleex <jsonlseex@163.com>
     */
    commentAction(uId, uName, cId) {
      if (uId === this.$store.state.CURRENTUSER.id) {
        this.showCommentAction(cId)
      } else {
        const placeholder = uName && uId ? `回复: ${uName}` : '随便说说'
        this.showCommentInput({ placeholder, reply_user: uId })
      }
    },
    deleteComment (id, callback) {
      this.$http.delete(
        `/feeds/${this.feedID}/comments/${id}`,
        {
          validateStatus: s => s === 204
        }
      )
      .then(() => {
        this.$Message.success('删除成功');
        this.comments_count -= 1;
        _.remove(this.comments, n => n.id === id);
      })
    },
    /**
     * 显示评论操作弹层
     * @author jsonleex <jsonlseex@163.com>
     */
    showCommentAction(id) {
      const that = this
      that.$Modal.info({
        render(h) {
          return h('div', {}, [
            h('button', {
              on: {
                click: () => {
                  that.$Modal.remove();
                  that.deleteComment(id)
                }
              }
            }, '删除'),
            h('button', {
              on: {
                click: () => {
                  that.$Modal.remove();
                  // that.pinnedComment(id)
                  that.$Message.error('还得再等等...');
                }
              }
            }, '申请评论置顶')
          ])
        },
        onOk() {
          this.$Modal.remove()
        }
      })
    },
    /**
     * 显示评论输入框
     * @author jsonleex <jsonlseex@163.com>
     */
    showCommentInput(options = {}) {
      const that = this
      const { reply_user } = options
      options = Object.assign({}, {
        onOk(txt) {
          that.commentFeed(txt, reply_user);
        }
      }, options)
      this.$Modal.commentInpt(options)
    }
  },
  created() {
    this.initData();
    this.getFeedLikes();
    this.getComments();
  }
}

</script>
<style lang='less'>
.group-feed-detail {
  font-size: 30px;
  &-content {
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff
  }
  .head-top + * {
    padding-top: 110px;
  }
}

.gfd {
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
        color: #59b6d7
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

  &-body {
    padding: 50px 20px;
    background-color: #fff;
    &-content {
      width: 100%;
      overflow-x: auto;
      word-break: break-all;
    }
    &-l {
      color: #59b6d7;
      display: flex;
      align-items: center;
    }
    &-r {
      text-align: right;
      color: #999
    }
    p {
      padding-left: 20px;
      padding-right: 20px;
    }
    &-foot {
      margin-top: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        margin: 0;
      }
    }
  }

  &-foot {
    background-color: #fff;
    margin-top: 10px;
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
      &+& {
        border-top: 1px solid #ededed;
        /*no*/
      }
      p {
        margin: 0;
        margin-bottom: 28px;
      }
    }

    &-body {
      max-width: calc(~'100% - ' 76px);
      overflow-x: hidden;
      flex: 1 1 auto;
      margin: 0  0 0 30px;
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
            font-size: 22px;          }
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
