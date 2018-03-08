<template>
  <div :class="`${prefixCls}`">
    <div :class="`${prefixCls}-container`">
      <load-more
        :onRefresh='onRefresh'
        :onLoadMore='onLoadMore'
        ref='loadmore'
        :class="`${prefixCls}-loadmore`"
      >
        <div v-for="audit in audits" :class="`${prefixCls}-item`" :key="audit.id">
          <div :class="`${prefixCls}-item-top`">
            <v-avatar :sex="audit.user.sex" :src="audit.user.avatar" />
            <section class="userInfo">
              <router-link :class="`${prefixCls}-item-top-link`" :to="`/user/${audit.user_id}`">{{ audit.user.name }}</router-link>
              <p>{{ audit.created_at | time2tips }}</p>
            </section>
            <group-post-comment-audit-status :audit="audit" />
          </div>
          <div :class="`${prefixCls}-item-bottom`" v-if="audit.news !== null">
            <div class="content" @click="goToDetail(audit.news.id)">
              对你的帖子进行了“<span>{{ audit.comment.body }}</span>”评论并申请置顶,请及时审核
            </div>
          </div>
        </div>
      </load-more>
    </div>
  </div>  
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import groupPostCommentAuditStatus from "../../components/groupPostCommentAuditStatus";
const prefixCls = "msgList";
export default {
  components: {
    groupPostCommentAuditStatus
  },
  name: "postCommentAudit",
  data: () => ({
    prefixCls
  }),
  methods: {
    goToDetail(id) {
      this.$router.push(`/news/${id}`);
    },
    onRefresh() {
      this.$http
        .get("/plus-group/pinned/comments", {
          validateStatus: s => s === 200
        })
        .then(({ data }) => {
          if (data.length > 0) {
            this.$store.commit("SAVE_POST_COMMENT_AUDITS", {
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
        .get("/plus-group/pinned/comments", {
          validateStatus: s => s === 200
        })
        .then(({ data }) => {
          this.$refs.loadmore.bottomEnd(data.length < 15);
          if (data.length > 0) {
            this.$store.commit("SAVE_POST_COMMENT_AUDITS", {
              type: "more",
              data
            });
          }
        });
    }
  },
  computed: {
    ...mapState({
      audits: state => state.MESSAGE.MY_POST_COMMENT_AUDIT
    })
  },
  created() {}
};
</script>
<style lang="less" src="../../style.less">
</style>
