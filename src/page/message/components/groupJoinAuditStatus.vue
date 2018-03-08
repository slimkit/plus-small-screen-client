<template>
  <div :class="`${prefixCls}-status`">
      <section v-if="audit.audit_at">
        <section class="gray"  v-if="audit.status === 1">
          已同意
        </section>
        <section class="red" v-else>
          已拒绝
        </section>
      </section>
      <section @click="showOperations(audit)" class="green" v-else>
        待审核
      </section>
  </div>
</template>
<script>
/**
 * 提取动态评论置顶申请的状态控制组件
 */

const prefixCls = "msgList";
export default {
  name: "groupPostCommentAuditStatus",
  props: ["audit"],
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
          `/plus-group/groups/${group}/members/${member}/audit`,
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
          `/plus-group/groups/${group}/members/${member}/audit`,
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
