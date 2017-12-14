<template>
    <footer id="foot_guide">
        <section @click="to('/feed/new')" class="guide_item" :class="{active: isCurPath('/feed')}">
            <v-icon type='foot-home' width='.45' height='.45' class='foot_guide_icon' />
            <span>首页</span>
        </section>
        <section @click="to('/discover')" class="guide_item" :class="{active: isCurPath('/discover')}">
            <v-icon type='foot-discover' width='.45' height='.45' class='foot_guide_icon' />
            <span>发现</span>
        </section>
        <section @click="showPostMenu" class="guide_item plus">
            <v-icon type='foot-plus' height='.6' width='.6' color='#fff' class='foot_guide_icon plus' />
        </section>
        <section @click="to('/message/msg')" class="guide_item" :class="{active: isCurPath('/message')}">
            <v-badge :dot='has_msg'>
                <v-icon type='foot-message' width='.45' height='.45' class='foot_guide_icon' />
            </v-badge>
            <span>消息</span>
        </section>
        <section @click="to('/profile')" class="guide_item" :class="{active: isCurPath('profile')}">
            <v-badge :dot='has_fans'>
                <v-icon type='foot-profile' width='.45' height='.45' class='foot_guide_icon' />
            </v-badge>
            <span>我</span>
        </section>
    </footer>
</template>
<script>
import showPostMenu from './postMenu/showPostMenu';
export default {
    name: 'FootGuide',
    data() {
        return {
            has_msg: true,
            has_fans: true
        }
    },
    methods: {
        to(path) {
            this.$router.push({ path });
        },
        isCurPath(path) {
            return this.$route.fullPath.indexOf(path) > -1;
        },
        showPostMenu() {
            showPostMenu.show({})
        }
    },
    mounted() {
        this.$el.parentNode.style.paddingBottom = '1rem';
    }
}
</script>
<style lang="less">
.foot_guide_icon {
    +.v-badge-dot {
        top: 0;
        box-shadow: 0 0 0 1px #ed3f14
    }
}
</style>
<style lang="scss" scoped>
#foot_guide {
    background-color: #363844;
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 10px;
    width: 100%;
    height: 100px;
    display: flex;
    box-shadow: 0 -0.026667rem 0.053333rem rgba(0, 0, 0, .1);
}

.guide_item {
    flex: 1;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #ccc;
    .v-badge-dot {
        top: 0;
    }
    &.plus {
        background-color: #59b6d7;
        margin: 0 15px;
    }
    &.active {
        color: #59b6d7;
    }
    span {
        font-size: 24px;
        color: inherit;
    }
}
</style>