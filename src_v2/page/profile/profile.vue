<template>
    <div>
        <head-top title='我' />
        <transition-group tag="ul" class='entry_group' v-for='(group, index) in entrys' :key='`${prefix}-entry-group-${index}`' name="slide">
            <li v-for='({icon,title, path, tips, new_tips}, index) in group' :key='`${prefix}-entry-${icon}`' class="entry_item" @click='to(path)'>
                <v-icon :type='`${prefix}-${icon}`' class='entry_prepend' />
                <div class="entry_title">{{ title }}</div>
                <div class="entry_tips">
                    <v-badge :dot='new_tips'>
                        {{ tips }}
                    </v-badge>
                </div>
                <v-icon type='base-arrow-r' class='entry_append' />
            </li>
        </transition-group>
        <foot-guide></foot-guide>
    </div>
</template>
<script>
import HeadTop from '../../components/HeadTop';
import FootGuide from '../../components/FootGuide';

const prefix = 'mine';
export default {
    name: 'profileIndex',
    components: {
        HeadTop,
        FootGuide
    },
    data() {
        return {
            prefix,
            entrys: [
                [{
                    title: '清除缓存',
                    icon: 'news',
                    path: '/news',
                    new_tips: false,
                    tips: ''
                }]
            ]
        }
    },
    methods: {
        to(path) {
            this.$store.commit("LOGOUT");
            // this.$router.push({ path });
        }
    }
}
</script>
<style lang="less">
</style>