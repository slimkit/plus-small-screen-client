<template>
    <div class="findSomeOne" :class="{noScroll: pop.open}">

        <!-- header -->
        <header class="commonHeader" style="position: fixed; top:0; width:100%" v-if="!isWeiXin">
            <Row :gutter="24">
                <Col span="4" style="display: flex; justify-content:flex-start;align-items: center" @click.native="changeUrl(`/discover`)">
                <BackIcon height="21" width="21" color="#999" />
                </Col>
                <Col span="11" style="padding-left: 0">
                <div :class="$style.input" @click="showPop(1)">
                    <Search style="position: absolute; top: 50%; left: 5px; margin-top:-8px" height="16" width="16" color="#999" /> 搜索
                </div>
                </Col>
                <Col span="3" style="display:flex;justify-content:center;align-items:center">
                <Contacts height="24" width="24" color="#999" />
                </Col>
                <Col span="6" style="display: flex; justify-content: flex-start; align-items:center;padding-left:0;" @click.native="showPop(2)">
                    <Location height="24" width="24" color="#999"style="flex-grow:0;flex-shrink:0;margin-right:5px;"  />
                    <span style="overflow:hidden; text-overflow:ellipsis;white-space:nowrap;">{{location}}</span>
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
                    <router-link class="navLink" to="/findsomeone/list/near">附近</router-link>
                </Col>
            </Row>
        </nav>
        <!-- /nav -->
        
        <!-- content -->
        <div class="findContent">
            <router-view></router-view>
        </div>
        <!-- /content -->

        <!-- Model-Pop -->
        <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
            <FindModelPop v-if="pop.open" 
            @cancel="()=>{showPop()}"
            :listComponent="pop.list"
            :baseURL="pop.URL"
            />
        </transition>
        <!-- /Model-Pop -->

    </div>
</template>
<script>
import { goTo, changeUrl } from '../../utils/changeUrl';

import Search from '../../icons/Search';
import BackIcon from '../../icons/Back';
import Contacts from '../../icons/Contacts';

import FindModelPop from './FindModelPop';
import LoadMore from './LoadMore';

import FindPersonList from './FindPersonList';
import FindCityList from './FindCityList';

import Location from '../../icons/Location';
import getCurLocation from '../../utils/getLocation';



const FindSomeOne = {
    name: "FindSomeOne",
    components: {
        LoadMore,
        FindModelPop,
        BackIcon,
        Contacts,
        Location,
        Search,
    },
    data: () => ({

        // 弹框相关属性
        pop: {
            open: false,
            URL: "",
            list: FindPersonList,
        },
        
        isShowModel: false,
        isWeiXin: window.TS_WEB.isWeiXin,
        location: '选择城市'
    }),
    methods: {
        goTo,
        changeUrl,
        getCurLocation,
        showPop(type) {
            this.pop.open = !this.pop.open;
            switch (type){
                case 1:
                    this.pop.URL = 'user/search?keyword=';
                    return this.pop.list = FindPersonList;
                case 2:
                    this.pop.URL = 'locations/search?name=';
                    return this.pop.list = FindCityList;
                default:
                return false;
            }
        },
        locationSuccess(data){
            console.log(data);
        },
        locationError(error) {
            console.log(error);
        }
    },
    created() {
        this.getCurLocation({success: this.locationSuccess, error: this.locationError});
        const key = this.$storeLocal.get("FindModelPop_Keyword");
        if (key) {
            this.pop.open = true;
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