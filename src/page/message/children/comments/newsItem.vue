<template>
  <section>
    <div :class="`${prefixCls}-item-top`">
      <v-avatar :sex="comment.user.sex" :src="comment.user.avatar" />
      <section class="userInfo">
        <router-link :class="`${prefixCls}-item-top-link`" :to="`/user/${comment.user_id}`">{{ comment.user.name }}</router-link>
        <span v-if="comment.reply_user">回复</span><span v-else>评论了你的头条</span>
        <router-link :class="`${prefixCls}-item-top-link`" v-if="comment.reply_user" :to="`/user/${comment.reply_user}`">{{ comment.reply.name }} </router-link>:
        <p>{{ comment.created_at | time2tips }}</p>
      </section>
    </div>
    <div :class="`${prefixCls}-item-bottom`">
      <span class="content" @click.stop="showCommentInput">
        {{ comment.body }}
      </span>
      <section v-if="comment.commentable !== null" @click="goToFeedDetail()">
        <div :class="`${prefixCls}-item-bottom-noImg`" class="content" v-if="!getImage">
          {{ comment.commentable.title }}
        </div>
        <div :class="`${prefixCls}-item-bottom-img`" v-else>
          <div class="img">
            <img :src="getImage" :alt="comment.user.name">
          </div>
          <div class="content">
            {{ comment.commentable.title }}
          </div>
        </div>
      </section>
      <section v-if="comment.commentable === null">
        <div :class="`${prefixCls}-item-bottom-noImg`" class="content">
          文章已被删除
        </div>
      </section>
    </div>
  </section>
</template>
<script>
  const prefixCls = 'msgList';
  const url = '/questions/';
  export default {
    name: 'newsItem',
    props: [
      'comment'
    ],
    data: () => ({
      prefixCls,
      url
    }),
    methods: {
      /**
       * 进入动态详情
       * @Author   Wayne
       * @DateTime 2018-01-31
       * @Email    qiaobin@zhiyicx.com
       * @return   {[type]}            [description]
       */
      goToFeedDetail () {
        const { commentable: { id = 0 } } = this.comment;
        this.$router.push(`/news/${id}`)
      },

      sendComment(comment) {
        const { commentable_id: newsId = 0, user_id: userID = 0 } = this.comment;
        this.$http.post(
          `/news/${newsId}/comments`,
          {
            reply_user: userID,
            body: comment
          }, {
            validateStatus: s => s === 201
          }
        )
        .then(data => {
          console.log(data);
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
    computed: {
      /**
       * 获取图片,并计算地址
       * @Author   Wayne
       * @DateTime 2018-01-31
       * @Email    qiaobin@zhiyicx.com
       * @return   {[type]}            [description]
       */
      getImage () {
        const { comment } = this;
        const { id = 0 } = comment.commentable.image || {};
        if (id > 0) {
          return `/api/v2/files/${id}`;
        }

        return false;
      }
    },
    created () {
      // console.log(this.comment)
    }
  }
</script>
