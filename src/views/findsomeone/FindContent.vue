<template>
    <LoadMore :ListBox="ListBox" :nothingImg="nothingImg" :URL="LoadMoreURL" :params="searchParams" :offsetTop="`-91px`" />
</template>

<script>
    import LoadMore from "./LoadMore";
    import FindList from "./FindList";
    import { resolveImage } from '../../utils/resource';
    const nothingImg = resolveImage(require('../../statics/images/defaultNothingx3.png'));

    const FindContent = {
        name: "FindContent",
        components:{
            LoadMore
        },
        data:()=>({
            ListBox: FindList,
            nothingImg,
            LoadMoreURL: '',
            searchParams: {}
        }),
        watch: {
            "$route": function() {
                this.LoadMoreURL = `user/${this.$route.params.type}`;
            }
        },
        created(){
            this.LoadMoreURL = `user/${this.$route.params.type}`;
        }
    }

    export default FindContent;
</script>
