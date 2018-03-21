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
              <feed-comment-audit-status :audit="audit" />
            </div>
            <div :class="`${prefixCls}-item-bottom`" v-if="audit.feed != null">
              <div class="content" @click="goToDetail(audit.feed.id)">
                对你的动态进行了“<span>{{ audit.comment.body }}</span>”评论并申请置顶,请及时审核
              </div>
            </div>
            <div :class="`${prefixCls}-item-bottom`" v-else>
              <div class="content red">
                该动态已被删除
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
import feedCommentAuditStatus from "../../components/feedCommentAuditStatus";

const prefixCls = "msgList";
export default {
  components: {
    feedCommentAuditStatus
  },
  name: "feedCommentAudit",
  data: () => ({
    prefixCls,
    currentItem: {}
  }),
  methods: {
    goToDetail(id) {
      this.$router.push(`/feed/${id}`);
    },
    onRefresh() {
      this.$http
        .get("/user/feed-comment-pinneds", {
          validateStatus: s => s === 200
        })
        .then(({ data }) => {
          if (data.length > 0) {
            this.$store.commit("SAVE_FEED_COMMENT_AUDITS", {
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
        .get("/user/feed-comment-pinneds", {
          validateStatus: s => s === 200
        })
        .then(({ data }) => {
          this.$refs.loadmore.bottomEnd(data.length < 15);
          if (data.length > 0) {
            this.$store.commit("SAVE_FEED_COMMENT_AUDITS", {
              type: "more",
              data
            });
          }
        });
    }
  },
  computed: {
    ...mapState({
      audits: state => state.MESSAGE.MY_COMMENT_AUDIT
    })
  },
  created() {}
};
</script>
<style lang="less" src="../../style.less">
</style>
