<template>
    <div class="feed_detail" @click='$router.go(-1)'>
    </div>
</template>
<script>
export default {
    name: 'feedDetail',
    methods: {
        to(path) {
            this.$route.push(path);
        }
    }
}
</script>
<style lang='less'>
.feed_detail {
    height: 3000px;
    background: #ccc;
}
</style>