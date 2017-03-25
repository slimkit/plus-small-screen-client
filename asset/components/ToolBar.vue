<template>
    <Row :class="$style.toolBar" class="menu">
        <i-col :span="5" :class="$style.menuItem">
            <Icon type="android-home"></Icon>
            <i>首页</i>
        </i-col>
        <i-col :span="5" :class="$style.menuItem">
            <Icon type="android-globe"></Icon>
            <i>发现</i>
        </i-col>
        <i-col :span="4" :class="$style.menuItem" class="plus-parent">
            <Icon type="ios-plus-empty" :class="$style.plus"></Icon>
        </i-col>
        <i-col :span="5" :class="$style.menuItem">
            <Icon type="chatboxes"></Icon>
            <i>消息</i>
        </i-col>
        <i-col :span="5" :class="$style.menuItem">
            <Icon type="android-person"></Icon>
            <i>我</i>
        </i-col>
    </Row>
</template>

<style lang="scss" module>
    .toolBar {
        position: fixed!important;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 50px!important;
        background-color: #363844;
        z-index: 4
    }
    .plus {
        &:before {
            font-size: 50px!important;
            color: #fff;
        }
    }
    .menuItem {
        height: 100%!important;
        display: flex!important;
        justify-content: center;
        align-items:center;
        color: #707c81;
        i {
            font-style: normal;
            font-size: 16px;
            &:before {
                font-size: 24px;
            }
        }


    }
</style>

<style lang="css">
    .plus-parent {
        background-color: #59b6d7;
    }
</style>