<template>
    <div :class="`${prefixCls}`">
        <div :class="`${prefixCls}-ad`"></div>
        <div :class="`${prefixCls}-menu-list`"></div>
        <div :class="`${prefixCls}-foot`">
            <div :class="`${prefixCls}-close`" @click='close'>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
</template>
<script>
const prefixCls = 'v-post-menu'
export default {
    name: 'postMenu',
    props: {},
    data() {
        return {
            prefixCls
        }
    },
    computed: {},
    watch: {},
    methods: {
        close() {
            this.$emit('on-close')
        }
    },
    mounted() {},
}
</script>
<style lang="less" src='./postMenu.less'></style>