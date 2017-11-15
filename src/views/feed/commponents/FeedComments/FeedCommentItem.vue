<template>
    <p class="feed-comment-item feed-comment-row" @click.stop='handleCommentInput'>
        <!-- 回复用户 -->
        <router-link class="feed-comment-username" :to="{ path: `/users/feeds/${comment.user_id}` }">{{ user.name || '' }}</router-link>
        <!-- 被回复用户 -->
        <template v-if="comment.reply_user">回复
            <router-link class="feed-comment-username" :to="{ path: `/users/feeds/${comment.reply_user}` }">{{ reply_user.name || '' }}</router-link>
        </template>
        <span class="comment_content">{{ comment.body }}
            <i class="pinned-icon" v-if='comment.pinned'>置顶</i>
        </span>
    </p>
</template>
<script>
import { changeUrl } from '../../../../utils/changeUrl';
export default {
    name: 'feed-comment-item',
    props: {
        comment: Object,
        isMine: Boolean
    },
    data() {
        return({})
    },
    computed: {
        user() {
            return this.$store.getters.getUserById(this.comment.user_id)[0]
        },
        reply_user() {
            return this.$store.getters.getUserById(this.comment.reply_user)[0]
        }
    },
    methods: {
        changeUrl,
        handleCommentInput() {
            return this.isMine ? console.log(1) : this.$emit('handleCommentInput', {
                placeholder: `回复${this.user.name}`,
                reply_user: this.user.id
            })
        }
    }
}
</script>
<style lang="less">
.feed-comment-item {
    font-size: 12px;
    color: #999;
    line-height: 1.5;
    .feed-comment-username {
        color: #333;
        &:last-of-type:after {
            content: ':';
            color: #999
        }
    }
}
</style>