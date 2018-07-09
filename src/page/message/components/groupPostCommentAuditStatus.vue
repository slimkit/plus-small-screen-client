<template>
  <div :class="`${prefixCls}-status`">
    <section v-if="audit.comment">
      <section v-if="audit.expires_at">
        <section
          v-if="~~audit.status === 1"
          class="gray">
          <span class="amount-show">{{ audit.amount }}积分 / {{ audit.day }}天</span>同意置顶
        </section>
        <section
          v-else
          class="gray">
          <span class="amount-show">{{ audit.amount }}积分 / {{ audit.day }}天</span>拒绝置顶
        </section>
      </section>
      <section
        v-else
        class="green"
        @click="showOperations(audit)">
        <span class="audit-show">{{ audit.amount }}积分 / {{ audit.day }}天</span>
        <span class="audit-operation">审核</span>
      </section>
    </section>
    <section
      v-if="!audit.comment "
      class="red">
      该评论已被删除
    </section>
  </div>
</template>

<script>
/**
 * 提取动态评论置顶申请的状态控制组件
 */

const prefixCls = "msgList";
export default {
  name: "GroupPostCommentAuditStatus",
  props: {
    audit: { type: Object, default: () => {} }
  },
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
      const { target: commentId = 0 } = currentItem;
      this.$Modal.remove();
      this.$http
        .patch(`/plus-group/currency-pinned/comments/${commentId}/accept`, {
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
      const { target: commentId = 0 } = currentItem;
      this.$Modal.remove();
      this.$http
        .patch(`/plus-group/currency-pinned/comments/${commentId}/reject`, {
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
      if (audit.feed === null) {
        this.$Message.error("帖子已被删除,无法设置该评论置顶");
        return false;
      }
      this.currentItem = audit;
      const vm = this;
      this.$Modal.info({
        title: "请选择",
        render(h) {
          return h("div", {}, [
            h(
              "button",
              {
                on: {
                  click: vm.accept
                }
              },
              "同意置顶"
            ),
            h(
              "button",
              {
                on: {
                  click: vm.reject
                }
              },
              "拒绝置顶"
            )
          ]);
        }
      });
    }
  }
};
</script>
<style lang="less" src="../style.less">
</style>
