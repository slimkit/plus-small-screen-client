<template>
    <li class="feed_item" @click='viewFeed'>
        <v-avatar sex='user.sex' :src='user.avatar' class='feed_avatar'>
            {{ user.name.slice(0, 1) }}
        </v-avatar>
        <div class="feed_content">
        </div>
    </li>
</template>
<script>
export default {
    name: 'feedItem',
    props: {
        feed: {
            type: Object,
            required: true
        }
    },
    computed: {
        user() {
            return this.feed.user;
        }
    },
    methods: {
        viewFeed() {
            console.log('查看详情');
        }
    }
}
</script>
<style lang='less' socped>
.feed_item {
    display: flex;
    background: #fff;
    padding: 30px 20px;
    font-size: 30px;
    +.feed_item {
        margin-top: 10px;
    }
    .feed_avatar {
        flex: 0 0 auto;
    }
    .feed_content {
        flex: 1 1 auto;
        margin-left: 20px;
    }
}
</style>