<template>
    <Row :class="$style.toolBar">
        <i-col :span="24">
            <Menu mode="horizontal" theme="primary" active-key="1">
                <Menu-item key="1">
                    <Icon type="ios-paper"></Icon>
                    内容管理
                </Menu-item>
                <Menu-item key="2">
                    <Icon type="ios-people"></Icon>
                    用户管理
                </Menu-item>
            </Menu>
        </i-col>
    </Row>
</template>

<style lang="scss" module>
    .toolBar {
        position: fixed!important;
        bottom: 0;
        left: 0
    }
</style>