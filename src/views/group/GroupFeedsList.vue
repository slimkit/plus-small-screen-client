<template>
    <div class="gd-feed-list">
        <group-feed v-for="(item, index) in feedList" :feed="item" :updateList='getFeeds' :key="index"></group-feed>
    </div>
</template>
<script>
    import axios, { createAPI } from '../../utils/request';
    import  groupFeed from "./GroupFeed";
    export default {
        name: 'group-feeds-list',
        components:{
            groupFeed
        },
        props: {
            groupID: {
                type: Number,
                required: true
            }
        },
        data(){
            return ({
                feedList: []
            })
        },
        methods:{
            getFeeds() {
                axios.get(createAPI(`groups/${this.groupID}/posts`)).then(({data = []})=>{
                    this.feedList = [...data];
                }).catch(({response: { data = {message: "获取圈子动态失败!"} } = {} })=>{
                    const msg = this.$MessageBundle(data).getMessage();
                    this.$Message.error(msg);
                });
            }
        },
        created(){
            this.getFeeds();
        }
    }
</script>