<template>
    <div class="group-list">
        <div id="spinner" v-if="loading">
            <div id="spinner-parent">
                <div class="spinner-double-bounce-bounce2"></div>
                <div class="spinner-double-bounce-bounce1"></div>
            </div>
        </div>
        <mt-loadmore v-else :auto-fill="false" :bottomPullText="`上拉加载更多`" :bottomDropText="`释放加载更多`" :top-method="loadTop" :bottom-method="loadBottom" :bottomAllLoaded="bottomAllLoaded" ref="loadmore">
            <div class="group-nodatas" v-if="noDatas">
                <img :src="nothingImg" alt="暂无数据">
            </div>
            <template v-else>
                <group-item v-for="(item,index) in groupList" :group='item' :key="index"></group-item>
            </template>
            <div slot="top" class="mint-loadmore-top">
                <loading-icon></loading-icon>
            </div>
        </mt-loadmore>
    </div>
</template>
<script>
import groupItem from './GroupItem';
import loadingIcon from '../../icons/Loading';
import { createAPI, addAccessToken } from '../../utils/request';

import { resolveImage } from '../../utils/resource';
const nothingImg = resolveImage(require('../../statics/images/defaultNothingx3.png'))

export default {
    name: 'group-list',
    components: {
        groupItem,
        loadingIcon,
    },
    data() {
        return({
            nothingImg,
            loading: true,
            type: 'mine',
            groupList: [],
            bottomAllLoaded: false,
        })
    },
    computed: {
        noDatas() {
            return !(this.groupList.length > 0);
        }
    },
    watch: {
        '$route': function({ params: { type } }) {
            this.type = type || 'mine';
            this.loadData();
        }
    },
    methods: {
        /**
         * 加载数据
         * @param  {Boolean} merge
         */
        loadData(merge = false) {
            this.loading = true;
            let params = {
                limit: 15,
                after: merge ? this.groupList.length : 0,
            }
            if(this.type === "mine") {
                params.user = (this.$storeLocal.get('UserLoginInfo') || {}).user_id;
            }
            addAccessToken().get(createAPI('groups'), { params }).then(({ data = [] }) => {
                this.loading = false;
                this.bottomAllLoaded = data.length < params.limit;
                if(merge) {
                    this.groupList = Array.from(new Set([...data, ...this.groupList]));
                    this.$refs.loadmore.onBottomLoaded();
                } else {
                    this.groupList = [...data];
                    this.$refs.loadmore.onTopLoaded();
                }
            }).catch(err => {
                this.loading = false;
                console.log(err);
            })
        },

        loadTop() {
            this.loadData();
        },

        loadBottom() {
            this.loadData(true);
        }
    },
    created() {
        this.loadData();
    }
}
</script>