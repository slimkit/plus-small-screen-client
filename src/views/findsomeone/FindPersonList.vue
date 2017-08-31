<template>
    <!-- list -->
    <ul :class="$style.findlist">
        <FindItem v-for="(item, index) in dataList" :item="item" :key="index" />
    </ul>
    <!-- /list -->
</template>
<script>
import FindItem from './FindItem.vue';
const FindPersonList = {
    name: "FindPersonList",
    components: {
        FindItem
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