<template>
    <!-- list -->
    <ul :class="$style.findlist">
        <FindPersonItem v-for="(item, index) in dataList" :item="item" :key="index" />
    </ul>
    <!-- /list -->
</template>
<script>
import FindPersonItem from './FindPersonItem.vue';
const FindPersonList = {
    name: "FindPersonList",
    components: {
        FindPersonItem
    },
    props:["dataList"],
    data: () => ({}),
    methods: {},
    computed: {},
    created() {},
}

export default FindPersonList;
</script>
<style lang="scss" module>
.findlist {
    background-color: #fff;
}
</style>