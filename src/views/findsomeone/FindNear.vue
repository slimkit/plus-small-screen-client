<template>
    <div class="$style.FindNear">
        <div id="spinner" v-if="showSpinner">
            <div id="spinner-parent">
                <div class="spinner-double-bounce-bounce2" />
                <div class="spinner-double-bounce-bounce1" />
            </div>
        </div>
        <mt-loadmore :autoFill="false" :bottomDistance="50" :top-method="loadTop" :bottom-method="loadBottom" :top-all-loaded="topAllLoaded" :bottom-all-loaded="bottomAllLoaded" :bottomPullText="`上拉加载更多`" :bottomDropText="`释放加载更多`" ref="loadMore">
            <FindPersonList v-if="list.length > 0" :dataList="list"></FindPersonList>
            <div v-else :class="$style.nothing">
                <img :src="nothingImg" alt="空空如也">
            </div>
        </mt-loadmore>
    </div>
</template>
<script>
import request, { createAPI, addAccessToken } from '../../utils/request';
import FindPersonList from './FindPersonList';
import { resolveImage } from '../../utils/resource';
const nothingImg = resolveImage(require('../../statics/images/defaultNothingx3.png'))

const FindNear = {
    name: 'FindNear',
    components: {
        FindPersonList
    },
    data() {
        return({
            list: [],
            nothingImg,
            showSpinner: true,
            topAllLoaded: false,
            bottomAllLoaded: false,
            LocationObj: {
                lng: 0,
                lat: 0
            }
        })
    },
    computed: {
        latitude() {
            return this.LocationObj.lat
        },
        longitude() {
            return this.LocationObj.lng
        }
    },
    methods: {

        // 加载数据
        loadData(merge) {
            this.showSpinner = true;
            this.LocationObj = this.$storeLocal.get('LocationObj') || {
                lng: 0,
                lat: 0
            }

            if(this.latitude + this.longitude === 0) {
              return this.showSpinner = false;
            };
            const params = {
                limit: 10,
                offset: this.list.length,
                latitude: this.latitude,
                longitude: this.longitude
            }
            addAccessToken().get(createAPI(`around-amap`), {
                params
            }).then(({ data = [] }) => {
                this.showSpinner = false;
                merge ?
                    this.list = Array.from(new Set([...data, this.list])) :
                    this.list = [...data];
            }).catch(error => {
                console.log(error)
                this.showSpinner = false;
            })
        },

        // 下拉刷新
        loadTop() {
            this.loadData()
            // 延时隐藏
            setTimeout(() => {
                this.$refs.loadMore.onTopLoaded()
            }, 700)
        },

        // 上拉加载更多
        loadBottom() {
            this.loadData(true)
            // 延时隐藏
            setTimeout(() => {
                this.$refs.loadMore.onBottomLoaded()
            }, 700)
        }
    },
    created() {
        this.$bus.on('UpdateLocation', this.loadData)
        this.loadData()
    }
}

export default FindNear;
</script>
<style lang="less" module>
.nothing {
    width: 100%;
    display: flex;
    font-size: 24px;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #ccc; // background-color: #fff;
    >img {
        margin: 30%;
        width: 70%;
    }
}

.findItem {
    display: flex;
    align-items: center;
    padding: 20px;
    height: 100px;
    border-bottom: 1px solid #ededed;
}

.itemHeader {
    overflow: hidden;
    width: 50px;
    height: 50px;
    font-size: 10px;
    line-height: 50px;
    border-radius: 50%;
    text-align: center;
    background-color: #ededed;
    flex: 0 0 auto;
    >img {
        width: 100%;
    }
}

.iteminfo {
    overflow: hidden;
    flex-grow: 1;
    margin-left: 25px;
    font-size: 16px;
    >p {
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .itemName {
        color: #333;
    }
    .itemBio {
        font-size: 14px;
        color: #999;
    }
}

.itemFollow {
    display: flex;
    justify-content: center;
}
</style>