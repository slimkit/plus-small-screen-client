<template>
    <div>
        <head-top title='发现' />
        <transition-group tag="ul" class='entry_group' v-for='(group, index) in entrys' :key='`${prefix}-entry-group-${index}`' name="slide">
            <li v-for='({icon,title, path}, index) in group' :key='`${prefix}-entry-${icon}`' class="entry_item" @click='to(path)'>
                <v-icon :type='`${prefix}-${icon}`' class='entry_prepend' />
                <div class="entry_title">{{ title }}</div>
                <v-icon type='base-arrow-r' class='entry_append' />
            </li>
        </transition-group>
        <foot-guide></foot-guide>
    </div>
</template>
<script>
import HeadTop from '../../components/HeadTop';
import FootGuide from '../../components/FootGuide';
export default {
    name: 'discoverIndex',
    components: {
        HeadTop,
        FootGuide
    },
    data() {
        return {
            prefix: 'discover',
            entrys: [
                [{
                    title: '资讯',
                    icon: 'news',
                    path: '/news'
                }, {
                    title: '圈子',
                    icon: 'group',
                    path: '/group'
                }, {
                    title: '问答',
                    icon: 'question',
                    path: '/question'
                }],
                [{
                    title: '排行',
                    icon: 'rank',
                    path: '/rank'
                }],
                [{
                    title: '找人',
                    icon: 'find',
                    path: '/find'
                }]
            ]
        }
    },
    methods: {
        to(path) {
            this.$router.push({ path });
        },
    }
}
</script>
<style lang="less" scoped>
</style>