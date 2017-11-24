<template>
    <div>
        <head-top>
            <div slot='nav' class="head_nav">
                <router-link class='head_nav_item' to="/feed/new">最新</router-link>
                <router-link class='head_nav_item' to="/feed/hot">热门</router-link>
                <router-link class='head_nav_item' to="/feed/follow">关注</router-link>
            </div>
        </head-top>
        <foot-guide></foot-guide>
    </div>
</template>
<script>
import HeadTop from '../../components/HeadTop';
import FootGuide from '../../components/FootGuide';
import message from '../../components/common/message';
export default {
    name: 'feedIndex',
    components: {
        HeadTop,
        FootGuide,
        message
    },
    methods: {}
}
</script>
<style lang="less" scoped>
@import '../../style/mixin';
</style>