<template>
    <div class="header">
        <slot>
            <div class="head_goback">
                <slot name='prepend'>
                    <section v-if="goBack" @click="goBackFn">
                        <template v-if='typeof goBack === "string"'>
                            {{ goBack }}
                        </template>
                        <template v-else>
                            <v-icon type='base-back' />
                        </template>
                    </section>
                </slot>
            </div>
            <div class="header_title" v-if='title'>
                <slot name='title'>
                    <span class="ellipsis">
                        {{ title || $route.meta.title }}
                    </span>
                </slot>
            </div>
            <slot name='nav'></slot>
            <div class="head_append" v-if="append">
                <slot name='append'>
                    <section @click="to('/signup')">注册</section>
                </slot>
            </div>
        </slot>
    </div>
</template>
<script>
export default {
    name: 'HeaderTop',
    props: {
        title: String,
        goBack: [Boolean, Function, String],
        append: [Boolean, String]
    },
    computed: {},
    methods: {
        goBackFn() {
            return typeof this.goBack === 'function' ?
                this.goBack() :
                this.$router.go(-1);
        },
        to(path) {
            if(path) {
                this.$router.push({ path });
            }
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
    border-bottom: 1px solid #ededed;
    /* no */
    .header_title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;
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
            border-bottom: 2px solid transparent;
            /* no */
            +.head_nav_item {
                margin-left: 50px;
            }
        }
        .router-link-active {
            color: #333;
            border-bottom-color: #59b6d7;
        }
    }
    .head_goback {
        left: 30px;
        width: 100px;
        height: 100%;
        margin-left:30px;
        font-size: 32px;
        color: #59b6d7;
        .v-icon {
            width: 40px;
            height: 40px;
            position: absolute;
            top: 50%;
            color: #333;
            transform: translateY(-50%);
        }
    }
    .head_append {
        font-size: 32px;
        right: 30px;
        color: #59b6d7;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        .v-icon {
            width: 40px;
            height: 40px;
            color: #333;
            +.v-icon {
                margin-left: 10px;
            }
        }
    }
}
</style>