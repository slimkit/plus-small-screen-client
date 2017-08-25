<template>
    <div class="findSearch">
        <header class="findSearch_header">
            <Row :gutter="12">
                <Col span="20" style="positoin: relative;">
                <Input v-model="keyword" :class="$style.plr20" :autofocus="true" @on-enter="doSearch()" v-childfocus />
                    <Search style="position: absolute; top: 50%; left: 15px; margin-top:-10px" height="20" width="20" color="#999"/>
                    <CloseIcon @click.native="cleanKeyword();" height="20" width="20" color="#999" v-if="keywordCount" style="position: absolute; top: 13px; right: 15px;" />
                </Col>
                <Col @click.native="closeSearch" style="color: #59b6d7; text-align:center;" span="4">取消</Col>
            </Row>
        </header>
        <div class="findSearch_content">
            <LoadMore :ListBox="ListBox" :nothingImg="nothingImg" :URL="LoadMoreURL" :params="searchParams" :offsetTop="`-46px`" />
        </div>
    </div>
</template>
<script>

import CloseIcon from "../../icons/Close";
import Search from "../../icons/Search";

import FindList from "./FindList";
import LoadMore from "./LoadMore";

import { goTo, changeUrl } from '../../utils/changeUrl';
import { resolveImage } from '../../utils/resource';
const nothingImg = resolveImage(require('../../statics/images/defaultNothingx3.png'));
const FindSearch = {
    name: "FindSearch",
    components:{
        CloseIcon,
        FindList,
        LoadMore,
        Search
    },
    data: () => ({
        keyword: "",
        ListBox: FindList,
        nothingImg
    }),

    watch:{
        keyword(val){
            this.$storeLocal.set("FindSomeOne_Key", val);
        }
    },
    computed:{
        keywordCount(){
            return this.keyword.length;
        },
        searchParams(){
            let keyword = this.keyword;
            return {};
        },
        LoadMoreURL(){
            if(this.keyword){
                return `user/search?keyword=${this.keyword}`;
            }else{
                return "";
            }
        }
    },
    methods:{
        goTo,
        changeUrl,
        doSearch(){},
        cleanKeyword(){
            this.keyword = "";
        },
        closeSearch(){
            this.$storeLocal.remove("FindSomeOne_Key");
            this.$emit('cancel');
        }
    },
    created(){
        const key = this.$storeLocal.get("FindSomeOne_Key");
        if(key){
            this.keyword = key;
        }
    }
}

export default FindSearch;
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
.findSearch {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    width: 100%;
    height: 100%;
    background-color: #fff;
}
.findSearch_header{
    position: fixed;
    top: 0;
    width: 100%;
    height: 46px;
    line-height: 45px;
    border-bottom: 1px solid #ededed;
    background-color: #fff;
}
.findSearch_content{
    margin-top: 46px;
}
</style>