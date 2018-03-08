<template>
    <div class="feed-tool-item feed-view" @click='viewFeed(feedID)'>
        <ViewIcon width="21" height="21" color="#999"  />
        <span class="count feed-view-count">{{ count || 0 }}</span>
    </div>
</template>

<script>
    import ViewIcon from '../../../icons/View';
    export default {
        name: 'feed-view',
        components: {
            ViewIcon
        },
        props: {
            feedID:{
                required: true
            },
            count: {
                required: true
            },
            viewFeed:{
                required: true
            }
        },
        data(){
            return ({

            })
        }
    }
</script>