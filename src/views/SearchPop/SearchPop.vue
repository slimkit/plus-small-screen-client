<template>
    <mt-popup v-model="isopen" :position="position" :class="$style.searchPop" :modal="false" :lockScroll="lockScroll">
        <slot name="header">
            <header :class="$style.searchHeader">
                <Row :gutter="12">
                    <Col span="20" style="positoin: relative;">
                    <Input ref="inputs" v-model="keyword" placeholder="搜索" :class="$style.plr20" :autofocus="true" @on-enter="doSearch()" />
                    <Search style="position: absolute; top: 50%; left: 15px; margin-top:-10px" height="20" width="20" color="#999" />
                    <CloseIcon @click.native="cleanKeyword()" height="20" width="20" color="#999" v-if="keywordCount" style="position: absolute; top: 13px; right: 15px;" />
                    </Col>
                    <Col @click.native="closeSearch" style="color: #59b6d7; text-align:center;" span="4">取消</Col>
                </Row>
            </header>
        </slot>
        <div :class="$style.searchContent">
            <slot :keyword="keyword">
                <mt-loadmore ref="loadMore" :bottomDistance="70" :top-method="loadTop" :bottom-method="loadBottom" :top-all-loaded="topAllLoaded" :bottom-all-loaded="bottomAllLoaded" :autoFill="false" :bottomPullText="`上拉加载更多`" :bottomDropText="`释放加载更多`">
                    <component :is="searchList" :dataList="dataList" :keyword="keyword" @closeSearch="closeSearch" />
                </mt-loadmore>
            </slot>
        </div>
    </mt-popup>
</template>
<script>
import Search from "../../icons/Search";
import CloseIcon from "../../icons/Close";

import request, { createAPI, addAccessToken } from '../../utils/request';

export default {
    name: "searchPop",
    props: {
        lockScroll: {
            type: Boolean,
            default: false
        },
        value: {
            type: Boolean,
            default: false
        },
        position: {
            type: String,
            default: "left"
        },
        searchUrl: String,
        searchList: Object,
        searchfor: {
            type: String,
            required: true
        },
    },
    components: {
        Search,
        CloseIcon
    },
    data() {
        return {
            isopen: this.value,
            keyword: "",
            dataList: [],
            topAllLoaded: false,
            bottomAllLoaded: false,
        }
    },
    computed: {
        keywordCount() {
            return this.keyword.length > 0;
        }
    },
    watch: {
        keyword(val) {
            this.doSearch();
        },
        value(val) {
            this.isopen = val;
        },
        isopen(val) {
            this.$emit('input', val);
        }
    },
    methods: {
        loadTop() {
            console.log("下拉");
            // 延时隐藏
            setTimeout(() => {
                this.$refs.loadMore.onTopLoaded();
            }, 700);
        },
        loadBottom() {
            console.log("上拉");
            // 延时隐藏
            setTimeout(() => {
                this.$refs.loadMore.onBottomLoaded();
            }, 700);
        },
        doSearch() {
            if (this.searchUrl && this.keywordCount) {
                let params = {
                    limit: 10
                }
                this.$storeLocal.set(`search_${this.searchfor}`, this.keyword)
                request.get(createAPI(this.searchUrl + this.keyword), { params })
                    .then(({ data = [] }) => {
                        this.dataList = data;
                    })
            }

            return;
        },
        cleanKeyword() {
            this.keyword = "";
        },
        closeSearch() {
            this.isopen = !1;
            this.keyword = "";
            this.dataList = [];
            this.$storeLocal.remove(`search_${this.searchfor}`);
        }
    },
    created() {
        // this.isopen = this.open;
        this.keyword = this.$storeLocal.get(`search_${this.searchfor}`) || "";
    },
    updated() {
        if (this.$refs.inputs && !this.keywordCount) {
            this.$refs.inputs.$refs.input.focus()
        }
    }
}
</script>
<style lang="scss" module>
.plr20 {
    >input[type="text"] {
        padding-left: 35px;
        padding-right: 40px;
    }
}

.searchPop {
    overflow: hidden;
    position: relative;
    padding: 46px 0 0;
    width: 100%;
    height: 100%;
    background-color: #f4f5f5;
    .searchHeader {
        position: fixed;
        top: 0;
        width: 100%;
        height: 46px;
        line-height: 45px;
        border-bottom: 1px solid #ededed;
        background-color: #fff;
    }
    .searchContent {
        overflow: auto;
        width: 100%;
        height: 100%;
        background-color: #f4f5f5;
    }
}
</style>