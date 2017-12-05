<template>
    <div class="feed_tool">
        <div class="feed_tool_item" :class='{has_like}' @click.stop='likeFeed'>
            <v-icon :type='`${ has_like ? "feed-like":"feed-unlike"}`' class='feed_tool_icon'></v-icon>
            <span>{{ like_count }}</span>
        </div>
        <div class="feed_tool_item" @click.stop='commentFeed'>
            <v-icon type='feed-comment' class='feed_tool_icon'></v-icon>
            <span>{{ comment_count }}</span>
        </div>
        <div class="feed_tool_item">
            <v-icon type='feed-eye' class='feed_tool_icon'></v-icon>
            <span>{{ like_count }}</span>
        </div>
        <div class="feed_tool_item" @click.stop='moreAction'>
            <v-icon type='feed-more' class='feed_tool_icon'></v-icon>
        </div>
    </div>
</template>
<script>
const isNum = {
    validator(val) {
        return typeof(+val) === 'number';
    }
};
export default {
    name: 'feedTool',
    props: {
        has_like: {
            type: Boolean,
            default: false,
            required: true
        },
        like_count: {
            type: [Number, String],
            required: true,
            ...isNum
        },
        comment_count: {
            type: [Number, String],
            required: true,
            ...isNum
        }
    },
    methods: {
        likeFeed() {
            this.$emit('likeFeed');
        },
        commentFeed() {
            this.$emit('commentFeed');
        },
        moreAction() {
            this.$emit('moreAction');
        }
    }
}
</script>
<style lang='less' scoped>
@prefix: feed_tool;
.@{prefix} {
    width: 100%;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &_item {
        display: flex;
        color: #b3b3b3;
        font-size: 24px;
        align-items: center;
        span {
            margin-left: 10px;
        }
        &.has_like{
            color: #f4504d
        }
    }
    &_icon {
        width: 40px;
        height: 40px;
    }
}
</style>