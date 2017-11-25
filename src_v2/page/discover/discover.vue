<template>
    <div>
        <head-top title='发现' />
        <ul class="entry_group">
            <li class="entry_item" @click='to("/news")'>
                <v-icon type='discover-news' class='entry_prepend' />
                <div class="entry_title">资讯</div>
                <v-icon type='base-arrow-r' class='entry_append' />
            </li>
            <li class="entry_item" @click='to("/group")'>
                <v-icon type='discover-group' class='entry_prepend' />
                <div class="entry_title">圈子</div>
                <v-icon type='base-arrow-r' class='entry_append' />
            </li>
            <li class="entry_item" @click='to("/question")'>
                <v-icon type='discover-question' class='entry_prepend' />
                <div class="entry_title">问答</div>
                <v-icon type='base-arrow-r' class='entry_append' />
            </li>
        </ul>
        <ul class="entry_group" @click='to("/rank")'>
            <li class="entry_item">
                <v-icon type='discover-rank' class='entry_prepend' />
                <div class="entry_title">排行榜</div>
                <v-icon type='base-arrow-r' class='entry_append' />
            </li>
        </ul>
        <ul class="entry_group" @click='to("/find")'>
            <li class="entry_item">
                <v-icon type='discover-find' class='entry_prepend' />
                <div class="entry_title">找人</div>
                <v-icon type='base-arrow-r' class='entry_append' />
            </li>
        </ul>
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
    methods: {
        to(path) {
            this.$router.push({ path });
        },
    }
}
</script>
<style lang="less">
@import '../../style/mixin';
.entry_group {
    background: #fff;
    padding-left: 20px;
    padding-right: 20px;
    +.entry_group {
        margin-top: 20px;
    }
    .entry_item {
        height: 100px;
        display: flex;
        align-items: center;
        +.entry_item {
            border-top: 1px solid #ededed;
        }
        .entry_title {
            flex: 1 1 auto;
            font-size: 30px;
            color: #000;
        }
    }
}
</style>
<style lang="less" scoped>
.entry_item {
    .entry_append,
    .entry_prepend {
        margin-left: 10px;
        margin-right: 10px;
        width: 40px;
        height: 40px;
    }
    .entry_append {
        fill: #dfdfdf;
        width: 36px;
        height: 36px;
    }
}
</style>