<template>
    <div class="feed">
        <feed-nav></feed-nav>
        <div class="views-content ptb feed-list">
            <mt-loadmore ref="loadmore" :auto-fill="false" :top-method="loadTop" :bottom-method="loadBottom" :bottomPullText="`上拉加载更多`" :bottomDropText="`释放加载更多`" :bottomAllLoaded="bottomAllLoaded">
                <template v-if='feed_type !=="follow"'>
                    <feed-item v-for='pinned in pinnedList' :feed='pinned' :id='`feed-pinned-${feed_type}-${pinned.id}`' :key='`feed-pinned-${feed_type}-${pinned.id}`'></feed-item>
                </template>
                <feed-item v-for='feed in feedList' :feed='feed' :key='`feed-${feed_type}-${feed.id}`' :data-feed='`feed-${feed_type}-${feed.id}`'>
                    <a href="javascript:;" class='feed-item-anchor' :id='`feed-${feed_type}-${feed.id}`' slot="feed-item-anchor"></a>
                </feed-item>
                <div v-show="bottomAllLoaded" class="no-more">没有更多</div>
                <div slot="top" class="mint-loadmore-top">
                    <loading-icon></loading-icon>
                </div>
            </mt-loadmore>
        </div>
        <tool-bar></tool-bar>
    </div>
</template>
<script>
import loadingIcon from '../../icons/Loading';
import ToolBar from '../../components/ToolBar';

import FeedNav from './commponents/FeedNav';
import FeedItem from './commponents/FeedItem';
import axios, { createAPI, addAccessToken } from '../../utils/request';

export default {
    name: 'feed',
    components: {
        ToolBar,
        FeedNav,
        FeedItem,
        loadingIcon
    },
    data() {
        return({
            loading: true,
            feed_max_id: 0,
            bottomAllLoaded: false,
            feed_type: 'new',
        });
    },
    watch: {
        '$route': function({ params: { type = 'new' } }) {
            this.feed_type = type || 'new';
            this.$store.commit('SET_FEED_TYPE', type);
            this.getFeedList(false);
        }
    },
    computed: {
        pinnedList() {
            return this.$store.getters.getPinnedFeeds();
        },
        feedList() {
            return this.$store.getters.getFeeds();
        }
    },
    methods: {
        getFeedList(addMore = true) {
            const uri = createAPI('feeds'),
                params = {
                    limit: 10,
                    after: addMore ? this.feed_max_id : 0,
                    type: this.feed_type
                };

            addAccessToken().get(uri, {
                params
            }).then(({ data: { feeds = [], ad, pinned = [] } = {} }) => {
                this.feed_max_id = feeds[feeds.length - 1].id;
                addMore ? this.$refs.loadmore.onBottomLoaded() : this.$refs.loadmore.onTopLoaded();
                this.$refs.loadmore.bottomAllLoaded = feeds.length < 0;
                this.$store.dispatch('ADD_MORE_FEEDS', { feeds, ad, pinned });
            }).catch(({ response: { data = { message: '获取资讯列表失败' } } = {} }) => {
                this.$Message.error(this.$MessageBundle(data).getMessage());
            });
        },

        loadBottom() {
            this.getFeedList();
        },
        loadTop() {
            this.getFeedList(true);
        }
    },
    created() {
        const { params: { type = 'new' } } = this.$route;
        this.feed_type = type;
        this.$store.commit('SET_FEED_TYPE', type);

        this.getFeedList();
        setTimeout(() => {
            this.loading = false;
        }, 2000);
    }
}
</script>
<style lang="less">
.feed-list {
    overflow: hidden;
}
</style>