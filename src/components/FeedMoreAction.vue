<template>
    <mt-popup class='feed-more-action' v-model="popConfig.show" position="bottom">
        <div @click='handleClosePop'>
            <template v-if='type==="comment"'>
                <Button size="large" type="text" :long="true" @click='popConfig.pinnedComment(commentID) || FUNC'>申请评论置顶</Button>
                <Button size="large" type="text" :long="true" @click='popConfig.deleteComment(commentID) || FUNC'>删除评论</Button>
            </template>
            <template v-if='type.indexOf("feed") > -1'>
                <Button v-if='has_collection' size="large" type="text" :long="true" @click='popConfig.handleCollection("uncollection") || FUNC'>取消收藏</Button>
                <Button v-else size="large" type="text" :long="true" @click='popConfig.handleCollection("collection") || FUNC'>收藏</Button>
                <template v-if='isOwn'>
                    <Button v-if='type==="feed"' size="large" type="text" :long="true" @click='popConfig.pinnedFeed(feedID)'>申请动态置顶</Button>
                    <Button size="large" type="text" :long="true" @click='popConfig.deleteFeed || FUNC'>删除动态</Button>
                </template>
            </template>
            <Button type="text" :long="true" @click='handleClosePop'>取消</Button>
        </div>
    </mt-popup>
</template>
<script>
import { SHOWPOPUP, CLOSEPOPUP } from '../stores/types';

const FUNC = function() {};

export default {
    name: 'feed-more-action',
    props: {},
    data() {
        return({
            FUNC,
        })
    },
    computed: {
        popConfig() {
            return this.$store.getters[SHOWPOPUP];
        },
        feedID(){
            return this.popConfig.feedID || null;
        },
        type() {
            return this.popConfig.type || 'feed';
        },
        isOwn() {
            return this.popConfig.isOwn || false;
        },
        has_collection() {
            return this.popConfig.has_collection || false;
        },
        commentID() {
            return this.popConfig.commentID || null;
        }
    },
    methods: {
        handleClosePop() {
            this.$store.dispatch(CLOSEPOPUP);
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
        color: #333 !important;
        border-radius: 0;
        font-size: 16px;
        &:last-child {
            margin-top: 5px;
        }
    }
}
</style>