<template>
  <div class="group-feed-detail">
    <head-top :go-back='true' title='帖子详情'></head-top>
    <div class="gfd-head">
      <h1>{{ title }}</h1>
      <p>来自
        <a>{{ user.name }}</a>
      </p>
    </div>
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
        <div class="gfd-comment-item" v-for='comment in comments'>
          <v-avatar :src='comment.user.avatar' :sex='comment.user.sex'></v-avatar>
          <div class="gfd-comment-body">
            <p>{{ comment.user.name }}</p>
            <p>{{ comment.body }}</p>
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
import HeadTop from '@/components/HeadTop'
export default {
  name: 'groupFeedDetail',
  components: {
    HeadTop
  },
  data() {
    return {
      title: '',
      body: '',
      created_at: '',
      images: [],
      comments: [],
      comments_count: 0,
      liked: false,
      likes_count: 0,
      views_count: 0,
      user: {},
      likesList: []
    }
  },
  computed: {
    groupID() {
      return this.$route.params.groupID
    },
    feedID() {
      return this.$route.params.feedID
    }
  },
  methods: {
    async initData() {
      const {
        data: {
          title,
          body,
          created_at: createdAt,
          images,
          comments,
          comments_count: commentsCount,
          liked,
          likes_count: likesCount,
          views_count: viewsCount,
          user
        }
      } = await this.$http.get(`/plus-group/groups/${this.groupID}/posts/${this.feedID}`)

      this.title = title
      this.body = body
      this.created_at = createdAt
      this.images = images
      this.comments = comments
      this.comments_count = commentsCount
      this.liked = liked
      this.likes_count = likesCount
      this.views_count = viewsCount
      this.user = user
    },

    // 获取点赞列表
    async getFeedLikes() {
      // GET /group-posts/:post/likes
      const {
        data
      } = await this.$http.get(`/plus-group/group-posts/${this.feedID}/likes`, {
        limit: 5
      })
      this.likesList = data
    },

    likeFeed() {
      // POST /group-posts/:post/likes
      // DELETE /group-posts/:post/likes
      const method = this.liked ? 'delete' : 'post'
      const num = this.liked
        ? this.likes_count - 1
        : this.likes_count + 1
      this.$http({
        method,
        url: `/plus-group/group-posts/${this.feedID}/likes`
      }).then(({ data }) => {
        this.liked = !this.liked
        this.likes_count = num
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 评论帖子
     * @author jsonleex <jsonlseex@163.com>
     * @param  {String} txt
     * @param  {[type]} option
     */
    commentFeed(body, replyUser, cb) {
      // /group-posts/:post/comments
      this.$http.post(`/plus-group/group-posts/${this.feedID}/comments`, {
        body,
        reply_user: replyUser
      }).then(({ data: { message, comment } = {} }) => {
        this.comments.unshift(comment)
        this.comments_count += 1
        cb && cb()
      }).catch(err => {
        const { response: { data = { message: '评论失败' } } = {} } = err
        this.$Message.error(data)
        cb && cb()
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
        const placeholder = uName && uId ? `回复${uName}` : '随便说说'
        this.showCommentInput({ placeholder, reply_user: uId })
      }
    },
    /**
     * 显示评论操作弹层
     * @author jsonleex <jsonlseex@163.com>
     */
    showCommentAction(id) {
      const that = this
      this.$Modal.info({
        render(h) {
          return h('div', {}, [
            h('button', {
              on: {
                click: () => {
                  that.deleteComment(id, this.onOk)
                }
              }
            }, '删除'),
            h('button', {
              on: {
                click: () => {
                  that.pinnedComment(id, this.onOk)
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
          that.commentFeed(txt, reply_user, () => {
            that.$Modal.remove()
          })
        }
      }, options)
      this.$ShowCommentInput(options)
    }
  },
  created() {
    this.initData()
    this.getFeedLikes()
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
      &+& {
        border-top: 1px solid #ededed;
        /*no*/
      }
    }

    &-body {
      max-width: calc(~'100% - ' 76+120px);
      overflow-x: hidden;
      flex: 1 1 auto;
      margin: 0 30px;
      color: #999;
      p:first-child {
        color: #333;
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
    }
  }
}

</style>
