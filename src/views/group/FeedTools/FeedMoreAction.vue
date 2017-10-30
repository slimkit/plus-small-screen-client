<template>
    <mt-popup class='feed-more-action' v-model="show" position="bottom" @click='handleClosePop'>
        <template v-if='type==="comment"'>
            <Button size="large" type="text" :long="true">申请评论置顶</Button>
            <Button size="large" type="text" :long="true" @click='deleteComment(commentID)'>删除评论</Button>
        </template>
        <template v-if='type.indexOf("feed") > -1'>
            <Button v-if='has_collection' size="large" type="text" :long="true" @click='handleCollection("uncollection")'>取消收藏</Button>
            <Button v-else size="large" type="text" :long="true" @click='handleCollection("collection")'>收藏</Button>
            <template v-if='isOwn'>
                <Button v-if='type==="feed"' size="large" type="text" :long="true">申请动态置顶</Button>
                <Button size="large" type="text" :long="true" @click='deleteFeed'>删除动态</Button>
            </template>
        </template>
        <Button type="text" :long="true" @click='handleClosePop'>取消</Button>
    </mt-popup>
</template>
<script>
const FUNC = function() {};
export default {
    name: 'feed-more-action',
    props: {
        feedID: {},
        /**
         * 收藏/取消收藏
         * @type {Function}
         */
        handleCollection: {
            type: Function,
            default: FUNC
        },

        /**
         * 删除动态
         * @type {Function}
         */
        deleteFeed: {
            type: Function,
            default: FUNC
        },

        /**
         * 删除评论
         * @type {Object}
         */
        deleteComment: {
            type: Function,
            default: FUNC
        }

    },
    data() {
        return({
            FUNC,
            show: false,
            isOwn: false,
            type: 'feed',
            commentID: null,
            has_collection: false,
        })
    },
    computed: {},
    methods: {

        /**
         * 显示 更多操作
         * @param  {Boolean} options.show
         * @param  {String}  options.type
         * @param  {Object}  options.cur_obj
         */
        handleShowPop({ type, isOwn, has_collection, commentID }) {
            this.type = type;
            if(type === 'feed') {
                this.isOwn = isOwn;
                this.has_collection = has_collection;
            } else {
                this.commentID = commentID;
            }
            this.show = true;
        },

        handleClosePop() {
            this.show = false;
        }
    }
}
</script>
<style lang="less">
.feed-more-action {
    width: 100%;
    background-color: #e2e3e3;
    button {
        border-bottom: 1px solid #e2e3e3;
        color: #333;
        border-radius: 0;
        font-size: 16px;
        &:last-child {
            margin-top: 5px;
        }
    }
}
</style>