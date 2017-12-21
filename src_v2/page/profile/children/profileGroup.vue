<template>
    <div class="profile-group">
        <head-top :go-back='cancel'>
            <div class="head-top-tabs-nav" slot='nav'>
                <router-link class='head-top-tabs-nav-item' v-for='({label, path}, index) in types' :key='`profile-group-tab-${index}`' :to='path'>
                    {{ label }}
                </router-link>
            </div>
        </head-top>
        <keep-alive>
            <router-view class="profile-group-content"></router-view>
        </keep-alive>
    </div>
</template>
<script>
import HeadTop from '@/components/HeadTop';
export default {
    name: 'profileGroup',
    components: {
        HeadTop,
    },
    data() {
        return {
            types: [{
                label: '圈子',
                path: '/profile/group/groups'
            }, {
                label: '帖子',
                path: '/profile/group/posts'
            }],
        }
    },
    methods: {
        cancel() {
            this.$router.push('/profile');
        }
    }
}
</script>
<style lang='less'>
@profile-group-prefix: profile-group;
.@{profile-group-prefix} {
    &-nav {
        position: fixed;
        z-index: 100;
        top: 90px;
        padding-top: 0 !important;
        display: flex;
        align-items: center;
        height: 90px;
        width: 100%;
        line-height: 89px;
        border-bottom: 1px solid #ededed;
        /*no*/
        background-color: #fff;
        justify-content: center;
        &-item {
            padding: 0 10px;
            font-size: 28px;
            color: #999;
            border-bottom: 3px solid transparent;
            &+& {
                margin-left: 90px;
            }

            &.router-link-active,
            &.active {
                border-color: #59b6d7;
                color: #333;
            }
        }
    }
    &-content {
        padding-top: 180px;
    }
}
</style>