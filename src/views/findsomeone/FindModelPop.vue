<template>
    <div class="findModelPop">
        <header class="findModelPop_header">
            <Row :gutter="12">
                <Col span="20" style="positoin: relative;">
                    <Input v-model="keyword" placeholder="搜索" :class="$style.plr20" :autofocus="true" @on-enter="doSearch()" />
                    <Search style="position: absolute; top: 50%; left: 15px; margin-top:-10px" height="20" width="20" color="#999"/>
                    <CloseIcon @click.native="cleanKeyword();" height="20" width="20" color="#999" v-if="keywordCount" style="position: absolute; top: 13px; right: 15px;" />
                </Col>
                <Col @click.native="closeSearch" style="color: #59b6d7; text-align:center;" span="4">取消</Col>
            </Row>
        </header>
        <div class="findModelPop_content">
            <LoadMore :listComponent="listComponent" :nothingImg="nothingImg" :URL="URL" :offsetTop="`-46px`" />
        </div>
    </div>
</template>
<script>

import CloseIcon from "../../icons/Close";
import Search from "../../icons/Search";

import LoadMore from "./LoadMore";

import { goTo, changeUrl } from '../../utils/changeUrl';

const FindModelPop = {
    name: "FindModelPop",
    components:{
        CloseIcon,
        LoadMore,
        Search
    },
    props:["listComponent", "nothingImg", "baseURL"],
    data: () => ({
        keyword: "",
        URL: ""
    }),
    watch:{
        keyword(val){
            this.URL = this.baseURL + val;
            this.$storeLocal.set("FindModelPop_Keyword", val);
        },
    },
    computed:{
        keywordCount(){
            return this.keyword.length;
        },
    },
    methods:{
        goTo,
        changeUrl,
        doSearch(){},
        cleanKeyword(){
            this.keyword = "";
        },
        closeSearch(){
            this.$storeLocal.remove("FindModelPop_type");
            this.$storeLocal.remove("FindModelPop_Keyword");
            this.$emit('cancel');
        }
    },
    created(){
        this.keyword = this.$storeLocal.get("FindModelPop_Keyword") || '';
        this.URL = this.baseURL + this.keyword;
    }
}

export default FindModelPop;
</script>

<style lang="scss" module>
    .plr20{
        >input[type="text"]{
            padding-left: 35px;
            padding-right: 40px;
        }
    }
</style>
<style>
.findModelPop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    width: 100%;
    height: 100%;
    background-color: #f4f5f5;
}
.findModelPop_header{
    position: fixed;
    top: 0;
    width: 100%;
    height: 46px;
    line-height: 45px;
    border-bottom: 1px solid #ededed;
    background-color: #fff;
}
.findModelPop_content{
    margin-top: 46px;
}
</style>