<template>
    <LoadMore :listComponent="listComponent" :nothingImg="nothingImg" :URL="LoadMoreURL" :offsetTop="`-91px`" />
</template>

<script>
    import LoadMore from "./LoadMore";
    import FindPersonList from "./FindPersonList";
    import { resolveImage } from '../../utils/resource';
    const nothingImg = resolveImage(require('../../statics/images/img_default_nobody@2x.png'));

    const FindNear = {
        name: "FindNear",
        components:{
            LoadMore
        },
        data:()=>({
            listComponent: FindPersonList,
            nothingImg,
            LoadMoreURL: '',
            searchParams: {}
        }),
        watch: {
            "$route": function() {
                this.LoadMoreURL = `around-amap?${this.$route.params.str || ""}`;
            }
        },
        created(){
            let {
                longitude, 
                latitude
            } = this.$route.query;
            this.LoadMoreURL = `around-amap?longitude=${longitude || 0}&latitude=${latitude || 0}`;
        }
    }

    export default FindNear;
</script>