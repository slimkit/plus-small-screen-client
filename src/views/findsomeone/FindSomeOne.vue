<template>
    <div class="findSomeOne" :class="{noScroll: search.open}">
        <!-- header -->
        <header class="commonHeader" style="position: fixed; top:0; width:100%">
            <Row :gutter="24">
                <Col span="4" style="display: flex; justify-content:flex-start;align-items: center" @click.native="changeUrl(`/discover`)">
                <BackIcon height="21" width="21" color="#999" />
                </Col>
                <Col span="14" style="padding-left: 0">
                <div :class="$style.input" @click="showPop(1)">
                    <Search style="position: absolute; top: 50%; left: 5px; margin-top:-8px" height="16" width="16" color="#999" /> 搜索
                </div>
                </Col>
                <Col span="6" style="display: flex; justify-content: flex-start; align-items:center;padding-left:0;" @click.native="showPop(2)">
                <LoadingBlack v-if="locationing" height="21" width="24" color="#999" style="flex-grow:0;flex-shrink:0;margin-right:5px;" />
                <Location v-else height="24" width="24" color="#999" style="flex-grow:0;flex-shrink:0;margin-right:5px;" />
                <span style="overflow:hidden; text-overflow:ellipsis;white-space:nowrap;">{{location.city}}</span>
                </Col>
            </Row>
        </header>
        <!-- /header -->
        <!-- nav -->
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
                <router-link class="navLink" :to="{ name: 'near', params: { longitude:location.lng ||'', latitude:location.lat ||''}}">附近</router-link>
                </Col>
            </Row>
        </nav>
        <!-- /nav -->
        <!-- content -->
        <div class="findContent">
            <router-view></router-view>
        </div>
        <!-- /content -->
        <!-- 搜索弹窗 -->
        <search-pop v-model="search.open" :searchUrl="search.searchUrl" :searchfor="search.searchType" :searchList="search.list">
        </search-pop>
        <!-- /搜索弹窗 -->
    </div>
</template>
<script>
import { goTo, changeUrl } from '../../utils/changeUrl';
import { resolveImage } from '../../utils/resource';

import Search from '../../icons/Search';
import BackIcon from '../../icons/Back';
import Contacts from '../../icons/Contacts';

import SearchPop from '../SearchPop/SearchPop';
import SearchCity from '../SearchPop/SearchCity';
import SearchPerson from '../SearchPop/SearchPerson';

import Location from '../../icons/Location';
import LoadingBlack from '../../icons/LoadingBlack';
import getCurLocation from '../../utils/getLocation';

import { NOTICE } from '../../stores/types';

const defaultNothing = resolveImage(require('../../statics/images/defaultNothingx3.png'));

const FindSomeOne = {
    name: "FindSomeOne",
    components: {
        BackIcon,
        Contacts,
        LoadingBlack,
        Location,
        Search,
        SearchPop,
    },
    data() {
        return({
            isShowModel: false,

            // 定位相关
            locationing: true,
            location: {
                lat: "",
                lng: "",
                city: '选择城市'
            },

            // 搜索弹窗
            search: {
                open: false,
                keyword: "",
                searchUrl: "",
                searchType: "",
                list: SearchCity,
            },

        })
    },
    computed: {
        open() {
            return this.search.open;
        }
    },
    watch: {
        open(val) {
            // 弹窗关闭的时候执行 父组件刷新
            if(val === false) {
                // 刷新定位
                this.updateLocation();
                // 清除弹窗信息
                this.$storeLocal.remove("FindModelPop_type");
            }
        }
    },
    methods: {
        goTo,
        changeUrl,
        getCurLocation,
        showPop(type) {
            this.search.open = true;
            if(type) {
                this.$storeLocal.set("FindModelPop_type", type);
                switch(type) {
                    case 1:
                        this.search.searchType = "USER";
                        this.search.list = SearchPerson;
                        this.search.searchUrl = 'user/search?keyword=';
                        return;
                    case 2:
                        this.search.searchType = "CITY";
                        this.search.list = SearchCity;
                        this.search.searchUrl = 'locations/search?name=';
                        return;
                    default:
                        return false;
                }
            }
        },

        updateLocation() {
            this.location = this.$storeLocal.get("LocationObj") || this.location;
        },

        // 定位成功回调
        locationSuccess(data) {

            this.locationing = false;
            const { addressComponent: { city = '', street = '', streetNumber = '' } = {}, position: { lat = '', lng = '' } = {} } = data

            this.location = {
                lat,
                lng,
                city: street ? (street + streetNumber) : city
            }

            this.$storeLocal.set("LocationObj", this.location);
        },

        // 定位失败回调
        locationError(error) {
            this.locationing = false;
            this.$store.dispatch(NOTICE, cb => {
                cb({
                    show: true,
                    time: 2000,
                    status: false,
                    text: error
                });
            });
        }
    },
    created() {
        const type = this.$storeLocal.get("FindModelPop_type");
        const { lat, lng, city } = this.$storeLocal.get("LocationObj") || {};

        if(!isNaN(lat + lng) && typeof city === "string") {
            this.location = { lat, lng, city };
            this.locationing = false;
        } else {
            // 延迟 .5s 定位
            setTimeout(() => {
                this.getCurLocation({ success: this.locationSuccess, error: this.locationError });
            }, 2000);
        }

        if(!isNaN(type)) {
            this.showPop(type);
        }
    },
    destroyed() {
        this.$storeLocal.remove("LocationObj");
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
    .mint-loadmore-bottom {
        margin-bottom: -50px;
    }
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

.findpop {
    width: 100%;
    height: 100%;
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