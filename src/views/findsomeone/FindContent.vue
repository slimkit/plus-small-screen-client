<template>
    <LoadMore :nothingImg="nothingImg" :URL="LoadMoreURL" :offsetTop="`-91px`" /></LoadMore>
</template>
<script>
import LoadMore from "./LoadMore";
import { resolveImage } from '../../utils/resource';
const nothingImg = resolveImage(require('../../statics/images/img_default_nobody@2x.png'));

const FindContent = {
    name: "FindContent",
    components: {
        LoadMore,
    },
    data() {
        return({
            datas: [ { id: 123 }],
            nothingImg,
            LoadMoreURL: '',
        });
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