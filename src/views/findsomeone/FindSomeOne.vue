<template>
    <div>
        <header class="commonHeader" style="position: fixed; top:0; width:100%" v-if="!isWeiXin">
            <Row :gutter="24">
                <Col span="4" style="display: flex; justify-content: flex-start" @click.native="goTo(-1)">
                <BackIcon height="21" width="21" color="#999" />
                </Col>
                <Col span="11" style="padding-left: 0">
                <div :class="$style.input">
                    <Search style="position: absolute; top: 50%; left: 5px; margin-top:-8px" height="16" width="16" color="#999" />
                    <input type="text" placeholder="搜索">
                </div>
                </Col>
                <Col span="4" style="display: flex; justify-content: flex-start">
                <BackIcon height="21" width="21" color="#999" />
                </Col>
                <Col span="5" style="display: flex; justify-content: flex-start">
                <BackIcon height="21" width="21" color="#999" />
                </Col>
            </Row>
        </header>
        <nav :class="$style.findNavBar">
            <Row :gutter="0 " :class="$style.NavRow">
                <Col :span="5" :class="$style.NavCol">
                    <router-link :class="$style.navLink" to="/findsomeone/hot">热门</router-link>
                </Col>
                <Col :span="5" :class="$style.NavCol">
                    <router-link :class="$style.navLink" to="/findsomeone/new">最新</router-link>
                </Col>
                <Col :span="5" :class="$style.NavCol">
                    <router-link :class="$style.navLink" to="/findsomeone/rec">推荐</router-link>
                </Col>
                <Col :span="5" :class="$style.NavCol">
                    <router-link :class="$style.navLink" to="/findsomeone/near">附近</router-link>
                </Col>
            </Row>
        </nav>
        <div :class="$style.findContent">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import BackIcon from '../../icons/Back';
import Search from '../../icons/Search';
import { goTo } from '../../utils/changeUrl';
const FindSomeOne = {
    name: "FindSomeOne",
    components: {
        BackIcon,
        Search,
    },
    data: () => ({
        isWeiXin: window.TS_WEB.isWeiXin,
        selected: 1
    }),
    methods: {
        goTo,
    }
}

export default FindSomeOne;
</script>
<style lang="scss" module>
.input {
    position: relative;
    height: 27px;
    line-height: 27px;
    background-color: #ededed;
    border-radius: 6px;
    >input {
        width: 100%;
        height: 100%;
        border: 0;
        outline: 0;
        padding-left: 25px;
        padding-right: 10px;
        background: none;
    }
}

.findNavBar {
    font-size: 14px;
    height: 32px;
    line-height: 31px;
    border-bottom: 1px #ededed solid;
    background-color: #fff;
    position: fixed;
    top: 46px;
    width: 100%;
    z-index: 3;
    &:active {
        background-color: #fff;
    }
    .NavRow {
        height: 100%;
        justify-content: center;
        align-items: flex-end;
        .NavCol {
            position: relative;
        }
    }
}

.navLink {
    color: #999;
    display: block;
    text-align: center;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    bottom: -1px;
    border-bottom: 2px solid transparent;
}
.findContent{
    padding-top: 32+46px;
}
</style>