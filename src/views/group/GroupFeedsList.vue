<template>
    <div class="gd-feed-list">
        <mt-loadmore 
        ref="loadmore" 
        :autoFill='false' 
        :bottomDistance="70" 
        :top-method="updateFeedList" 
        :bottom-method="loadMore" 
        :bottom-all-loaded="bottomAllLoaded" 
        :bottomPullText="`上拉加载更多`" 
        :bottomDropText="`释放加载更多`"
        >
            <group-feed v-for="(item, index) in feedList" :feed="item" :updateList='updateFeedList' :key="index"></group-feed>
            <div class="t_c" v-if="bottomAllLoaded">没有更多了</div>
        </mt-loadmore>
    </div>
</template>
<script>
import axios, { createAPI } from '../../utils/request';
import groupFeed from "./GroupFeed";
export default {
    name: 'group-feeds-list',
    components: {
        groupFeed
    },
    props: {
        groupID: {
            type: Number,
            required: true
        }
    },
    data() {
        return({
            feedList: [],
            after: 0,
            limit: 10,
            bottomAllLoaded: false
        })
    },
    methods: {
        getFeeds(top = false) {
            axios.get(createAPI(`groups/${this.groupID}/posts?limit=${this.limit}&after=${top ? 0 : this.after}`)).then(({ data = [] }) => {
                this.bottomAllLoaded = data.length < this.limit;
                this.after = data[data.length - 1].id;
                this.feedList = top ? [...data] : [...this.feedList, ...data, ];
                top ? this.$refs.loadmore.onTopLoaded() : this.$refs.loadmore.onBottomLoaded();
            }).catch(({ response: { data = { message: "获取圈子动态失败!" } } = {} }) => {
                const msg = this.$MessageBundle(data).getMessage();
                this.$Message.error(msg);
            });
        },
        updateFeedList() {
            this.getFeeds(true);
        },
        loadMore() {
            this.getFeeds();
        }
    },
    created() {
        this.getFeeds();
    }
}
</script>