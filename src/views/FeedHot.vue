<template>
    <FeedList :option="option"></FeedList>
</template>
<script>
import FeedList from '../components/FeedList';

const FeedHot = {
    components: {
        FeedList
    },
    data: () => ({
        option: {
            uri: 'feeds?type=hot',
            limiter: 'page',
            type: 'hot'
        }
    })
}
export default FeedHot;
</script>