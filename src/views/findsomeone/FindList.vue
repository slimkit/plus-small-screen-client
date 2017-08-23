<template>
    <div>
        <!-- list -->
        <mt-loadmore v-if="!nothing" :bottom-method="loadBottom" :top-method="loadTop" :bottom-all-loaded="bottomAllLoaded" :top-all-loaded="topAllLoaded" ref="loadmore" :bottomDistance="70" @bottom-status-change="bottomStatusChange">
            <ul :class="$style.findlist">
                <FindItem v-for="(item, index) in dataList" :item="item" :key="index" />
            </ul>
            <div slot="bottom" class="mint-loadmore-bottom":class="$style.mb0">
                <span v-if="bottomAllLoaded">没有更多了</span>
                <section v-else>
                    <span v-show="bottomStatus === 'pull' && !bottomAllLoaded">上拉加载更多</span>
                    <span v-show="bottomStatus === 'loading'">加载中...</span>
                    <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
                </section>
            </div>
        </mt-loadmore>
        <!-- /list -->
        <!-- nothing -->
        <div v-else class="nothingDefault">
            <img :src="nothingImg" />
        </div>
        <!-- /nothing -->
        <!-- loading -->
        <div id="spinner" v-show="showSpinner">
            <div id="spinner-parent">
                <div class="spinner-double-bounce-bounce2" />
                <div class="spinner-double-bounce-bounce1" />
            </div>
        </div>
        <!-- /loading -->
    </div>
</template>
<script>
import request, { createAPI, addAccessToken } from '../../utils/request';
import { resolveImage } from '../../utils/resource';
import FindItem from './FindItem.vue';
const nothingImg = resolveImage(require('../../statics/images/defaultNothingx3.png'));
const FindList = {
    name: "FindList",
    components: {
        FindItem
    },
    data: () => ({
        nothingImg,
        showSpinner: false,
        dataList: [],
        isWeiXin: window.TS_WEB.isWeiXin,
        bottomStatus: "",
        topAllLoaded: false,
        bottomAllLoaded: false,
        type: "populars",
    }),
    methods: {
        loadData(merge) {
            this.showSpinner = true;
            let type = this.type,
                params = this.searchData;
            request.get(createAPI(`user/${type}`), { params })
                .then(({ data = [] }) => {

                    if (data.length < params.limit) {
                        this.bottomAllLoaded = true;
                    }

                    if (merge) {
                        // 合并去重
                        let list = new Set([...this.dataList, ...data]);
                        this.dataList = [...list];
                    } else {
                        // 刷新操作
                        this.dataList = [...data];
                    }
                    this.showSpinner = false;
                })
        },
        loadBottom() {
            // 上拉加载
            this.loadData(true);

            setTimeout(() => {
                if (this.$refs.loadmore) {
                    this.$refs.loadmore.onBottomLoaded();
                }
            }, 500)
        },
        loadTop() {
            // 下拉刷新
            this.searchData.offset = 0;
            this.loadData();
            setTimeout(() => {
                if (this.$refs.loadmore) {
                    this.$refs.loadmore.onTopLoaded();
                }
            }, 500)
        },
        bottomStatusChange(status) {
            this.bottomStatus = status;
        }
    },
    watch: {
        "$route": function() {
            this.bottomStatus = "";
            this.topAllLoaded = false;
            this.bottomAllLoaded = false;
            this.type = this.$route.params.type || "populars";
            this.dataList = [];
            this.loadData();
        }
    },
    computed: {
        nothing() {
            return !(this.dataList.length > 0)
        },
        searchData() {
            let data = {
                limit: 15,
                offset: this.dataList.length || 0
            }

            if (this.type === "search") {
                data.keyword = this.keyword;
            };
            return data;
        }
    },
    created() {
        this.loadData();
    }
}

export default FindList;
</script>
<style lang="scss" module>
.findlist {
    width: 100%;
    height: 100%;
    min-height: 100%;
    background-color: #fff;
}
.mb0{
  margin-bottom: 0 !important;
}
</style>