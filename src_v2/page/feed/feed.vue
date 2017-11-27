<template>
    <div style="height: 100%">
        <head-top>
            <div slot='nav' class="head_nav">
                <router-link class='head_nav_item' to="/feed/new">最新</router-link>
                <router-link class='head_nav_item' to="/feed/hot">热门</router-link>
                <router-link class='head_nav_item' to="/feed/follow">关注</router-link>
            </div>
        </head-top>
        <load-more :topMethod='refresh' :bottomMethod='loaderMore' :bottomAllLoaded='bottomAllLoaded' ref='loadMore'>
            <template slot='list'>
                <feed-item v-for='feed in feeds' :feed='feed' :key='`feed-${feed_type}-${feed.id}`'></feed-item>
            </template>
        </load-more>
        <foot-guide></foot-guide>
    </div>
</template>
<script>
import HeadTop from '../../components/HeadTop';
import FootGuide from '../../components/FootGuide';
import components from './components/';
import { getFeeds } from '../../service/getData';
const types = ['new', 'hot', 'follow'];
export default {
    name: 'feedIndex',
    components: {
        HeadTop,
        FootGuide,
        ...components
    },
    data() {
        return {
            feed_type: this.$route.params.type,
            feeds: [],
            busy: false,
            bottomAllLoaded: false
        }
    },
    watch: {
        $route({ params: { type } }) {
            this.feed_type = type;
            this.feeds = [];
            this.getFeeds();
        }
    },
    methods: {
        refresh() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if(this.$refs.loadMore) {
                        this.$refs.loadMore.onTopLoaded();
                    }
                    resolve()
                }, 2000)
            })
        },
        loaderMore() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.bottomAllLoaded = true;
                    if(this.$refs.loadMore) {
                        this.$refs.loadMore.onBottomLoaded();
                    }
                    resolve()
                }, 2000)
            })
        },
        infinite() {},
        getFeeds() {
            getFeeds({ type: this.feed_type, limit: 11 }).then(({ feeds = [], pinned = [], ad = [] }) => {
                this.feeds = [...feeds, ...this.feeds];
                if(feeds.lenght < 12) {
                    this.bottomAllLoaded = true;
                }
            });
        }
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
        this.getFeeds();
    }
}
</script>
<style lang="less" scoped></style>