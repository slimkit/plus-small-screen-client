<template>
    <header class="feeds-nav-bar">
        <Row :gutter="32" class="feeds-nav-row">
            <Col :span="6" class="feeds-nav-col">
              <router-link class="feeds-nav-item" to="/feeds/new">最新</router-link>
            </Col>
            <Col :span="6" class="feeds-nav-col">
              <router-link class="feeds-nav-item" to="/feeds/hot">热门</router-link>
            </Col>
            <Col :span="6" class="feeds-nav-col">
              <router-link class="feeds-nav-item" to="/feeds/following">关注</router-link>
            </Col>
        </Row>
    </header>
</template>
<script>
export default {
    name: 'feeds-nav-bar',
}
</script>
<style lang="less">
.feeds-nav-bar {
    font-size: 18px;
    height: 46px;
    line-height: 45px;
    border-bottom: 1px #ededed solid;
    background-color: #fff;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 3;
    &:active {
        background-color: #fff;
    }
    .feeds-nav-row {
        height: 100%;
        justify-content: center;
        align-items: flex-end;
        .feeds-nav-col {
            position: relative;
        }
    }
    .feeds-nav-item {
        color: #999;
        display: block;
        text-align: center;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        bottom: -1px;
    }
}
</style>