<template>
    <div :class="prefixCls" :id='key'>
    </div>
</template>
<script>
const prefixCls = 'group-list-item'
export default {
    name: 'groupListItem',
    props:{
        key: String
    },
    data() {
        return {
            prefixCls
        }
    },
}
</script>
<style lang='less'>
@group-list-item-prefix: group-list-item;
.@{group-list-item-prefix} {}
</style>