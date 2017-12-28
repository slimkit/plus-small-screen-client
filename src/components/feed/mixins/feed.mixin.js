export default {
  computed: {
    // 文本内容
    text () {
      let r = this.feed.feed_content
      r = r
        ? (r.length < 49
          ? r
          : (this.isPay
            ? `${r.slice(0, 40)}`
            : `${r.slice(0, 49)}…`))
        : false
      return r
    },
    title() { return '' },
    hasLike () {
      return this.feed.has_like
    },
    // 点赞数
    likeCount () {
      return this.feed.like_count
    },
    // 浏览数
    viewCount () {
      return this.feed.feed_view_count
    },
    // 评论数
    commentCount () {
      return this.feed.feed_comment_count
    }
  },
  methods: {
    formatData () {
      console.log('format data')
    },
    likeFeed () {
      // POST /feeds/:feed/like
      // DELETE /feeds/:feed/unlike
      const method = this.hasLike ? 'delete' : 'post'
      const url = this.hasLike ? `/feeds/${this.feed.id}/unlike` : `/feeds/${this.feed.id}/like`
      const num = this.hasLike ? this.feed.like_count - 1 : this.feed.like_count + 1
      this.$http({
        url,
        method
      }).then(({ data }) => {
        this.feed.has_like = !this.feed.has_like
        this.feed.like_count = num
      }).catch(err => {
        console.log(err)
      })
    },
    moreAction () {
      console.log('更多操作')
    },
    /**
     * 评论帖子
     * @author jsonleex <jsonlseex@163.com>
     * @param  {String} txt
     * @param  {[type]} option
     */
    commentFeed (body, replyUser, cb) {
      // POST /feeds/:feed/comments
      this.$http.post(`/feeds/${this.feed.id}/comments`, {
        body,
        reply_user: replyUser
      }).then(({ data: { message, comment } = {} }) => {
        this.feed.comments.unshift(comment)
        this.feed.feed_comment_count += 1
        cb && cb()
      }).catch(err => {
        const { response: { data = { message: '评论失败' } } = {} } = err
        this.$Message.error(data)
        cb && cb()
      })
    },
    /**
     * 删除评论
     * @author jsonleex <jsonlseex@163.com>
     * @param  {Number}   id cId
     * @param  {Function} cb 关闭 modal
     */
    deleteComment (id, cb) {
      console.log('删除评论:', id)
    },
    /**
     * 申请评论置顶
     * @author jsonleex <jsonlseex@163.com>
     * @param  {Number}   id cId
     * @param  {Function} cb 关闭 modal
     */
    pinnedComment (id, cb) {
      console.log('申请评论置顶:', id)
    }
  }
}
