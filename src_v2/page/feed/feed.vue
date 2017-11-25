<template>
    <div>
        <head-top>
            <div slot='nav' class="head_nav">
                <router-link class='head_nav_item' to="/feed/new">最新</router-link>
                <router-link class='head_nav_item' to="/feed/hot">热门</router-link>
                <router-link class='head_nav_item' to="/feed/follow">关注</router-link>
            </div>
        </head-top>
        <div class="feed_container">
            <feed-item v-for='feed in feeds' :feed='feed' :key='`feed-${feed_type}-${feed.id}`'></feed-item>
        </div>
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
            feeds: []
        }
    },
    watch: {
        $route({params: { type }}) {
            this.feed_type = type;
            this.feeds = [];
            this.getFeeds();
        }
    },
    methods: {
        getFeeds() {
            getFeeds({ type: this.feed_type }).then(({ feeds = [], pinned = [], ad = [] }) => {
                this.feeds = [...feeds, ...this.feeds];
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