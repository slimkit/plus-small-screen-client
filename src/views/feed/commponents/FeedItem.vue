<template>
    <div class="feed-item" v-if='feed.id > 0'>
        <slot name='feed-item-anchor'></slot>
        <div class="feed-item-main">
            <div class="user-header">
                <user-avatar :sex='user.sex' :src='user.avatar' size='small' @click.native="changeUrl(`/users/feeds/${user.id}`)" />
            </div>
            <div class="feed-item-content" @click.stop="isLogin(viewFeed)">
                <div tag='div' class="user-info" @click.stop='changeUrl(`/users/feeds/${user.id}`)'>
                    {{user.name}}
                    <div>
                        <i class="feed-pinned-icon" v-if='is_pinned'>置顶</i>
                        <timeago class="feed-time" :since="time" locale="zh-CN" :auto-update="60" />
                    </div>
                </div>
                <template @click.stop="isLogin(viewFeed)">
                    <div class="fd-content" v-html="content.replace(/\n/g,'<br/>')"></div>
                </template>
                <feed-images v-show="feed.images.length > 0" :storages="feed.images" :feed="feed.id"></feed-images>
            </div>
        </div>
        <div class="feed-item-footer">
            <!-- 工具栏 -->
            <feed-tool :is_like='is_like' :like_count='like_count' :view_count='view_count' :comment_count='comment_count' @handleLike='isLogin(likeFeed)' @handleView='isLogin(viewFeed)' @handleComment='isLogin(commentInput)' @handleMore='moreAction' />
            <!-- /工具栏 -->
            <!-- 评论列表 -->
            <div class="feed-comments-list" v-if='comment_count > 0'>
                <feed-comment-item v-for='comment in comments' :key='`feed-${feed.id}-comment-${comment.id}`' :id='`feed-${feed.id}-comment-${comment.id}`' :comment='comment' @handleCommentInput='isLogin(commentInput)' :isMine='comment.user_id === mine.id' @deleteComment='moreAction'></feed-comment-item>
            </div>
            <p class="feed-comments-more" v-if='comment_count > 5' @click.stop='isLogin(viewFeed)'>查看全部评论</p>
            <!-- /评论列表 -->
            <!-- 评论编辑框 -->
            <feed-comment-editor v-model='typing' @handleCommentInput='isLogin(commentInput)' @handleCommentFeed='commentsFeed' :placeholder='placeholder' :maxlength='255' />
            <!-- /评论编辑框 -->
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import timers from '../../../utils/timer';
import { changeUrl } from '../../../utils/changeUrl';
import { friendNum } from '../../../utils/friendNum';

import FeedTool from './FeedTools/FeedTool';
import FeedImages from '../../../components/FeedImages';
import FeedCommentItem from './FeedComments/FeedCommentItem';
import FeedCommentEditor from './FeedComments/FeedCommentEditor';

import { showAmount } from '../../../utils/balance';
import { SHOWPOPUP, SHOWPINNEDMODAL } from '../../../stores/types';
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
            goldName: window.TS_WEB.goldName,
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
        like_count() { return friendNum(this.feed.like_count) },

        /**
         * 浏览数
         */
        view_count() { return friendNum(this.feed.feed_view_count) },

        /**
         * 评论
         */
        comments() { return this.feed.comments.slice(0, 5) || [] },

        /**
         * 评论数
         */
        comment_count() { return friendNum(this.feed.feed_comment_count) },

        /**
         * 是否收藏
         */
        has_collection() { return this.feed.has_collect },

        /**
         * 是否为自己的动态
         */
        isMine() { return this.feed.user_id === this.mine.id },

        /**
         * 是否置顶
         */
        is_pinned() { return this.feed.pinned },

        /**
         * 是否登录
         */
        TOKEN() { return this.mine.token || null },
    },
    methods: {
        timers,
        changeUrl,

        isLogin(fn) {
            if(this.TOKEN) {
                return fn()
            } else {
                this.$Message.destroy();
                this.$Message.error('您还没有登录, 登录后才能操作');
                return false
            }
        },

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
                this.$Message.destroy();
                this.$Message.error(this.$MessageBundle(data).getMessage());
            });
        },

        /**
         * 评论
         */
        commentsFeed(txt, cb) {
            this.isLogin(() => {
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
                        this.feed.feed_comment_count++;
                        cb && cb();
                    }).catch(err => {
                        error(err);
                    });
                } else {
                    this.$Message.warning('评论内容不能为空');
                    return false;
                }
            })
        },

        /**
         * 浏览
         */
        viewFeed() {
            if(this.feed.paid_node && !this.feed.paid_node.paid) {
                this.$Modal.confirm({
                    title: '付费支付',
                    content: `<p>需要支付${showAmount(this.feed.paid_node.amount)}${this.goldName}</p>`,
                    okText: '确认支付',
                    loading: true,
                    onOk: () => {
                        addAccessToken().post(createAPI(`purchases/${this.feed.paid_node.node}`), {
                            validateStatus: status => status === 201
                        }).then(() => {
                            this.$Modal.remove();
                            this.$Message.success('支付成功');

                            this.feed.paid_node.paid = true;
                            this.changeUrl(`/feed-detail/${this.feed.id}`);
                        }).catch(({ response: { data, status } = {} }) => {
                            this.$Modal.remove();
                            this.$Message.error(this.$MessageBundle(data).getMessage());
                        })
                    }
                });
                return false;
            }

            this.changeUrl(`/feed-detail/${this.feed.id}`);
        },

        /**
         * 删除自己的评论
         */
        deleteComment(id) {
            const url = createAPI(`feeds/${this.feed.id}/comments/${id}`);
            addAccessToken().delete(url).then(res => {
                this.feed.comments = _.dropWhile(this.feed.comments, (c) => c.id === id);
                this.feed.feed_comment_count--;
            }).catch(({ response: { data = { message: '删除评论失败, 请刷新后重试' } } }) => {
                this.$Message.error(this.$MessageBundle(data).getMessage());
            })
        },

        /**
         * 删除自己的动态
         */
        deleteFeed() {
            const url = createAPI(`feeds/${this.feed.id}`);
            addAccessToken().delete(url).then(res => {
                this.feed.id = -1;
            }).catch(({ response: { data = { message: '删除动态失败, 请刷新后重试' } } }) => {
                this.$Message.error(this.$MessageBundle(data).getMessage());
            })
        },

        /**
         * 收藏动态
         */
        collectionFeed(type) {
            const method = type === 'collection' ? 'POST' : 'DELETE',
                url = method === 'POST' ?
                `feeds/${this.feed.id}/collections` :
                `feeds/${this.feed.id}/uncollect`;
            addAccessToken()({
                method,
                url: createAPI(url),
                validateStatus: status => status === 201 || status === 204
            }).then(response => {
                this.feed.has_collect = !this.feed.has_collect;
                this.$Message.success(method === 'POST' ? '收藏成功' : '取消收藏');
            }).catch(({ response: { data = { message: "操作失败, 请刷新后重试" } } }) => {
                this.$Message.error(this.$MessageBundle(data).getMessage());
            })
        },

        /**
         * 评论置顶申请
         */
        commentPinned({ id, day, amount, callback }) {
            if(id) {
                addAccessToken().post(createAPI(`feeds/${this.feed.id}/comments/${id}/pinneds`), {
                    day,
                    amount
                }).then(({ data }) => {
                    this.$Message.info(this.$MessageBundle(data).getMessage());
                    callback();
                }).catch(({ response: { data = { message: "操作失败, 请刷新后重试" } } = {} }) => {
                    this.$Message.error(this.$MessageBundle(data).getMessage());
                    callback();
                })
            }
        },

        /**
         * 动态置顶申请
         */
        feedPinned({ id, day, amount, callback } = {}) {
            if(id) {
                addAccessToken().post(createAPI(`feeds/${this.feed.id}/pinneds`), {
                    day,
                    amount
                }).then(({ data }) => {
                    this.$Message.info(this.$MessageBundle(data).getMessage());
                    callback();
                }).catch(({ response: { data = { message: "操作失败, 请刷新后重试" } } = {} }) => {
                    this.$Message.error(this.$MessageBundle(data).getMessage());
                    callback();
                })
            }
        },

        /**
         * 更多
         */
        moreAction(options) {
            options = Object.assign({}, {
                feedID: this.feed.id || null,
                type: '',
                isOwn: this.isMine,
                has_collection: this.has_collection,
                deleteFeed: this.deleteFeed,
                deleteComment: this.deleteComment,
                handleCollection: this.collectionFeed,
                showPinnedModal: this.showPinnedModal
            }, options) || {};

            this.$store.dispatch(SHOWPOPUP, cb => {
                cb({
                    show: true,
                    ...options,
                });
            })
        },

        /**
         * 显示评论输入框
         */
        commentInput({ placeholder, reply_user } = {}) {
            this.placeholder = placeholder || '随便说说';
            this.reply_user = reply_user;
            const id = this.typing ? -1 : this.feed.id;
            this.$store.commit('SET_INPUT_ID', id);
        },

        showPinnedModal(type, id) {
            this.$store.dispatch(SHOWPINNEDMODAL, cb => {
                cb({
                    show: true,
                    ID: id,
                    pinned: (options) => {
                        return type === 1 ? this.feedPinned(options) : this.commentPinned(options);
                    }
                })
            });
        }
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
    .feed-comments-more {
        font-size: 12px;
        line-height: 1.5;
    }
}
</style>