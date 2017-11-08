<template>
    <FeedList :option="option"></FeedList>
</template>
<script>
import FeedList from '../components/FeedList';

const FeedNew = {
    components: {
        FeedList
    },
    data: () => ({
        option: {
            uri: 'feeds?type=new',
            limiter: 'max_id',
            type: 'new'
        }
    })
}
export default FeedNew;
</script>