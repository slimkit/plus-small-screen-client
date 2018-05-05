<template>
    <div :class="`${prefixCls}`">
        <div :class="`${prefixCls}-container`">
            <load-more
                    :onRefresh='onRefresh'
                    :onLoadMore='onLoadMore'
                    ref='loadmore'
                    :class="`${prefixCls}-loadmore`"
            >
                <div v-for="audit in audits" :class="`${prefixCls}-item`" :key="`feed-comment-${audit.id}`">
                    <div :class="`${prefixCls}-item-top`">
                        <v-avatar :sex="audit.user.sex" :src="audit.user.avatar"/>
                        <section class="userInfo">
                            <router-link :class="`${prefixCls}-item-top-link`" :to="`/user/${audit.user_id}`">{{
                                audit.user.name }}
                            </router-link>
                            <p>{{ audit.created_at | time2tips }}</p>
                        </section>
                        <feed-comment-audit-status :audit="audit"/>
                    </div>
                    <audit-content :audit="getAuditContent(audit)"/>
                </div>
            </load-more>
        </div>
    </div>
</template>

<script>
  import _ from "lodash";
  import {mapState} from "vuex";
  import feedCommentAuditStatus from "../../components/feedCommentAuditStatus";
  import {getFeedCommentPinneds} from "@/api/feeds.js";
  import {limit} from "@/api/api.js";
  import AuditContent from "../../components/auditContent";

  const prefixCls = "msgList";
  export default {
    components: {
      feedCommentAuditStatus,
      AuditContent
    },
    name: "feedCommentAudit",
    data: () => ({
      prefixCls,
      currentItem: {}
    }),
    methods: {
      onRefresh() {
        getFeedCommentPinneds().then(({data}) => {
          if (data.length > 0) {
            this.$store.commit("SAVE_FEED_COMMENT_AUDITS", {
              type: "new",
              data
            });
          }
          this.$refs.loadmore.topEnd(!(data.length < limit));
        });
      },
      onLoadMore() {
        const {id = 0} = _.head(this.audits) || {};
        if (id === 0) {
          this.$refs.loadmore.bottomEnd(true);
          return false;
        }
        getFeedCommentPinneds(this.lastId).then(({data}) => {
          this.$refs.loadmore.bottomEnd(data.length < limit);
          if (data.length > 0) {
            this.$store.commit("SAVE_FEED_COMMENT_AUDITS", {
              type: "more",
              data
            });
          }
        });
      },
      getAuditContent(audit) {
        const {feed = {}, comment = {}} = audit || {};
        return {
          image: this.getFirstImage(feed),
          commentBody: this.getCommentBody(comment),
          video: this.getVideo(feed),
          content: this.getFeedContent(feed),
          commentableDel: audit.feed === null,
          commentDel: audit.comment === null,
          type: 'feed',
          contentId: audit.feed ? feed.id : 0
        };
      },
      // 获取评论内容
      getCommentBody(comment) {
        const {body} = comment || {};
        return body;
      },
      //获取动态内容
      getFeedContent(feed) {
        const {feed_content} = feed || {};
        return feed_content;
      },
      // 获取动态第一个图片
      getFirstImage(feed) {
        const {images} = feed || {};
        const {length} = images || [];
        if (length > 0) {
          const [img] = images;

          return img;
        }

        return false;
      },
      // 获取动态视频封面
      getVideo(feed) {
        const {video} = feed || {};
        if (video != null) {
          return video.cover_id;
        } else {
          return false;
        }
      }
    },
    computed: {
      ...mapState({
        audits: state => state.MESSAGE.MY_COMMENT_AUDIT
      }),
      lastId() {
        return this.audits[this.audits.length - 1].id || 0;
      }
    }
  };
</script>
<style lang="less" src="../../style.less">
</style>
