<template>
    <div class="header">
        <slot name='prepend'>
            <section class="head_goback" v-if="goBack" @click="goBackFn">
                <v-icon type='base-back' />
            </section>
        </slot>
        <slot name='title'>
            <div class="header_title ellipsis" v-if='title'>{{ title || $route.meta.title }}</div>
        </slot>
        <slot name='nav'></slot>
        <slot name='append'></slot>
    </div>
</template>
<script>
export default {
    name: 'HeaderTop',
    props: {
        title: String,
        goBack: [Boolean, Function]
    },
    computed: {},
    methods: {
        goBackFn() {
            return typeof this.goBack === 'function' ?
                this.goBack :
                this.$router.go(-1);
        }
    }
}
</script>
<style>
.header+* {
    padding-top: 90px;
}
</style>
<style lang='less' scoped>
.header {
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    height: 90px;
    width: 100%;
    line-height: 90px;
    background: #fff;
    border-bottom: 2px solid #ededed;
    .header_title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        text-align: center;
        font-size: 36px;
        color: #333;
    }
    .head_nav {
        display: flex;
        -ms-align-items: center;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 80%;
        height: 100%;
        .head_nav_item {
            box-sizing: border-box;
            color: #999;
            text-align: center;
            font-size: 32px;
            width: 90px;
            border-bottom: 3px solid transparent;
            + .head_nav_item{
                margin-left: 50px;
            }
            &.router-link-active{
                color: #333;
                border-bottom-color: #59b6d7;
            }
        }
    }
    .head_goback {
        left: 0.4rem;
        width: 0.6rem;
        height: 100%;
        margin-left: .4rem;
        svg {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}
</style>