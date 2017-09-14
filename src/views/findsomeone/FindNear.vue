<template>
    <div v-if="nothing" style="margin-top:-91px" :class="$style.nothing">
        <img :src="nothingImg" alt="空空如也">
    </div>
    <LoadMore v-else :listComponent="listComponent" :nothingImg="nothingImg" :URL="LoadMoreURL" :offsetTop="`-91px`" />
</template>
<script>
import LoadMore from "./LoadMore";
import FindPersonList from "./FindPersonList";
import { resolveImage } from '../../utils/resource';
const nothingImg = resolveImage(require('../../statics/images/img_default_nobody@2x.png'));

const FindNear = {
    name: "FindNear",
    components: {
        LoadMore
    },
    data: () => ({
        listComponent: FindPersonList,
        nothingImg,
        LoadMoreURL: '',
        longitude: 0,
        latitude: 0,
        searchParams: {},
        nothing: false
    }),
    created() {
        const { lat, lng } = this.$storeLocal.get("LocationObj") || {};
        this.nothing = isNaN(lat + lng);
        this.LoadMoreURL = isNaN(lat + lng) ? "" : `around-amap?longitude=${lat}&latitude=${lng}`;
    }
}

export default FindNear;
</script>

<style lang="scss" module>
    .nothing {
    width: 100%;
    display: flex;
    font-size: 24px;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100vh;
    color: #ccc;
    background-color: #fff;
    >img {
        margin: 30%;
        width: 70%;
    }
}
</style>