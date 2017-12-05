<template>
    <div class="feed_comment_item" @click.stop='commentAction'>
        <a @click.stop="to(`/user/${user.id}`)" class="user_name">{{ user.name }}</a>
        <template v-if='reply_user'>
            回复
            <a @click.stop='to(`/user/${reply_user.id}`)' class="user_name">{{ reply_user }}</a>
        </template>
        <span class="content">{{ body }}</span>
    </div>
</template>
<script>
export default {
    name: 'feedCommentItem',
    props: {
        comment: {
            required: true
        }
    },
    computed: {
        user() {
            return this.comment.user || {};
        },
        reply_user() {
            return this.comment.reply_user || 0
        },
        body() {
            let r = this.comment.body;
            return r.length > 60 ? r.slice(0, 57) + '...' : r;
        }
    },
    methods: {
        to(path) {
            this.$router.push({ path });
        },
        commentAction() {
            this.$emit('action', this.user.id, this.user.name);
        }
    }
}
</script>
<style lang='less'>
.feed_comment_item {
    color: #999;
    font-size: 26px;
    line-height: 1.4;
    max-height: 26*1.4*3px;
    overflow-y: hidden;
    .user_name {
        padding: 0 5px;
        color: #333;
        &:last-of-type:after {
            content: ':';
            padding-left: 5px;
            color: #999;
        }
    }
}
</style>