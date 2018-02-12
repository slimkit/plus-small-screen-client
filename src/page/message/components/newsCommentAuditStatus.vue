<template>
  <div :class="`${prefixCls}-status`">
    <section v-if="audit.comment">
      <section v-if="audit.expires_at">
        <section class="gray"  v-if="audit.state === 1">
          同意置顶
        </section>
        <section class="red" v-else>
          拒绝置顶
        </section>
      </section>
      <section @click="showOperations(audit)" class="green" v-else>
        待审核
      </section>
    </section>
    <section class="red" v-if="!audit.comment ">
      该评论已被删除
    </section>
  </div>
</template>
<script>
  /**
   * 提取资讯评论置顶申请的状态控制组件
   */
  
  const prefixCls = 'msgList';
  export default {
    name: 'newsCommentAuditStatus',
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
          raw: commentId = 0,
          target: newsId = 0,
          id: pinnedId = 0
        } = currentItem;
        this.$Modal.remove();
        this.$http
          .patch(`/news/${newsId}/comments/${commentId}/pinneds/${pinnedId}`, {
            validateStatus: s => s === 201
          })
          .then(({ data }) => {
            this.audit.state = 1;
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
        const {
          id: pinnedId = 0,
          raw: commentId = 0,
          target: newsId = 0
        } = currentItem;
        this.$Modal.remove();
        this.$http
          .patch(`/news/${newsId}/comments/${commentId}/pinneds/${pinnedId}/reject`, {
            validateStatus: s => s === 204
          })
          .then(({ data }) => {
            this.audit.state = 2;
            this.audit.expires_at = 1;
            this.$Message.success('已拒绝置顶');
          })
          .catch(() => {});
      },
      showOperations(audit) {
        if (audit.news === null) {
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