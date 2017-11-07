<template>
  <li 
    :class="$style.detail"
    :id="`feed-${feed.id}`"
  >
    <section 
      style="display: flex; align-items: flex-start;"
    >
      <div :class="$style.detailAvatar">
        <user-avatar :sex='sex' :src='avatar' size='small' @click.native="changeUrl(`/users/feeds/${user.id}`)" />
      </div>
      <section 
        style="padding: 0 2vw; width: 86vw;"
      >
        <section :class="$style.detailContentBefore">
          <router-link 
            :class="$style.detailUsername" 
            :to='`/users/feeds/${user.id}`'
          >
            {{ user.name }}
          </router-link>
          <div>
            <i class="pinned-icon" v-if='feed.pinned > 0'>置顶</i>
            <timeago 
              :class="$style.detailTimer" 
              :since="timer" 
              locale="zh-CN" 
              :auto-update="60"
            />
          </div>
        </section>
        <figure 
          :class="$style.detailFeedContent"
          @click.stop="toFeedDetail(feed.id)"
        >
          <p 
            :class="$style.detailContent" 
            v-html="feed.feed_content ? feed.feed_content.replace(/\n/g,'<br/>') : feed.feed_content"
          >
          </p>
          <FeedImages 
            v-show="feed.images.length" 
            :storages="feed.images"
            :feed="feed.id"
          />
        </figure>
      </section>
    </section>
    <div class="feed-footer">
      <feed-tools 
        :user="user" 
        :feed="feed"
  
        :isOwn='isOwn'
        :isDigg='isDigg'
        :has_collection='has_collection'
        :openInput="feed.id == commentFeed ? true : false"

        :upvote='upvote' 
        :viewFeed='viewFeed' 
        :handleComment='handleComment' 
        :handleCollection='handleCollection' 

        :deleteFeed='deleteFeed' 
        :deleteComment='deleteComment'
        :pinnedComment='pinnedComment'
        :pinnedFeed='pinnedFeed'
      />

    </div>
  </li>
</template>

<script>
  import { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import { getUserInfo, getLoggedUserInfo } from '../utils/user';
  import FeedImages from './FeedImages';
  // import FeedTool from './FeedTool';
  import CommentsTool from './CommentsTool';
  import timers from '../utils/timer';
  import router from '../routers/index';
  import {
    resolveImage
  } from '../utils/resource';

  import lodash from 'lodash';
  import { changeUrl } from '../utils/changeUrl';
  import { mapState } from 'vuex';
  import { NOTICE, USERS_APPEND, FEEDSLIST } from '../stores/types';
  import storeLocal from 'store';
  const defaultAvatar =  resolveImage(require('../statics/images/defaultAvatarx2.png'));

  import { showAmount } from '../utils/balance';

  import FeedTool from '../views/group/FeedTools/FeedTool';
  
  const feedinfo = {
    name: 'feed',
    components: {
      FeedImages,
      CommentsTool,
      'feed-tools': FeedTool,
    },
    props: [
      'feed'
    ],
    data: () => ({
      goldName: window.TS_WEB.goldName,
      user: {}
    }),
    methods: {
      changeUrl,

      toFeedDetail(id) {
        if(this.feed.paid_node && !this.feed.paid_node.paid) {
          this.$Modal.confirm({
            title: '付费支付',
            content: `<p>需要支付${showAmount(this.feed.paid_node.amount)}${this.goldName}</p>`,
            okText: '确认支付',
            loading: true,
            onOk: () => {
              addAccessToken().post(createAPI(`purchases/${this.feed.paid_node.node}`), {
                validateStatus: status => status === 201                
              })
              .then(() => {
                this.$Modal.remove();
                this.$Message.success('支付成功');

                this.$store.getters[FEEDSLIST][id].paid_node.paid = true;
                setTimeout( () => {
                  this.changeUrl(`/feed/${id}`);
                }, 800);
              })
              .catch( ({ response: { data, status } = {} }) => {
                this.$Modal.remove();
                this.$Message.error(this.$MessageBundle(data).getMessage());
              })
            }
          });
          return;
        }
        this.changeUrl(`/feed/${id}`);
      },
      timers,
      router (link) {
        router.push(link);
      },
      /**
         * 点赞/取消点赞
         * @param  {String} type  'like' || 'unlike'
         * POST /feeds/:feed/like
         */
        upvote(type) {
            let method = type === 'like' ? 'POST' : 'DELETE',
                url = method === 'POST' ? `feeds/${this.feed.id}/like` : `feeds/${this.feed.id}/unlike`;
            addAccessToken()({
                method,
                url: createAPI(url)
            }).then().catch(({ response: { data = { message: '点赞失败' } } = {} }) => {
                this.$Message.error(this.$MessageBundle(data).getMessage());
            });
        },

        /**
         * 评论动态
         * @param  {String} txt
         * POST /feeds/:feed/comments
         */
        handleComment({ content, reply_user, success, error }) {
            if(content) {
                const group_post_comment_mark = new Date().getTime() + '' + this.user.id,
                  params =
                  reply_user ? {
                      body: content,
                      reply_user,
                      group_post_comment_mark,
                  } : {
                      body: content,
                      group_post_comment_mark,
                  };
                addAccessToken().post(createAPI(`feeds/${this.feed.id}/comments`), {
                    ...params
                }).then(({ data: { comment } }) => {
                    success(comment);
                }).catch(err => {
                    error(err);
                });
            } else {
                this.$Message.warning('评论内容不能为空');
                return false;
            }
        },

        /**
         * 收藏/取消收藏
         * @param  {[type]} type
         * POST /feeds/:feed/collections
         */
        handleCollection(type) {
            const method = type === 'collection' ? 'POST' : 'DELETE',
            url = method === 'POST' ? 
              `feeds/${this.feed.id}/collections` :
              `feeds/${this.feed.id}/uncollect`;
            addAccessToken()({
                method,
                url: createAPI(url),
                validateStatus: status => status === 201 || status === 204
            }).then(response => {
                this.feed.has_collection = !this.feed.has_collection;
            }).catch(({ response: { data = { message: "操作失败, 请刷新后重试" } } }) => {
                this.$Message.error(this.$MessageBundle(data).getMessage());
            })
        },

        /**
         * 查看动态详情
         * @param  {Number} id
         */
        viewFeed(id) {
            this.changeUrl(`/feed/${id}`);
        },

        /**
         * 删除动态
         * DELETE /feeds/:feed
         */
        deleteFeed() {
            const url = createAPI(`feeds/${this.feed.id}`);
            addAccessToken().delete(url).then(res => {
                this.updateList();
            }).catch(({ response: { data = { message: '删除动态失败, 请刷新后重试' } } }) => {
                this.$Message.error(this.$MessageBundle(data).getMessage());
            })
        },

        /**
         * 删除评论
         * DELETE /feeds/:feed/comments/:comment
         */
        deleteComment(id) {
            const url = createAPI(`feeds/${this.feed.id}/comments/${id}`);
            addAccessToken().delete(url).then(res => {
                console.log(res);
            }).catch(({ response: { data = { message: '删除评论失败, 请刷新后重试' } } }) => {
                this.$Message.error(this.$MessageBundle(data).getMessage());
            })
        },

        /**
         * 置顶评论
         * POST /feeds/:feed/comments/:comment/pinneds
         */
        pinnedComment({ id, day, amount, callback }){
          if (id) {
            addAccessToken().post(createAPI(`feeds/${this.feed.id}/comments/${id}/pinneds`),{
              day,
              amount
            }).then(({data})=>{
              this.$Message.info(this.$MessageBundle(data).getMessage());
              callback();
            }).catch(({response: { data = { message: "操作失败, 请刷新后重试"}} = {}})=>{
              this.$Message.error(this.$MessageBundle(data).getMessage());
              callback();
            })
          }
        },

        /**
         * 置顶资讯
         * /feeds/:feed/pinneds
         */
        pinnedFeed({ id, day, amount, callback }){
          if (id) {

            addAccessToken().post(createAPI(`feeds/${this.feed.id}/pinneds`),{
              day,
              amount
            }).then(({data})=>{
              this.$Message.info(this.$MessageBundle(data).getMessage());
              callback();
            }).catch(({response: { data = { message: "操作失败, 请刷新后重试"}} = {}})=>{
              this.$Message.error(this.$MessageBundle(data).getMessage());
              callback();
            })
          }
        }
    },
    computed: {
      sex(){
        return this.user.sex;
      },
      avatar(){
        return this.user.avatar;
      },
      isOwn(){ 
        return this.feed.user_id === window.TS_WEB.currentUserId;
      },
      isDigg(){
        return this.feed.has_like;
      },
      has_collection() {
        return this.feed.has_collect;
      },
      timer () {
        return this.timers(this.feed.created_at, 8, false);
      },
      // 检测动态展开输入框
      ...mapState({
        commentFeed: state => state.commentInput.commentFeed,
        showPopup: state => state.commentInput.showPopup
      })
    },
    created(){
      this.$store.dispatch('GET_USER_BY_ID', [this.feed.user_id]).then((user)=>{
        console.log('Feed init:',this.feed.user_id, user);
        this.user = {...this.user, ...user}
      }, (err)=>{
        console.log(err);
      });
    }
  }

  export default feedinfo;
</script>

<style lang="scss" module>
  .detail {
    background-color: #fff;
    margin-bottom: 6px;
    padding: 10px 0 0;
    &:active, &:focus {
      background-color: #fff;
    }
    .detailAvatar {
      padding: 0 2vw; 
    }
    .detailContentBefore {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .detailUsername {
        color: #333;
        font-size: 16px;
      }
      .detailTimer {
        text-align: right;
        color: #ccc;
        font-size: 12px;
      }
    }
    .detailFeedContent {
      width: 80vw;
      .detailContent {
        font-size: 14px;
        color: #666;
        text-align: initial;
        overflow: hidden;
        text-overflow: ellipsis;  
        display: -webkit-box;  
        -webkit-line-clamp: 3;  
        -webkit-box-orient: vertical;
        word-break: break-all;
        margin: 4px 0 12px 0;
      }
    }
  }
</style>

<style>
      .feed-footer {
        padding: 10px 10px 10px 48px;
        border-top: 1px #ededed solid;
    }
    .pinned-icon{
        display: inline-block;
        border: 1px solid #4bb893;
        padding: 0 5px;
        color: #4bb893;
        font-style: normal;
        font-size: 12px;
        line-height: 14px;
        vertical-align: middle;
    }
</style>