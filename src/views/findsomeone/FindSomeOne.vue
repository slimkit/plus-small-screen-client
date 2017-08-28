<template>
    <div class="findSomeOne" :class="{noScroll: isShowSearch}">
        <header class="commonHeader" style="position: fixed; top:0; width:100%" v-if="!isWeiXin">
            <Row :gutter="24">
                <Col span="4" style="display: flex; justify-content:flex-start;align-items: center" @click.native="changeUrl(`/discover`)">
                <BackIcon height="21" width="21" color="#999" />
                </Col>
                <Col span="11" style="padding-left: 0">
                <div :class="$style.input" @click="showSearch">
                    <Search style="position: absolute; top: 50%; left: 5px; margin-top:-8px" height="16" width="16" color="#999" /> 搜索
                </div>
                </Col>
                <Col span="3" style="display:flex;justify-content:center;align-items:center">
                <Contacts height="24" width="24" color="#999" />
                </Col>
                <Col span="6" style="display: flex; justify-content: flex-start; align-items:center">
                    <Location height="24" width="24" color="#999"style="flex-grow:0;flex-shrink:0;margin-right:5px;"  />
                    <span>{{location}}</span>
                </Col>
            </Row>
        </header>
        <nav class="findNavBar">
            <Row :gutter="0 " class="NavRow">
                <Col :span="5" class="NavCol">
                <router-link class="navLink" to="/findsomeone/list/populars">热门</router-link>
                </Col>
                <Col :span="5" class="NavCol">
                <router-link class="navLink" to="/findsomeone/list/latests">最新</router-link>
                </Col>
                <Col :span="5" class="NavCol">
                <router-link class="navLink" to="/findsomeone/list/find-by-tags">推荐</router-link>
                </Col>
                <Col :span="5" class="NavCol">
                <router-link class="navLink" to="/findsomeone/list/near">附近</router-link>
                </Col>
            </Row>
        </nav>
        <div class="findContent">
            <router-view></router-view>
        </div>
        <!-- search -->
        <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
            <FindSearch v-if="isShowSearch" @cancel="()=>{showSearch()}" />
        </transition>
        <!-- /search -->

    </div>
</template>
<script>
import Search from '../../icons/Search';
import BackIcon from '../../icons/Back';
import Contacts from '../../icons/Contacts';
import Location from '../../icons/Location';
import FindSearch from './FindSearch';
import LoadMore from './LoadMore';
import { goTo, changeUrl } from '../../utils/changeUrl';

import getCurLocation from '../../utils/getLocation';

const AMap = window.AMap;

const FindSomeOne = {
    name: "FindSomeOne",
    components: {
        LoadMore,
        FindSearch,
        BackIcon,
        Contacts,
        Location,
        Search,
    },
    data: () => ({
        isShowSearch: false,
        isWeiXin: window.TS_WEB.isWeiXin,
        location: '定位中'
    }),
    methods: {
        goTo,
        changeUrl,
        getCurLocation,
        showSearch() {
            this.isShowSearch = !this.isShowSearch;
        },
        locationSuccess(data){
            console.log(data);
        },
        locationError(error) {
            switch (error.code) {
                case error.TIMEOUT:
                    return console.warn("获取定位信息超时，请稍后重试");
                case error.POSITION_UNAVAILABLE:
                    return console.warn('定位失败，当前位置信息不可用，请稍后重试');
                case error.PERMISSION_DENIED:
                    return console.warn('定位失败，系统拒绝了定位请求，请打开GPS定位功能');
                case error.UNKNOWN_ERROR:
                    return console.warn('定位失败，出现未知错误');
                default:
                    return console.warn(error);
            }
        }
    },
    created() {
        this.getCurLocation({success: this.locationSuccess, error: this.locationError});
        const key = this.$storeLocal.get("FindSomeOne_Key");
        if (key) {
            this.isShowSearch = true;
        }
    }
}

export default FindSomeOne;
</script>
<style lang="scss" module>
.input {
    position: relative;
    height: 27px;
    line-height: 27px;
    padding-left: 27px;
    background-color: #ededed;
    color: #ccc;
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
</style>
<style lang="scss">
.findSomeOne {
    width: 100%;
}

.findSearch {
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: #123;
    top: 0;
    left: 0;
    z-index: 999;
}

.findNavBar {
    font-size: 14px;
    height: 45px;
    line-height: 44px;
    border-bottom: 1px #ededed solid;
    background-color: #fff;
    position: fixed;
    top: 46px;
    width: 100%;
    z-index: 9;
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

.noScroll {
    height: 100vh !important;
    overflow-y: hidden !important;
}


.findContent {
    width: 100%;
    margin-top: 91px;
}
</style>