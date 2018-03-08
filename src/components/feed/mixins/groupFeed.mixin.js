export default {
  computed: {
    text() {
      return this.feed.summary;
    },
    title() {
      return this.feed.title;
    },
    hasLike() {
      return this.feed.liked;
    },
    // 点赞数
    likeCount() {
      return this.feed.likes_count;
    },
    // 浏览数
    viewCount() {
      return this.feed.views_count;
    },
    // 评论数
    commentCount() {
      return this.feed.comments_count;
    }
  },
  methods: {
    /**
     * 查看动态详情
     * @author jsonleex <jsonlseex@163.com>
     */
    viewFeed() {
      this.$router.push(`/group/${this.feed.group_id}/feed/${this.feed.id}`);
    },
    formatData() {
      console.log("format data");
    },
    likeFeed() {
      // POST /group-posts/:post/likes
      // DELETE /group-posts/:post/likes
      const method = this.hasLike ? "delete" : "post";
      const num = this.hasLike
        ? this.feed.likes_count - 1
        : this.feed.likes_count + 1;
      this.$http({
        method,
        url: `/plus-group/group-posts/${this.feed.id}/likes`
      })
        .then((/*{ data }*/) => {
          this.feed.liked = !this.feed.liked;
          this.feed.likes_count = num;
        })
        .catch(err => {
          console.log(err);
        });
    },
    moreAction() {
      console.log("更多操作");
    },
    /**
     * 评论帖子
     * @author jsonleex <jsonlseex@163.com>
     * @param  {String} txt
     * @param  {[type]} option
     */
    commentFeed(body, replyUser, cb) {
      // /group-posts/:post/comments
      this.$http
        .post(`/plus-group/group-posts/${this.feed.id}/comments`, {
          body,
          reply_user: replyUser
        })
        .then(({ data: { /*message, */ comment } = {} }) => {
          this.feed.comments.unshift(comment);
          this.feed.comments_count += 1;
          cb && cb();
        })
        .catch(err => {
          const { response: { data = { message: "评论失败" } } = {} } = err;
          this.$Message.error(data);
          cb && cb();
        });
    },
    deleteComment(id /*, cb*/) {
      console.log("删除评论:", id);
    },
    pinnedComment(id) {
      console.log("申请评论置顶:", id);
    }
  }
};
