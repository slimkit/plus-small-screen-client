<template>
  <div :class="`${prefixCls}`">
    <div :class="`${prefixCls}-container`">
      <load-more
        ref="loadmore"
        :on-refresh="onRefresh"
        :on-load-more="onLoadMore"
        :class="`${prefixCls}-loadmore`"
      >
        <div 
          v-for="audit in audits" 
          v-if="audit.comment !== null" 
          :class="`${prefixCls}-item`" 
          :key="`group-join-${audit.id}`">
          <div :class="`${prefixCls}-item-top`">
            <avatar :user="audit.user" />
            <section class="userInfo">
              <router-link 
                :class="`${prefixCls}-item-top-link`" 
                :to="`/users/${audit.user_id}`">{{ audit.user.name }}</router-link>
              <p>{{ audit.created_at | time2tips }}</p>
            </section>
            <group-join-audit-status :audit="audit" />
          </div>
          <audit-content :audit="getAuditContent(audit)" />
        </div>
      </load-more>
    </div>
  </div>  
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import groupJoinAuditStatus from "../../components/groupJoinAuditStatus";
import AuditContent from "../../components/auditContent";

const prefixCls = "msgList";
export default {
  name: "GroupJoinAudit",
  components: {
    AuditContent,
    groupJoinAuditStatus
  },
  data: () => ({
    prefixCls
  }),
  methods: {
    getAuditContent(audit) {
      const { group } = audit || {};
      return {
        image: this.getGroupAvatar(group),
        commentBody: "",
        video: false,
        content: this.getGroupTitle(group),
        commentableDel: audit.group === null,
        commentDel: null,
        type: "group",
        contentId: audit.group ? group.id : 0
      };
    },
    //获取动态内容
    getGroupTitle(group) {
      const { summary } = group || {};
      return summary;
    },
    // 获取动态第一个图片
    getGroupAvatar(group) {
      return group.avatar;
    },
    onRefresh() {
      this.$http
        .get("/plus-group/user-group-audit-members", {
          validateStatus: s => s === 200
        })
        .then(({ data }) => {
          if (data.length > 0) {
            this.$store.commit("SAVE_JOIN_GROUP_AUDITS", {
              type: "new",
              data
            });
          }
          this.$refs.loadmore.topEnd(!(data.length < 15));
        });
    },
    onLoadMore() {
      const { id = 0 } = _.head(this.audits) || {};
      if (id === 0) {
        this.$refs.loadmore.bottomEnd(true);
        return false;
      }

      this.$http
        .get("/plus-group/user-group-audit-members", {
          validateStatus: s => s === 200
        })
        .then(({ data }) => {
          this.$refs.loadmore.bottomEnd(data.length < 15);
          if (data.length > 0) {
            this.$store.commit("SAVE_JOIN_GROUP_AUDITS", {
              type: "more",
              data
            });
          }
        });
    }
  },
  computed: {
    ...mapState({
      audits: state => state.MESSAGE.MY_GROUP_JOIN_AUDIT
    })
  },
  created() {}
};
</script>
<style lang="less" src="../../style.less">
</style>
