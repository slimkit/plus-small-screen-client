<template>
  <div :class="`${prefixCls}`">
    <div :class="`${prefixCls}-container`">
      <load-more
          :onRefresh='onRefresh'
          :onLoadMore='onLoadMore'
          ref='loadmore'
          :class="`${prefixCls}-loadmore`"
        >
          <div v-for="audit in audits" :class="`${prefixCls}-item`" :key="`group-post-${audit.id}`">
            <div :class="`${prefixCls}-item-top`">
              <avatar :user="audit.user" />
              <section class="userInfo">
                <router-link :class="`${prefixCls}-item-top-link`" :to="`/users/${audit.user_id}`">{{ audit.user.name }}</router-link>
                <p>{{ audit.created_at | time2tips }}</p>
              </section>
              <group-post-audit-status :audit="audit" />
            </div>
            <div :class="`${prefixCls}-item-bottom`">
              <div  v-if="audit.post !== null" class="content" @click="goToDetail(audit.news.id)">
                对帖子“<span>{{ audit.post.title }}</span>”申请置顶,请及时审核
              </div>
              <div  v-else class="content red">
                帖子已被删除
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
import { limit } from "@/api/api.js";
import { getPostAudits } from "@/api/group.js";
import groupPostAuditStatus from "../../components/groupPostAuditStatus";
const prefixCls = "msgList";
export default {
  components: {
    groupPostAuditStatus
  },
  name: "groupPostAudit",
  data: () => ({
    prefixCls
  }),
  methods: {
    goToDetail(id) {
      this.$router.push(`/groups//${id}`);
    },
    onRefresh() {
      getPostAudits({}).then(({ data }) => {
        if (data.length > 0) {
          this.$store.commit("SAVE_GROUP_POST_AUDITS", {
            type: "new",
            data
          });
        }
        this.$refs.loadmore.topEnd(!(data.length < limit));
      });
    },
    onLoadMore() {
      const { id = 0 } = _.head(this.audits) || {};
      if (id === 0) {
        this.$refs.loadmore.bottomEnd(true);
        return false;
      }

      getPostAudits({ after: id }).then(({ data }) => {
        this.$refs.loadmore.bottomEnd(data.length < limit);
        if (data.length > 0) {
          this.$store.commit("SAVE_GROUP_POST_AUDITS", {
            type: "more",
            data
          });
        }
      });
    }
  },
  computed: {
    ...mapState({
      audits: state => state.MESSAGE.MY_POST_AUDIT
    })
  },
  created() {}
};
</script>
<style lang="less" src="../../style.less">
</style>
