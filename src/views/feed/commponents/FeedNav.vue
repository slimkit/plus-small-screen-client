<template>
    <header class="feed-nav-bar">
        <Row :gutter="32" class="feed-nav-row">
            <Col :span="6" class="feed-nav-col">
                <router-link class="feed-nav-item" to="/feed/new">最新</router-link>
            </Col>
            <Col :span="6" class="feed-nav-col">
                <router-link class="feed-nav-item" to="/feed/hot">热门</router-link>
            </Col>
            <Col :span="6" class="feed-nav-col">
                <router-link class="feed-nav-item" to="/feed/follow">关注</router-link>
            </Col>
        </Row>
    </header>
</template>
<script>
export default {
    name: 'feed-nav-bar',
}
</script>
<style lang="scss">
.feed-nav-bar {
    position: absolute;
    top: 0;
    z-index: 3;
    border-bottom: 1px #ededed solid;
    height: 46px;
    width: 100%;
    line-height: 45px;
    font-size: 18px;
    background-color: #fff;
    .feed-nav-row {
        height: 100%;
        justify-content: center;
        align-items: flex-end;
    }
    .feed-nav-item {
        color: #999;
        display: block;
        text-align: center;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border-bottom: 2px solid transparent;
        &.router-link-active {
            color: #333;
            border-bottom-color: #59b6d7;
        }

    }
}
</style>