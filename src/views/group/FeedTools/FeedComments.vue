<template>
    <div class="feed-comments">
        <ul class="feed-comments-list" v-if='comments.length > 0'>
            <li v-for='(comment, index) in formatComment' :key="`feed-${feedID}-comment-${comment.id}`">
                <p class="feed-comment-row">
                    <!-- 回复用户 -->
                    <router-link class="userName" :to="{ path: `/users/feeds/${comment.user_id}` }">
                        {{ getUserName(comment.user_id) }}
                    </router-link>
                    <!-- 被回复用户 -->
                    <span v-if="comment.reply_user">
                        回复
                        <router-link class="userName" :to="{ path: `/users/feeds/${comment.reply_user}` }">
                            {{ getUserName(comment.reply_user) }}
                        </router-link>
                    </span>
                    <!-- 回复他人 或者 删除自己的评论 -->
                    <span class="comment_content" v-if="comment.user_id  != currentUser" @click.stop="replySomeOne(comment.user_id)">: {{ comment.body }} <i class="pinned-icon" v-if='comment.pinned'>置顶</i></span>
                    <span class="comment_content" v-else @click.stop="handleDeleteComment(comment.id)">: {{ comment.body }} <i class="pinned-icon" v-if='comment.pinned'>置顶</i></span>
                </p>
            </li>
        </ul>
        <div class="feed-comments-input" v-show='typing'>
            <textarea :placeholder="placeholder" v-model='comment_content' maxlength="255"></textarea>
            <div class="feed-comments-action">
                <p class="feed-comments-count-tips" v-if='comment_content.length > 200'>
                    <span>{{comment_content.length}}</span>/255</p>
                <Button type="ghost" size="small" @click="handleCommentInput">取消</Button>
                <Button type="primary" size="small" :disable='!(len > 0)' @click.stop='sendComment'>发送</Button>
            </div>
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
import { USERS, ADD_USER_TO_VUEX } from '../../../stores/types';
export default {
    name: 'feed-comments',
    props: {

        /**
         * 动态ID
         * @type {Number}
         */
        feedID: { required: true },

        /**
         * 动态评论列表
         * @type {Array}
         */
        comments: { type: Array, required: true },

        /**
         * 输入框显示状态
         * @type {Boolean}
         */
        typing: { type: Boolean, required: true },

        /**
         * 改变输入框显示状态
         * @type {Function}
         */
        handleCommentInput: { type: Function, required: true },

        /**
         * 发表评论
         * @type {Function}
         */
        handleComment: { type: Function, required: true },

        /**
         * 删除评论
         * @type {Function}
         */
        handleDeleteComment: { type: Function, required: true },
    },
    data() {
        return({
            comment_content: '',
            reply_user: null,
            comment_users: {}
        });
    },
    computed: {
        placeholder() {
            return this.reply_user ? `回复: ${this.getUserName(this.reply_user)}` : '随便说说';
        },
        len() {
            return this.comment_content.length;
        },
        currentUser() {
            return(this.$storeLocal.get('UserLoginInfo') || {}).user_id;
        },
        formatComment() {
            return _.orderBy(this.comments, []).slice(0, 5);
        }
    },
    watch: {
        typing(val) {
            if(!val) {
                this.reply_user = null;
                this.comment_content = '';
            }
        }
    },
    methods: {
        getUserName(uid) {
            return(this.comment_users[`user_${uid}`] || {}).name || '';
        },
        sendComment() {
            this.handleComment({
                content: this.comment_content,
                reply_user: this.reply_user,
                success: (comment) => {
                    // 此处有坑!!! 直接修改 props
                    this.comments.unshift(comment);
                    this.handleCommentInput();
                },
                error: ({ response: { data = { message: '评论失败!' } } }) => {
                    this.$Message.error(this.$MessageBundle(data).getMessage());
                }
            });
        },

        replySomeOne(id) {
            this.reply_user = id;
            this.handleCommentInput();
        }
    },
    created() {
        this.comments.forEach(({ user_id, target_user, reply_user }) => {
            [user_id, target_user, reply_user].forEach((uid) => {
                this.$store.dispatch('GET_USER_BY_ID', uid).then(data => {
                    this.comment_users = {
                        ...this.comment_users,
                        [`user_${uid}`]: data,
                    };
                });
            });
        });
    }
}
</script>
<style lang='less' scoped>
.feed-comments {
    .feed-comment-row {
        overflow: hidden;
        max-width: 100%;
        max-height: 55px;
        font-size: 14px;
        line-height: 1.3;
        .userName {
            color: #333;
            font-size: 14px;
            &:not(:first-chlid) {
                margin-left: 3px;
                margin-right: 3px;
            }
        }
        .comment_content {
            color: #999;
            font-size: 14px;
        }
    }
    .feed-comments-input {
        textarea {
            border: 0;
            border-bottom: 1px solid #59b6d7;
            height: auto;
            line-height: 1;
            font-size: 14px;
            outline: none;
            resize: none;
            width: 100%;
            padding-top: 10px;
        }
        .feed-comments-action {
            text-align: right;
            .ivu-btn-primary {
                border-color: #59b6d7;
                background-color: #59b6d7;
            }
        }
    }
}
</style>