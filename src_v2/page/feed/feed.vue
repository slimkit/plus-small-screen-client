<template>
    <div>
        <head-top>
            <div slot='nav' class="head-top-nav">
                <router-link class='head-top-nav-item' to="/feed/new">最新</router-link>
                <router-link class='head-top-nav-item' to="/feed/hot">热门</router-link>
                <router-link class='head-top-nav-item' to="/feed/follow">关注</router-link>
            </div>
        </head-top>
        <div>
            <feed-item v-for='feed in feeds' :feed='feed' :key='`feed-${feed_type}-${feed.id}`'></feed-item>
        </div>
        <foot-guide></foot-guide>
    </div>
</template>
<script>
import FeedItem from './feedItem';
import { oneOf } from '../../util/';
import modal from '../../plugins/modal/modal'
import HeadTop from '../../components/HeadTop';
import FootGuide from '../../components/FootGuide';

/* 有效类型 */
const types = ['new', 'hot', 'follow'];

import { api } from '../../http';
export default {
    name: 'feedIndex',
    components: {
        HeadTop,
        FeedItem,
        FootGuide,
    },
    data() {
        return {
            feed_type: this.$route.params.type,
            feeds: [],
            busy: false,
            bottomAllLoaded: false,
        }
    },
    watch: {
        $route({ params: { type } }) {
            /* 判断路由是否变化 */
            if(oneOf(type, types) && type != this.feed_type) {
                this.updateList();
            }
        }
    },
    methods: {
        getFeeds() {
            this.$http.get('/feeds', {
                params: {
                    type: this.feed_type,
                    limit: 10
                }
            }).then((res) => {
                const { data: { feeds = [], pinned = [], ad = [] } } = res;
                this.feeds = [...feeds, ...this.feeds];
                if(feeds.lenght < 12) {
                    this.bottomAllLoaded = true;
                }
            }).catch(({ response: { data = { message: '获取动态列表失败' } } }) => {
                this.$Message.error(data)
            })
        },
        updateList() {
            const type = this.$route.params.type;
            this.feeds = [];
            this.feed_type = type;
            this.$store.commit('SAVE_FEED_TYPE', type);
            this.getFeeds();
        },
    },
    /**
     * 组件内 路由守卫 
     *     确保 feed_type 为有效值
     *         @author jsonleex <jsonleex@163.com>
     */
    beforeRouteEnter({ path, params: { type } }, from, next) {
        types.indexOf(type) > -1 ? next() : next({ path: '/feed/new' });
    },

    created() {
        this.updateList();
    },
    beforeDestroy() {
        this.$store.commit('SAVE_FEED_TYPE', '');
    }
}
</script>
<style lang="less" scoped></style>