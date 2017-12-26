<template>
    <div>
        <head-top>
            <div slot='nav' class="head-top-nav">
                <router-link class='head-top-nav-item' to="/message/msg">
                    <v-badge dot>消息</v-badge>
                </router-link>
                <router-link class='head-top-nav-item' to="/message/info">
                    <v-badge :dot='has_info'>通知</v-badge>
                </router-link>
            </div>
        </head-top>
        <foot-guide></foot-guide>
    </div>
</template>
<script>
import HeadTop from '../../components/HeadTop';
import FootGuide from '../../components/FootGuide';
export default {
    name: 'messageIndex',
    data() {
        return {
            has_info: false,
            has_msg: true
        }
    },
    components: {
        HeadTop,
        FootGuide
    }
}
</script>
<style lang="less"></style>