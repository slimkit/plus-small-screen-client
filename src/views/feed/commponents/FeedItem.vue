<template>
    <div class="feed-item">
        <slot name='feed-item-anchor'></slot>
        <div class="feed-item-main">
            <div class="user-header">
                <user-avatar :sex='user.sex' :src='user.avatar' size='small' @click.native="changeUrl(`/users/feeds/${user.id}`)" />
            </div>
            <div class="feed-item-content" @click.stop="viewFeed">
                <div tag='div' class="user-info" @click.stop='changeUrl(`/users/feeds/${user.id}`)'>
                    {{user.name}}
                    <div>
                        <i class="feed-pinned-icon" v-if='is_pinned'>置顶</i>
                        <timeago class="feed-time" :since="time" locale="zh-CN" :auto-update="60" />
                    </div>
                </div>
                <div class="fd-content" v-html="content.replace(/\n/g,'<br/>')"></div>
                <feed-images v-show="feed.images.length > 0" :storages="feed.images" :feed="feed.id"></feed-images>
            </div>
        </div>
        <div class="feed-item-footer">
            <!-- 工具栏 -->
            <feed-tool :is_like='is_like' :like_count='like_count' :view_count='view_count' :comment_count='comment_count' @handleLike='likeFeed' @handleView='viewFeed' @handleComment='commentInput' @handleMore='moreAction' />
            <!-- /工具栏 -->
            <!-- 评论列表 -->
            <div class="feed-comments-list" v-if='comment_count > 0'>
                <feed-comment-item v-for='comment in comments' :key='`feed-${feed.id}-comment-${comment.id}`' :id='`feed-${feed.id}-comment-${comment.id}`' :comment='comment' @handleCommentInput='commentInput' :isMine='comment.user_id === mine.id'></feed-comment-item>
            </div>
            <p class="feed-comments-more" v-if='comment_count > 5' @click.stop='viewFeed'>查看全部评论</p>
            <!-- /评论列表 -->
            <!-- 评论编辑框 -->
            <feed-comment-editor v-model='typing' @handleCommentInput='commentInput' @handleCommentFeed='commentsFeed' :placeholder='placeholder' :maxlength='255' />
            <!-- /评论编辑框 -->
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import timers from '../../../utils/timer';
import { changeUrl } from '../../../utils/changeUrl';

import FeedTool from './FeedTools/FeedTool';
import FeedImages from '../../../components/FeedImages';
import FeedCommentItem from './FeedComments/FeedCommentItem';
import FeedCommentEditor from './FeedComments/FeedCommentEditor';

import { addAccessToken, createAPI } from '../../../utils/request';
export default {
    name: 'feed-item',
    components: {
        FeedTool,
        FeedImages,
        FeedCommentItem,
        FeedCommentEditor
    },
    props: {
        feed: Object
    },
    data() {
        return({
            user: {},
            reply_user: null,
            placeholder: '随便说说',
        })
    },
    computed: {
        /**
         * state
         */
        ...mapState({
            mine: state => state.users.mine,
            showPopup: state => state.commentInput.showPopup,
        }),
        /**
         * 是否显示输入框
         */
        typing() { return this.feed.id === this.$store.getters.commentInputId },
        /**
         * 内容
         */
        content() { return this.feed.feed_content || '' },

        /**
         * 时间
         */
        time() { return this.timers(this.feed.created_at, 8, false) },

        /**
         * 是否点赞
         */
        is_like() { return this.feed.has_like },

        /**
         * 点赞数
         */
        like_count() { return this.feed.like_count },

        /**
         * 浏览数
         */
        view_count() { return this.feed.feed_view_count },

        /**
         * 评论
         */
        comments() { return this.feed.comments.slice(0, 5) || [] },

        /**
         * 评论数
         */
        comment_count() { return this.feed.feed_comment_count },

        /**
         * 是否为自己的动态
         */
        isMine() { return this.feed.user_id === mine.id },

        /**
         * 是否置顶
         */
        is_pinned() { return this.feed.pinned },
    },
    methods: {
        timers,
        changeUrl,

        /**
         * 点赞
         */
        likeFeed() {
            let
                like = !this.is_like,
                method = this.is_like ? 'DELETE' : 'POST',
                count = this.is_like ? this.like_count - 1 : this.like_count + 1,
                url = this.is_like ? `feeds/${this.feed.id}/unlike` : `feeds/${this.feed.id}/like`;
            addAccessToken()({
                method,
                url: createAPI(url)
            }).then(() => {
                this.feed.has_like = like;
                this.feed.like_count = count;
                // this.$store.dispatch('UPDATE_FEED_BY_ID', this.feed);
            }).catch(({ response: { data = { message: '点赞失败' } } = {} }) => {
                this.$Message.error(this.$MessageBundle(data).getMessage());
            });
        },

        /**
         * 评论
         */
        commentsFeed(txt, cb) {
            if(txt && typeof txt === 'string') {
                const group_post_comment_mark = new Date().getTime() + '' + this.user.id,
                    reply_user = this.reply_user,
                    params =
                    reply_user ? {
                        body: txt,
                        reply_user,
                        group_post_comment_mark,
                    } : {
                        body: txt,
                        group_post_comment_mark,
                    };
                addAccessToken().post(createAPI(`feeds/${this.feed.id}/comments`), {
                    ...params
                }).then(({ data: { comment } }) => {
                    this.feed.comments.unshift(comment);
                    cb && cb();
                }).catch(err => {
                    error(err);
                });
            } else {
                this.$Message.warning('评论内容不能为空');
                return false;
            }
        },

        /**
         * 浏览
         */
        viewFeed() {
            this.changeUrl(`/feed-detail/${this.feed.id}`);
        },

        /**
         * 删除自己的评论
         */
        deleteComment() {},

        /**
         * 删除自己的动态
         */
        deleteFeed() {},

        /**
         * 更多
         */
        moreAction() {},

        /**
         * 显示评论输入框
         */
        commentInput({ placeholder, reply_user } = {}) {
            this.placeholder = placeholder || '随便说说';
            this.reply_user = reply_user;
            const id = this.typing ? -1 : this.feed.id;
            this.$store.commit('SET_INPUT_ID', id);
        },
    },
    created() {
        this.$store.dispatch('GET_USER_BY_ID', this.feed.user_id).then((user) => {
            this.user = user[0];
        }, (err) => {
            console.log(err);
        });
    }
}
</script>
<style lang='less'>
.feed-item {
    overflow: hidden;
    position: relative;
    margin-bottom: 6px;
    width: 100%;
    background-color: #fff;
    +.feed-item {
        margin-top: 10px;
    }
    a.feed-item-anchor {
        position: absolute;
        top: -46px;
    }
    .feed-pinned-icon {
        display: inline-block;
        border: 1px solid #4bb893;
        padding: 0 5px;
        color: #4bb893;
        font-style: normal;
        font-size: 12px;
        line-height: 14px;
        vertical-align: middle;
    }
    .feed-item-main {
        display: flex;
        align-items: flex-start;
        padding: 10px;
        .user-header {
            flex: 0 0 auto;
            overflow: hidden;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            img {
                width: 100%
            }
        }
        .feed-item-content {
            margin-left: 10px;
            flex: 1 1 auto;
            .user-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                line-height: 1.3;
                .feed-item-time {
                    color: #ccc;
                    font-size: 12px;
                }
            }
            .fd-content {
                font-size: 14px;
                color: #666;
                text-align: initial;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                word-break: break-all;
            }
        }
    }

    .feed-item-footer {
        padding: 10px 10px 10px 48px;
        border-top: 1px #ededed solid;
    }

    .feed-comments-list {
        padding: 10px 0 0
    }
    .feed-comments-more{
        font-size: 12px;
        line-height: 1.5;
    }
}
</style>