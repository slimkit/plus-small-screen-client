<template>
    <div class="feed-tool">
        <!-- 工具栏 -->
        <div class="tool">
            <!-- 点赞 -->
            <div class="tool-item">
                <digg-icon @click.native='handleLike' v-if='is_like' width="21" height="21" color="#f4504d"></digg-icon>
                <un-digg-icon @click.native='handleLike' v-else width="21" height="21" color="#999"></un-digg-icon>
                <span class="count feed-like-count">{{ like_count || 0 }}</span>
            </div>
            <!-- /点赞 -->
            <!-- 评论 -->
            <div class="tool-item">
                <comment-icon @click.native='handleComment' width="21" height="21" color="#999"></comment-icon>
                <span class="count feed-comment-count">{{ comment_count || 0 }}</span>
            </div>
            <!-- /评论 -->
            <!-- 浏览 -->
            <div class="tool-item">
                <view-icon @click.native='handleView' width="21" height="21" color="#999"></view-icon>
                <span class="count feed-view-count">{{ view_count || 0 }}</span>
            </div>
            <!-- /浏览 -->
            <!-- 更多操作 -->
            <div class="tool-item">
                <more-icon @click.native='handleMore' width="21" height="21" color="#999" />
            </div>
            <!-- /更多操作 -->
        </div>
    </div>
</template>
<script>
import MoreIcon from '../../../../icons/More';
import DiggIcon from '../../../../icons/Digg';
import ViewIcon from '../../../../icons/View';
import UnDiggIcon from '../../../../icons/UnDigg';
import CommentIcon from '../../../../icons/Comment';
const F = () => {};
export default {
    name: 'feed-tool',
    components: {
        MoreIcon,
        DiggIcon,
        ViewIcon,
        UnDiggIcon,
        CommentIcon,
    },
    props: {
        feed: Object,
        is_like: Boolean,
        like_count: [Number, String],
        view_count: [Number, String],
        comment_count: [Number, String],
    },
    data() { return({}) },
    computed: {},
    methods: {
        handleLike() {
            this.$emit('handleLike');
        },
        handleView() {
            this.$emit('handleView');
        },
        handleComment() {
            this.$emit('handleComment', 1);
        },
        handleMore() {
            this.$emit('handleMore');
        }
    }
}
</script>
<style lang='less'>
.feed-tool {
    width: 100%;
    .tool {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .tool-item {
            width: 25%;
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
            &:last-child {
                width: auto;
            }
        }
    }
}
</style>