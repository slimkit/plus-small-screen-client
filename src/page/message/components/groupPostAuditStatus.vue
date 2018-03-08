<template>
  <div :class="`${prefixCls}-status`">
    <section v-if="audit.expires_at">
      <section class="gray"  v-if="audit.status === 1">
        同意置顶
      </section>
      <section class="red" v-else>
        拒绝置顶
      </section>
    </section>
    <section @click="showOperations(audit)" class="green" v-else>
      待审核
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
          target: postId = 0
        } = currentItem;
        this.$Modal.remove();
        this.$http
          .patch(`/plus-group/pinned/posts/${postId}/accept`, {
            validateStatus: s => s === 201
          })
          .then(({ data }) => {
            this.audit.expires_at = 1;
            this.audit.status = 1;
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
          target: postId = 0
        } = currentItem;
        this.$Modal.remove();
        this.$http
          .patch(`/plus-group/pinned/posts/${postId}/reject`, {
            validateStatus: s => s === 201
          })
          .then(({ data }) => {
            this.audit.expires_at = 1;
            this.audit.status = 2;
            this.$Message.success(data);
          })
          .catch(() => {});
      },
      showOperations(audit) {
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