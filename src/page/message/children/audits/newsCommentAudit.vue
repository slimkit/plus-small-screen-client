<template>
    <div :class="`${prefixCls}`">
        <div :class="`${prefixCls}-container`">
            <load-more
                    :onRefresh='onRefresh'
                    :onLoadMore='onLoadMore'
                    ref='loadmore'
                    :class="`${prefixCls}-loadmore`"
            >
                <div v-for="audit in audits" :class="`${prefixCls}-item`" v-bind:key="`news-comment-${audit.id}`">
                    <div :class="`${prefixCls}-item-top`">
                        <v-avatar :sex="audit.user.sex" :src="audit.user.avatar"/>
                        <section class="userInfo">
                            <router-link :class="`${prefixCls}-item-top-link`" :to="`/user/${audit.user_id}`">{{
                                audit.user.name }}
                            </router-link>
                            <p>{{ audit.created_at | time2tips }}</p>
                        </section>
                        <news-comment-audit-status :audit="audit"/>
                    </div>
                    <!--<div :class="`${prefixCls}-item-bottom`" v-if="audit.news">-->
                    <!--&lt;!&ndash; <div class="content" @click="goToDetail(audit.news.id)" v-if="audit.comment"> &ndash;&gt;-->
                    <!--<div class="content" v-if="audit.comment">-->
                    <!--对你的文章进行了“<span>{{ audit.comment.body }}</span>”评论并申请置顶,请及时审核-->
                    <!--</div>-->
                    <!--&lt;!&ndash; <div class="content" @click="goToDetail(audit.news.id)" v-else> &ndash;&gt;-->
                    <!--<div class="content" v-else>-->
                    <!--对你的文章进行了评论并申请置顶,请及时审核-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--<div :class="`${prefixCls}-item-bottom`" v-else>-->
                    <!--<div class="content red" @click="goToDetail(audit.news.id)">-->
                    <!--该文章已被删除-->
                    <!--</div>-->
                    <!--</div>-->
                    <audit-content :audit="getAuditContent(audit)"/>
                </div>
            </load-more>
        </div>
    </div>
</template>

<script>
  import _ from "lodash";
  import {mapState} from "vuex";
  import {limit} from "@/api/api.js";
  import {getNewsCommentPinneds} from "@/api/news.js";
  import newsCommentAuditStatus from "../../components/newsCommentAuditStatus";
  import AuditContent from "../../components/auditContent";

  const prefixCls = "msgList";
  export default {
    components: {
      AuditContent,
      newsCommentAuditStatus
    },
    name: "newsCommentAudit",
    data: () => ({
      prefixCls
    }),
    methods: {
      goToDetail(id) {
        this.$router.push(`/news/${id}`);
      },
      onRefresh() {
        this.$http
          .get("/news/comments/pinneds", {
            validateStatus: s => s === 200
          })
          .then(({data}) => {
            if (data.length > 0) {
              this.$store.commit("SAVE_NEWS_COMMENT_AUDITS", {
                type: "new",
                data
              });
            }
            this.$refs.loadmore.topEnd(!(data.length < limit));
          });
      },
      onLoadMore() {
        const {id = 0} = _.last(this.audits);
        if (id === 0) {
          this.$refs.loadmore.bottomEnd(true);
          return false;
        }
        getNewsCommentPinneds(id).then(({data}) => {
          this.$refs.loadmore.bottomEnd(data.length < limit);
          if (data.length > 0) {
            this.$store.commit("SAVE_NEWS_COMMENT_AUDITS", {
              type: "more",
              data
            });
          }
        });
      },
      getAuditContent(audit) {
        const {news = {}, comment = {}} = audit || {};
        return {
          image: this.getFirstImage(news),
          commentBody: this.getCommentBody(comment),
          content: this.getFeedContent(news),
          commentableDel: audit.news === null,
          commentDel: audit.comment === null,
          type: 'news',
          contentId: audit.news ? news.id : 0
        };
      },
      // 获取评论内容
      getCommentBody(comment) {
        const {body} = comment || {};
        return body;
      },
      //获取动态内容
      getFeedContent(news) {
        const {title} = news || {};
        return title;
      },
      // 获取动态第一个图片
      getFirstImage(news) {
        const {image} = news || {};
        if (image !== null) {
          return {
            file: image.id,
            size: image.size
          }
        }

        return false;
      },
    },
    computed: {
      ...mapState({
        audits: state => state.MESSAGE.MY_NEWS_COMMENT_AUDIT
      })
    },
    created() {
    }
  };
</script>
<style lang="less" src="../../style.less">
</style>
