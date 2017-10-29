<template>
    <div class="feed-tool-item feed-comment">
        <CommentIcon @click.native="handleCommentInput" width="21" height="21" color="#999" />
        <span class="count feed-comment-count">{{ count || 0 }}</span>
    </div>
</template>

<script>
    import CommentIcon from '../../../icons/Comment';
    export default {
        name: 'feed-comment',
        components: {
            CommentIcon
        },
        props:{
            feedID: {
                required: true
            },
            count: {
                required: true
            },
            handleCommentInput:{
                type: Function
            }
        },
        data(){
            return ({});
        }
    }
</script>