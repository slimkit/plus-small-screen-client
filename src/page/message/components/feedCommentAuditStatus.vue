<template>
  <div :class="`${prefixCls}-status`">
    <section v-if="audit.comment != null">
      <section 
        v-if="audit.expires_at != null" 
        class="gray">
        <span class="amount-show">{{ audit.amount }}积分 / {{ audit.day }}天</span>已审核
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
      v-if="audit.comment == null" 
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
  name: "FeedCommentAuditStatus",
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
      const {
        raw: feedId = 0,
        target: commentId = 0,
        id: pinnedId = 0
      } = currentItem;
      this.$Modal.remove();
      this.$http
        .patch(
          `/feeds/${feedId}/comments/${commentId}/currency-pinneds/${pinnedId}`,
          {
            validateStatus: s => s === 201
          }
        )
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
        .delete(`/user/feed-comment-currency-pinneds/${pinnedId}`, {
          validateStatus: s => s === 204
        })
        .then(() => {
          this.audit.expires_at = 1;
          this.$Message.success("已驳回");
        })
        .catch(() => {});
    },
    showOperations(audit) {
      if (audit.feed === null) {
        this.$Message.error("动态已被删除,无法设置该评论置顶");
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
