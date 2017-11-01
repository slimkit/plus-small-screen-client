<template>
    <Row class='my-question-nav'>
        <Col class='my-question-nav-item' v-for='(nav, index) in navs' :key='`my-question-nav-${index}`'>
            <router-link :to="nav.path">{{nav.label}}</router-link>
        </Col>
    </Row>
</template>
<script>
export default {
    name: 'my-question-nav',
    props: {
        navs: Array
    },
    data() { return({}); },
    computed: {}
}
</script>
<style lang="scss">
.my-question-nav {
    height: 40px;
    text-align: center;
    background: #fff;
    justify-content: space-around;
    .my-question-nav-item {
        font-size: 14px;
        a {
            border-bottom: 2px solid transparent;
            padding: 0 5px;
            display: block;
            line-height: 39px;
            color: #999;
            &.router-link-active {
                color: #333;
                border-bottom-color: #59b6d7;
            }
        }
    }
}
</style>