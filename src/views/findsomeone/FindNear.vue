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
            longitude: 0,
            latitude: 0,
            searchParams: {}
        }),
        created(){
            const { lat, lng} = this.$storeLocal.get("LocationObj") || {};
            this.LoadMoreURL = isNaN(lat + lng) ? '' : `around-amap?longitude=${lat}&latitude=${lng}`;
        }
    }

    export default FindNear;
</script>