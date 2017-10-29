<template>
    <div class="group-feed-tool">
        <div class="tool">
            <div class="tool-item">
                <feed-like :feedID='feed.id' :isDigg='isDigg' :count="feedLikeCount" :upvote='upvote' />
            </div>
            <div class="tool-item">
                <feed-comment :feedID='feed.id' :count='feedCommentCount' :handleCommentInput="handleCommentInput" />
            </div>
            <div class="tool-item">
                <feed-view :feedID='feed.id' :viewFeed="viewFeed" :count='feedViewCount' />
            </div>
            <div class="tool-item">
                <MoreIcon @click.native='handleShowPopup()' width="21" height="21" color="#999" />
            </div>
        </div>
        <feed-comments 
        :typing='typing' 
        :feedID='feed.id' 
        :comments='feed.comments' 
        :handleComment='handleComment' 
        :handleCommentInput='handleCommentInput'
        :handleDeleteComment='handleDeleteComment'
        />
        <feed-more-action ref='moreAction' 
        :deleteComment='deleteComment'
        :deleteFeed='deleteFeed'
        :handleCollection='handleCollection' />
    </div>
</template>
<script>
import {
    SHOWPOPUP,
    CLOSEPOPUP,
    COMMENTINPUT,
    CLOSECOMMENTINPUT,
} from '../../stores/types';

import { mapState } from 'vuex';

import lodash from 'lodash';
import { friendNum } from '../../utils/friendNum';
import { goTo, changeUrl } from '../../utils/changeUrl';
import { createAPI, addAccessToken } from '../../utils/request';
import { getUsersInfo, getUserInfo } from '../../utils/user';

import FeedView from './FeedTools/FeedView';
import FeedLike from './FeedTools/FeedLike';
import FeedComment from './FeedTools/FeedComment';
import FeedComments from './FeedTools/FeedComments';
import FeedMoreAction from './FeedTools/FeedMoreAction';

import MoreIcon from '../../icons/More';

export default {
    components: {
        FeedLike,
        FeedView,
        MoreIcon,
        FeedComment,
        FeedComments,
        FeedMoreAction,
    },
    props: {
        feed: { type: Object },

        user: { type: Object },

        isOwn: { type: Boolean },

        has_collection: { type: Boolean },

        /**
         * 点赞/取消点赞
         * @type {Function}
         */
        upvote: { type: Function, required: true, },

        /**
         * 评论动态
         * @type {Function}
         */
        handleComment: { type: Function, required: true, },

        /**
         * 查看动态详情
         * @type {Function}
         */
        viewFeed: { type: Function, required: true },

        /**
         * 删除评论
         * @type {Object}
         */
        deleteFeed: { type: Function, required: true },

        /**
         * 删除评论
         * @type {Function}
         */
        deleteComment: { type: Function, required: true },

        /**
         * 收藏资讯
         * @type {Function}
         */
        handleCollection: { type: Function, required: true },
    },
    data: () => ({}),
    methods: {
        changeUrl,

        /**
         * 显示更多操作
         */
        handleShowPopup(options) {
            options = options || {
                type: 'feed',
                isOwn: this.isOwn,
                has_collection: this.has_collection
            };
            this.$refs.moreAction.handleShowPop(options);
        },

        /**
         * 关闭更多操作
         */
        handleClosePop(){
            this.$refs.moreAction.handleClosePop();
        },

        /**
         * 显示回复框 
         * 设置全局输入框的 index = 当前feedID
         */
        handleCommentInput() {
            if(this.typing) {
                this.$store.dispatch(CLOSECOMMENTINPUT)
            } else {
                this.$store.dispatch(COMMENTINPUT, cb => {
                    cb(this.feed.id);
                });
            }
        },

        /**
         * 删除评论
         */
        handleDeleteComment(id){
            this.handleShowPopup({
                type: 'comment',
                commentID: id
            });
        },

        /**
         * 格式化数字
         * @param  {Number} num
         * @return {Function}
         */
        friendnum(num) {
            return friendNum(num);
        },
    },

    // 数据结构不同 待优化处理
    computed: {
        /**
         * 动态点赞数
         * @return {String}
         */
        feedLikeCount() {
            let count = this.feed.diggs || this.feed.like_count || 0;
            return count < 1000 ? count : this.friendnum(count);
        },

        /**
         * 动态评论数
         * @return {String}
         */
        feedCommentCount() {
            let count = this.feed.comments_count || this.feed.feed_comment_count || 0;
            return count < 1000 ? count : this.friendnum(count);
        },

        /**
         * 动态浏览数
         * @return {String}
         */
        feedViewCount() {
            let count = this.feed.views || this.feed.feed_view_count || 0;
            return count < 1000 ? count : this.friendnum(count);
        },

        /**
         * 当前用户是否对当前资讯点赞
         * @return {Boolean}
         */
        isDigg() {
            return this.feed.has_like;
        },

        /**
         * 当前输入框
         * @type {Number}
         */
        ...mapState({
            commentFeed: state => state.commentInput.commentFeed,
        }),

        /**
         * 当前动态评论框输入状态
         * @return {Boolean}
         */
        typing() {
            return this.commentFeed === this.feed.id;
        }
    },
    created() {}
}
</script>
<style lang='scss'>
.group-feed-tool {
    padding-left: 15vw;
    padding-right: 2vw;
    padding-top: 3vw;
    padding-bottom: 3vw;
    border-top: 1px #ededed solid;
    width: 100vw;
    .tool {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .tool-item {
            width: 25%;
            &:last-child {
                width: auto;
            }
        }
    }
}

.feed-tool-item {
    display: flex;
    align-items: center;
    >* {
        flex: 0 0 auto;
    }
    .count {
        max-width: calc(100% - 21px);
        overflow: hidden;
        padding-left: 4px;
        font-style: normal;
        color: #999;
    }
}
</style>