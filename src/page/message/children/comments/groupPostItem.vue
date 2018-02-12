<template>
  <section>
    <div :class="`${prefixCls}-item-top`">
      <v-avatar :sex="comment.user.sex" :src="comment.user.avatar" />
      <section class="userInfo">
        <router-link :class="`${prefixCls}-item-top-link`" :to="`/user/${comment.user_id}`">{{ comment.user.name }}</router-link>
        <span v-if="comment.reply_user">回复</span><span v-else>评论了你的帖子</span>
        <router-link :class="`${prefixCls}-item-top-link`" v-if="comment.reply_user" :to="`/user/${comment.reply_user}`">{{ comment.reply.name }} </router-link>:
        <p>{{ comment.created_at | time2tips }}</p>
      </section>
    </div>
    <div :class="`${prefixCls}-item-bottom`">
      <span class="content" @click.stop="showCommentInput">
        {{ comment.body }}
      </span>
      <section v-if="comment.commentable !== null" @click="goToFeedDetail()">
        <div :class="`${prefixCls}-item-bottom-noImg`" class="content" >
          {{ comment.commentable.title }}
        </div>
        <!-- <div :class="`${prefixCls}-item-bottom-img`" v-else>
          <img :src="getImage" :alt="comment.user.name">
          <div class="content">
            {{ comment.commentable.body }}
          </div>
        </div> -->
      </section>
      <section v-if="comment.commentable === null">
        <div :class="`${prefixCls}-item-bottom-noImg`" class="content">
          帖子已被删除
        </div>
      </section>
    </div>
  </section>
</template>
<script>
  const prefixCls = 'msgList';
  export default {
    name: 'groupPostItem',
    props: [
      'comment'
    ],
    data: () => ({
      prefixCls
    }),
    methods: {
      /**
       * 进入详情
       * @Author   Wayne
       * @DateTime 2018-01-31
       * @Email    qiaobin@zhiyicx.com
       * @return   {[type]}            [description]
       */
      goToFeedDetail () {
        const { commentable: { id = 0 } } = this.comment;
        this.$router.push(`/questions/${id}`)
      },

      sendComment(comment) {
        const { commentable_id: postId = 0, user_id: userID = 0 } = this.comment;
        this.$http.post(
          `/group-posts/${postId}/comments`,
          {
            reply_user: userID,
            body: comment
          }, {
            validateStatus: s => s === 201
          }
        )
        .then(data => {
          this.$Message.success('回复成功');
        })
      },
      /**
       * 调起输入框
       * @Author   Wayne
       * @DateTime 2018-01-31
       * @Email    qiaobin@zhiyicx.com
       * @return   {[type]}            [description]
       */
      showCommentInput () {
        this.$Modal.commentInpt(
          {
            placeholder: `回复: ${this.comment.user.name}`,
            onOk: (comment) => {
              this.sendComment(comment);
              this.$Modal.remove();
            }
          }
        );
      }
    },
    created () {
      // console.log(this.comment)
    }
  }
</script>
