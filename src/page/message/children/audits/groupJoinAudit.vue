<template>
  <div :class="`${prefixCls}`">
    <div :class="`${prefixCls}-container`">
      <load-more
          :onRefresh='onRefresh'
          :onLoadMore='onLoadMore'
          ref='loadmore'
          :class="`${prefixCls}-loadmore`"
        >
          <div v-if="audit.comment !== null" v-for="audit in audits" :class="`${prefixCls}-item`">
            <div :class="`${prefixCls}-item-top`">
              <v-avatar :sex="audit.user.sex" :src="audit.user.avatar" />
              <section class="userInfo">
                <router-link :class="`${prefixCls}-item-top-link`" :to="`/user/${audit.user_id}`">{{ audit.user.name }}</router-link>
                <p>{{ audit.created_at | time2tips }}</p>
              </section>
              <group-join-audit-status :audit="audit" />
            </div>
            <div :class="`${prefixCls}-item-bottom`">
              <div class="content" @click="goToDetail(audit.news.id)" v-if="audit.group !== null">
                审请加入你创建的圈子<span>{{ audit.group.name }}</span>”,请及时审核
              </div>
              <div class="content" @click="goToDetail(audit.news.id)" v-else>
                该圈子已被删除
              </div>
            </div>
          </div>
        </load-more>
    </div>
  </div>  
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import groupJoinAuditStatus from '../../components/groupJoinAuditStatus'
const prefixCls = 'msgList';
export default {
  components: {
    groupJoinAuditStatus
  },
  name: 'groupJoinAudit',
  data: () => ({
    prefixCls
  }),
  methods: {
    goToDetail(id) {
      this.$router.push(`/news/${id}`);
    },
    onRefresh() {
      this.$http
        .get('/plus-group/user-group-audit-members', {
          validateStatus: s => s === 200
        })
        .then(({ data }) => {
          if (data.length > 0) {
            this.$store.commit('SAVE_JOIN_GROUP_AUDITS', {
              type: 'new',
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
        .get('/plus-group/user-group-audit-members', {
          validateStatus: s => s === 200
        })
        .then(({ data }) => {
          this.$refs.loadmore.bottomEnd(data.length < 15);
          if (data.length > 0) {
            this.$store.commit('SAVE_JOIN_GROUP_AUDITS', {
              type: 'more',
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
