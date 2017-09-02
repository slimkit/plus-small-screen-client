<template>
    <div v-if="URL">
        <div id="spinner" v-if="showSpinner">
            <div id="spinner-parent">
                <div class="spinner-double-bounce-bounce2" />
                <div class="spinner-double-bounce-bounce1" />
            </div>
        </div>
        <mt-loadmore 
        v-else 
        :autoFill="false"
        :bottomDistance="70" 
        :top-method="loadTop" 
        :bottom-method="loadBottom" 
        :top-all-loaded="topAllLoaded" 
        :bottom-all-loaded="bottomAllLoaded" 
        :bottomPullText="`上拉加载更多`" 
        :bottomDropText="`释放加载更多`" 
        ref="loadMore">
            <div v-if="nothing && !showSpinner" :style="{'margin-top': offsetTop || 0}" :class="$style.nothing">
                <img :src="nothingImg" alt="空空如也">
            </div>
            <component v-else :is="listComponent" :dataList="dataList" />
            <div v-show="bottomAllLoaded && !nothing" :class="$style.bottmAll">没有更多了</div>
        </mt-loadmore>
    </div>
</template>
<script>
import request, { createAPI, addAccessToken } from '../../utils/request';
const LoadMore = {
    name: "LoadMore",
    props: ["listComponent", "nothingImg", "URL", "offsetTop"],
    data: () => ({
        dataList: [],
        showSpinner: false,
        bottomStatus: "",
        topAllLoaded: false,
        bottomAllLoaded: false,
        limit: 15,
        offset: 0,
    }),
    methods: {
        loadData(merge) {

            this.offset = merge ? this.dataList.length : 0;

            let URL = this.URL,
                params = {
                    limit: this.limit,
                    offset: this.offset,
                };

            if (URL) {
                request.get(createAPI(URL), { params })
                .then(({ data = [] }) => {

                    this.showSpinner = false;

                    this.bottomAllLoaded = data.length < params.limit ? !0 : !1;

                    if (merge) {
                        // 合并操作
                        this.dataList = [...this.dataList,...data];
                    } else {
                        // 刷新操作
                        this.dataList = [...data];
                    }

                })
                .catch(error => {
                    this.dataList = [];
                    this.showSpinner = false;
                    this.bottomAllLoaded = true;
                });
            }else{
                this.dataList = [];
                this.showSpinner = false;
                this.bottomAllLoaded = true;
            }
        },
        loadTop() {
            // 上拉刷新
            this.loadData();
            // 延时隐藏
            setTimeout(() => {
                this.$refs.loadMore.onTopLoaded();
            }, 700);
        },
        loadBottom() {
            // 下拉加载
            console.warn("load bottom");
            this.loadData(true);
            // 延时隐藏
            setTimeout(() => {
                this.$refs.loadMore.onBottomLoaded();
            }, 700);
        }
    },

    computed: {
        nothing() {
            return !(this.dataList.length);
        },
    },
    watch: {
        URL(val) {
            this.showSpinner = true;
            this.loadData();
        }
    },
    created() {
        if (this.URL) {
            this.dataList = [];
            this.offset = 0;
            this.showSpinner = true;
            this.loadData();
        }
    }
}

export default LoadMore;
</script>
<style lang="scss" module>
.nothing {
    width: 100%;
    display: flex;
    font-size: 24px;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100vh;
    color: #ccc;
    >img {
        margin: 30%;
        width: 70%;
    }
}

.bottmAll {
    width: 100%;
    height: 40px;
    font-size: 14px;
    line-height: 40px;
    text-align: center;
}
</style>