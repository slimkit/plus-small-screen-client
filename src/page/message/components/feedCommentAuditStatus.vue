<template>
  <div :class="`${prefixCls}-status`">
    <section v-if="audit.comment != null">
      <section class="gray" v-if="audit.expires_at != null">
        已处理
      </section>
      <section class="green" v-else @click="showOperations(audit)" >
        待审核
      </section>
    </section>
    <section class="red" v-if="audit.comment == null">
      该评论已被删除
    </section>
  </div>
</template>
<script>
  /**
   * 提取动态评论置顶申请的状态控制组件
   */
  
  const prefixCls = 'msgList';
  export default {
    name: 'feedCommentAuditStatus',
    props: [
      'audit'
    ],
    data: () => ({
      prefixCls
    }),
    methods: {
        /**
       * 同意置顶
       * @Author   Wayne
       * @DateTime 2018-02-08
       * @Email    qiaobin@zhiyicx.com
       * @return   {[type]}            [description]
       */
      accept() {
        const { currentItem = {} } = this;
        const {
          raw: feedId = 0,
          target: commentId = 0,
          id: pinnedId = 0
        } = currentItem;
        this.$Modal.remove();
        this.$http
          .patch(`/feeds/${feedId}/comments/${commentId}/pinneds/${pinnedId}`, {
            validateStatus: s => s === 201
          })
          .then(({ data }) => {
            this.audit.expires_at = 1;
            this.$Message.success(data);
          })
          .catch(() => {});
      },
      /**
       * 拒绝置顶
       * @Author   Wayne
       * @DateTime 2018-02-08
       * @Email    qiaobin@zhiyicx.com
       * @return   {[type]}            [description]
       */
      reject() {
        const { currentItem = {} } = this;
        const { id: pinnedId = 0 } = currentItem;
        this.$Modal.remove();
        this.$http
          .delete(`/user/feed-comment-pinneds/${pinnedId}`, {
            validateStatus: s => s === 201
          })
          .then(({ data }) => {
            this.audit.expires_at = 1;
            this.$Message.success(data);
          })
          .catch(() => {});
      },
      showOperations(audit) {
        if (audit.feed === null) {
          this.$Message.error('动态已被删除,无法设置该评论置顶');
          return false;
        }
        this.currentItem = audit;
        const vm = this;
        this.$Modal.info({
          title: '请选择',
          render(h) {
            return h('div', {}, [
              h(
                'button',
                {
                  on: {
                    click: vm.accept
                  }
                },
                '同意置顶'
              ),
              h(
                'button',
                {
                  on: {
                    click: vm.reject
                  }
                },
                '拒绝置顶'
              )
            ]);
          }
        });
      }
    }
  }
</script>
<style lang="less" src="../style.less">
  
</style>