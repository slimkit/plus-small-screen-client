<template>
    <div class="feed" :id="`feed-${feed.id}`">
        <div class="feed-main">
            <div class="user-header">
                <img :src="user.avatar" @click.stop="changeUrl(`/users/feeds/${user.user_id}`)">
            </div>
            <div class="feed-content" @click.stop="changeUrl(`/groups/${$route.params.id}/feed/${feed.id}`)">
                <p class="user-info" @click.stop="changeUrl(`/users/feeds/${user.user_id}`)">
                    {{user.name}}
                    <timeago class="feed-time" :since="timer" locale="zh-CN" :auto-update="60" />
                </p>
                <div class="fd-content" v-html="feed.content ? feed.content.replace(/\n/g,'<br/>') : feed.content">
                </div>
                <feed-images v-show="feed.images.length > 0" :storages="feed.images" :feed="feed.id"></feed-images>
            </div>
        </div>
        <div class="feed-footer">
            <feed-tool :user="user" :feed="feed" :isOwn='isOwn' :has_collection='has_collection' :openInput="feed.id == commentFeed ? true : false" :upvote='upvote' :viewFeed='viewFeed' :handleComment='handleComment' :handleCollection='handleCollection' :deleteFeed='deleteFeed' :deleteComment='deleteComment' />
        </div>
    </div>
</template>
<script>
import timers from '../../utils/timer';
import getUserInfo from '../../utils/user';
import { changeUrl } from '../../utils/changeUrl';
import axios, { createAPI, addAccessToken } from '../../utils/request';

import { mapState } from 'vuex';
import GroupFeedTool from './GroupFeedTool';
import FeedImages from '../../components/FeedImages';

import { USERS_APPEND, } from '../../stores/types';

import { resolveImage } from '../../utils/resource';
const defaultAvatar = resolveImage(require('../../statics/images/defaultAvatarx2.png'));

export default {
    name: 'group-feed',
    components: {
        'feed-images': FeedImages,
        'feed-tool': GroupFeedTool
    },
    props: {
        feed: { type: Object },
        updateList: { type: Function }
    },
    data: () => ({
        user: {}
    }),
    methods: {
        changeUrl,
        /**
         * 点赞/取消点赞
         * @param  {String} type  'like' || 'unlike'
         */
        upvote(type) {
            // POST /groups/{group}/posts/{post}/like
            let method = type === 'like' ? 'POST' : 'DELETE',
                url = createAPI(`groups/${this.$route.params.id}/posts/${this.feed.id}/like`);
            axios({
                method,
                url
            }).then().catch(({ response: { data = { message: '点赞失败' } } = {} }) => {
                this.$Message.error(this.$MessageBundle(data).getMessage());
            });
        },

        /**
         * 评论动态
         * @param  {String} txt
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
                    }
                axios.post(createAPI(`groups/${this.$route.params.id}/posts/${this.feed.id}/comments`), {
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
         * @return {[type]}
         */
        handleCollection(type) {
            const method = type === 'collection' ? 'POST' : 'DELETE';
            addAccessToken()({
                method,
                url: createAPI(`groups/${this.$route.params.id}/posts/${this.feed.id}/collection`),
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
            this.changeUrl(`/groups/${this.$route.params.id}/feed/${id}`);
        },

        /**
         * 删除动态
         * DELETE /groups/{group}/posts/{post}
         */
        deleteFeed() {
            const url = createAPI(`groups/${this.$route.params.id}/posts/${this.feed.id}`);
            addAccessToken().delete(url).then(res => {
                this.updateList();
            }).catch(({ response: { data = { message: '删除动态失败, 请刷新后重试' } } }) => {
                this.$Message.error(this.$MessageBundle(data).getMessage());
            })
        },

        /**
         * 删除评论
         * /groups/{group}/posts/{post}/comments/{comment}
         */
        deleteComment(id) {
            const url = createAPI(`groups/${this.$route.params.id}/posts/${this.feed.id}/comments/${id}`);
            addAccessToken().delete(url).then(res => {
                console.log(res);
            }).catch(({ response: { data = { message: '删除评论失败, 请刷新后重试' } } }) => {
                this.$Message.error(this.$MessageBundle(data).getMessage());
            })
        },

        timers,
        getUser() {
            let user = this.$storeLocal.get(`user_${this.feed.user_id}`);
            if(!user) {
                if(this.feed.user_id !== TS_WEB.currentUserId) {
                    getUserInfo(this.feed.user_id).then(user => {
                        this.user = { ...user };
                    });
                } else {
                    getLoggedUserInfo().then(user => {
                        this.user = { ...user };
                    });
                }

            } else {
                user.avatar = user.avatar ? user.avatar : defaultAvatar;
                this.$store.dispatch(USERS_APPEND, cb => {
                    cb(user)
                });
                this.user = { ...user };
            }
        }
    },
    computed: {
        isOwn() {
            return this.feed.user_id === window.TS_WEB.currentUserId;
        },
        has_collection() {
            return this.feed.has_collection;
        },
        timer() {
            return this.timers(this.feed.created_at, 8, false);
        },
        // 检测动态展开输入框
        ...mapState({
            commentFeed: state => state.commentInput.commentFeed,
        })
    },
    created() {
        this.getUser();
    }
}
</script>
<style lang="scss" scoped>
.feed {
    margin-bottom: 6px;
    overflow: hidden;
    width: 100%;
    background-color: #fff;
    .feed-main {
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
        .feed-content {
            margin-left: 10px;
            flex: 1 1 auto;
            .user-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                line-height: 1.3;
                .feed-time {
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
    .feed-footer {}
}
</style>