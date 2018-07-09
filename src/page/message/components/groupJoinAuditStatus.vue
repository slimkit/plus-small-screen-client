<template>
  <div :class="`${prefixCls}-status`">
    <section v-if="audit.audit_at">
      <section
        v-if="audit.status === 1"
        class="gray">
        同意加入
      </section>
      <section
        v-else
        class="gray">
        拒绝加入
      </section>
    </section>
    <section
      v-else
      class="green"
      @click="showOperations(audit)">
      <span class="audit-operation">审核</span>
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
      const { group_id: group = 0, member_id: member = 0 } = currentItem;
      this.$Modal.remove();
      this.$http
        .patch(
          `/plus-group/currency-groups/${group}/members/${member}/audit`,
          {
            status: 1
          },
          {
            validateStatus: s => s === 201
          }
        )
        .then(({ data }) => {
          this.audit.audit_at = 1;
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
      const { group_id: group = 0, member_id: member = 0 } = currentItem;
      this.$Modal.remove();
      this.$http
        .patch(
          `/plus-group/currency-groups/${group}/members/${member}/audit`,
          {
            status: 2
          },
          {
            validateStatus: s => s === 201
          }
        )
        .then(({ data }) => {
          this.audit.audit_at = 1;
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
        title: false,
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
