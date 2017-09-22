<template>
    <LoadMore :listComponent="listComponent" :nothingImg="nothingImg" :URL="LoadMoreURL" :offsetTop="`-91px`" />
</template>
<script>
import LoadMore from "./LoadMore";
import FindPersonList from "./FindPersonList";
import { resolveImage } from '../../utils/resource';
const nothingImg = resolveImage( require( '../../statics/images/img_default_nobody@2x.png' ) );


const FindContent = {
    name: "FindContent",
    components: {
        LoadMore
    },
    data() {
        return( {
            listComponent: FindPersonList,
            nothingImg,
            LoadMoreURL: '',
        } );
    },
    watch: {
        "$route": function() {
            this.LoadMoreURL = `user/${this.$route.params.type}`;
        }
    },
    created() {
        this.LoadMoreURL = `user/${this.$route.params.type}`;
    }
}

export default FindContent;
</script>