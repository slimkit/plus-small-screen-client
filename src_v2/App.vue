<template>
    <div>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <svg-icon></svg-icon>
    </div>
</template>
<script>
import svgIcon from 'components/common/svgIcon';
export default {
    name: 'app',
    components: {
        svgIcon
    }
}
</script>
<style lang="less">
.router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
}

.router-fade-enter, .router-fade-leave-active {
    opacity: 0;
}
</style>