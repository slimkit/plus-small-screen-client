<template>
    <div class="feed-item" @click='viewFeed'>
        <v-avatar sex='user.sex' :src='user.avatar' class='feed-item-avatar' v-if='!no_user' @click.native.stop='to(`/user/${user.id}`)'>
            {{ user.name.slice(0, 1) }}
        </v-avatar>
        <div v-else class="feed-item-time">{{ time | time2txt }}</div>
        <div class="feed-item-content">
            <div class="feed-item-content-info" v-if='!no_user' @click.stop='to(`/user/${user.id}`)'>
                <span>{{ user.name }}</span>
                <div>
                    <i class="feed-item-content-info-pinned-icon" v-if='is_pinned'>置顶</i>
                    <template>
                        <!-- <timeago class="feed-item-content-info-time" :since="time" :auto-update="60" /> -->
                        <!-- # todo -->
                        <span class="feed-item-content-info-time">
                            {{ time | time2tips }}
                        </span>
                    </template>
                </div>
            </div>
            <template v-if='text.length > 0 '>
                <div class="feed-item-content-text">
                    <template v-if='is_pay && text.length > 50'>
                        <span>{{ text.slice(0, 50) }}</span>
                        <span class="blur">{{ '魑魅魍魉魑魅魍魉魑魅' }}</span>
                    </template>
                    <template v-else>
                        {{ text }}
                    </template>
                </div>
            </template>
            <template v-if='images.length > 0'>
                <feed-images :imgs='images' @viewPic='viewPic' class='feed-item-content-imgs'></feed-images>
            </template>
        </div>
        <div class="feed-item-foot">
            <feedTool :has_like='has_like' :like_count='like_count' :comment_count='comment_count' @likeFeed='likeFeed' @moreAction='moreAction' @commentFeed='commentFeed'></feedTool>
        </div>
        <template v-if='comment_count > 0'>
            <div class="feed-item-comments">
                <feed-comment-item v-for='comment in comments' v-if='comment.id' :comment='comment' :key='`feed-${feed.id}-comment-${comment.id}`' @action='commentAction' />
            </div>
        </template>
    </div>
</template>
<script>
import { formatNum } from '../../util/';
import feedTool from './components/feedTool';
import feedImages from './components/feedImages';
import feedCommentItem from './components/feedCommentItem';

import showCommentInput from './commentInput';
export default {
    name: 'feedItem',
    components: {
        feedTool,
        feedImages,
        feedCommentItem,
    },
    props: {
        feed: {
            type: Object,
            required: true
        },
        no_user: Boolean,
        is_pinned: {
            type: Boolean,
            default: true
        },
        is_pay: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {}
    },
    computed: {
        user() {
            return this.feed.user;
        },
        time() {
            return this.feed.created_at.replace(/-/g, '/');
        },
        text() {
            let r = (this.feed.feed_content || '').slice(0, 59);
            return r.length < 59 ? r : r + '...';
        },
        images() {
            return this.feed.images || [];
        },
        has_like() {
            return this.feed.has_like || false;
        },
        like_count() {
            return formatNum(this.feed.like_count) || 0;
        },
        comments() {
            return this.feed.comments.slice(0, 5);
        },
        comment_count() {
            return formatNum(this.feed.feed_comment_count) || 0
        },
        has_collect() {
            return this.feed.has_collect || false;
        }
    },
    methods: {
        to(path) {
            if(path) {
                this.$router.push({ path });
            }
        },
        /**
         * 查看动态
         *     @author jsonleex <jsonlseex@163.com>
         */
        viewFeed() {
            this.to(`/feed-detail/${this.feed.id}`);
        },
        /**
         * 查看图片
         *     @author jsonleex <jsonlseex@163.com>
         */
        viewPic(id) {
            console.log('查看图片', id);
        },
        /**
         * 点赞
         *     @author jsonleex <jsonlseex@163.com>
         */
        likeFeed() {
            console.log('点赞');
        },
        /**
         * 评论 
         *     @author jsonleex <jsonlseex@163.com>
         */
        commentFeed() {
            this.showCommentInput();
        },
        /**
         * 显示更多操作
         *     @author jsonleex <jsonlseex@163.com>
         */
        moreAction() {
            console.log('显示更多操作');
            this.$Modal.confirm({
                showCancel: true,
                render(h) {
                    return [h('button', {
                            on: {
                                click: (e) => {
                                    console.log(e.target.innerHTML);
                                }
                            }
                        }, '分享'),
                        h('button', {
                            on: {
                                click: (e) => {
                                    console.log(e.target.innerHTML);
                                }
                            }
                        }, `${this.has_collect ? '取消收藏' : '收藏'}`)
                    ]
                }
            })
        },
        /**
         * 评论操作
         *     @author jsonleex <jsonlseex@163.com>
         */
        commentAction(id, name) {
            // todo 判断是否位当前用户
            const placeholder = name && id ? `回复${name}` : '随便说说';
            this.showCommentInput({
                placeholder,
                onOk(txt) {
                    console.log(12345);
                }
            })
        },

        /**
         *  显示评论输入框
         */
        showCommentInput(options) {
            showCommentInput.show(options);
        }
    }
}
</script>
<style lang='less' socped>
@feed-item-prefix: feed-item;

.@{feed-item-prefix} {
    background: #fff;
    padding: 30px 20px;
    font-size: 30px;
    +.feed-item {
        margin-top: 10px;
    }
    &-avatar {
        float: left;
    }
    &-content {
        margin-left: 20+38*2px;
        &-info {
            display: flex;
            justify-content: space-between;
            font-size: 26px;
            color: #333;
            &-time {
                margin-left: 10px;
                font-size: 24px;
                color: #ccc
            }
            &-pinned-icon {
                display: inline-table;
                font-size: 22px;
                color: #4bb893;
                width: 62px;
                height: 30px;
                text-align: center;
                border: 1px solid currentColor;
                /*no*/
            }
        }
        &-info+&-text {
            margin-top: 25px;
        }
        &-text {
            width: 100%;
            font-size: 30px;
            line-height: 1.4;
            overflow: hidden;
            .blur {
                color: transparent;
                text-shadow: 0 0 10px #999;
            }
        }
        &-text+&-imgs {
            margin-top: 25px;
        }
    }
    &-foot {
        margin: 20px -20px 0;
        padding: 0 20px 0 116px;
        height: 90px;
        border-top: 1px solid #ededed;
        /*no*/
        &:last-child {
            margin-bottom: -30px;
        }
    }
    &-comments {
        padding: 0 0 0 96px;
    }
    &-time {
        max-width: 96px;
        float: left;
    }
}
</style>