<template>
  <div :class="`${prefixCls}`">
    <div :class="`${prefixCls}-container`">
      <load-more
        ref="loadmore"
        :on-refresh="onRefresh"
        :on-load-more="onLoadMore"
        :class="`${prefixCls}-loadmore`" >
        <div
          v-for="audit in audits"
          :class="`${prefixCls}-item`"
          :key="`group-comment-${audit.id}`">
          <div :class="`${prefixCls}-item-top`">
            <avatar :user="audit.user" />
            <section class="userInfo">
              <router-link
                :class="`${prefixCls}-item-top-link`"
                :to="`/users/${audit.user_id}`">{{ audit.user.name }}</router-link>
              <p>{{ audit.created_at | time2tips }}</p>
            </section>
            <group-post-comment-audit-status :audit="audit" />
          </div>
          <!--<div :class="`${prefixCls}-item-bottom`" v-if="audit.news !== null">-->
          <!--<div class="content" @click="goToDetail(audit.news.id)">-->
          <!--对你的帖子进行了“<span>{{ audit.comment.body }}</span>”评论并申请置顶,请及时审核-->
          <!--</div>-->
          <!--</div>-->
          <audit-content :audit="getAuditContent(audit)" />
        </div>
      </load-more>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import { getPostCommentAudits } from "@/api/group.js";
import { limit } from "@/api/api.js";
import groupPostCommentAuditStatus from "../../components/groupPostCommentAuditStatus";
import AuditContent from "../../components/auditContent";

const prefixCls = "msgList";

export default {
  name: "PostCommentAudit",
  components: {
    AuditContent,
    groupPostCommentAuditStatus
  },
  data: () => ({
    prefixCls
  }),
  computed: {
    ...mapState({
      audits: state => state.MESSAGE.MY_POST_COMMENT_AUDIT
    })
  },
  methods: {
    getAuditContent(audit) {
      const { post = {}, comment = {} } = audit || {};
      return {
        image: this.getFirstImage(post),
        commentBody: this.getCommentBody(comment),
        video: false,
        content: this.getPostTitle(post),
        commentableDel: audit.post === null,
        commentDel: audit.comment === null,
        type: "group-post",
        contentId: audit.post ? post.id : 0,
        extraId: this.getExtraId(post)
      };
    },
    // 获取圈子id
    getExtraId(post) {
      return post.group_id;
    },
    // 获取评论内容
    getCommentBody(comment) {
      const { body } = comment || {};
      return body;
    },
    //获取动态内容
    getPostTitle(post) {
      const { title } = post || {};
      return title;
    },
    // 获取动态第一个图片
    getFirstImage(post) {
      const { images } = post || {};
      const { length } = images || [];
      if (length > 0) {
        const [img] = images;

        return img;
      }

      return false;
    },
    // goToDetail(id) {
    //   this.$router.push(`/news/${id}`);
    // },
    onRefresh() {
      getPostCommentAudits({}).then(({ data }) => {
        if (data.length > 0) {
          this.$store.commit("SAVE_POST_COMMENT_AUDITS", {
            type: "new",
            data
          });
        }
        this.$refs.loadmore.topEnd(!(data.length < limit));
      });
    },
    onLoadMore() {
      const { id = 0 } = _.last(this.audits) || {};
      if (id === 0) {
        this.$refs.loadmore.bottomEnd(true);
        return false;
      }

      getPostCommentAudits({ after: id }).then(({ data }) => {
        this.$refs.loadmore.bottomEnd(data.length < limit);
        if (data.length > 0) {
          this.$store.commit("SAVE_POST_COMMENT_AUDITS", {
            type: "more",
            data
          });
        }
      });
    }
  }
};
</script>
<style lang="less" src="../../style.less">
</style>
