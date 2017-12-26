<template>
    <div class="page-search_usr">
        <head-top :append='true' title='1'>
            <div slot='append' class="head-top-cancel" @click='cancel'>取消</div>
            <div slot='title' class="head-top-search">
                <v-icon type='base-search' class='head-top-search-icon'></v-icon>
                <input class="head-top-search-input" type="text" v-model='keyword' placeholder="搜索" @input="search">
            </div>
        </head-top>
        <!-- 保留此空 div -->
        <div></div>
        <!-- 推荐用户 -->
        <div class="search_usr-list">
            <template v-if='dataList.length === 0'>
                <find-item v-for='user in rec' v-if='user.id' :key='`search_usr-${user.id}`' :user='user'></find-item>
            </template>
            <template v-else>
                <find-item v-for='user in dataList' v-if='user.id' :key='`search_usr-${user.id}`' :user='user'></find-item>
            </template>
        </div>
    </div>
</template>
<script>
import HeadTop from '@/components/HeadTop';
import findItem from '@/page/find/components/findItem';
let sources = [];
export default {
    name: 'searchUser',
    components: {
        HeadTop,
        findItem
    },
    data() {
        return {
            rec: [],
            keyword: '',
            dataList: [],
        }
    },
    methods: {
        cancel() {
            this.$router.go(-1);
        },
        //使用_.debounce控制搜索的触发频率
        //准备搜索
        search: _.debounce(function() {
                let that = this;
                //删除已经结束的请求
                _.remove(sources, (n) => n.source === null);

                //取消还未结束的请求
                sources.forEach(function(item) {
                    if(item !== null && item.source !== null && item.status === 1) {
                        item.status = 0;
                        item.source.cancel('取消上一个')
                    }
                });

                //创建新的请求cancelToken,并设置状态请求中
                let sc = {
                    source: that.$http.CancelToken.source(),
                    status: 1 //状态1：请求中，0:取消中
                };
                sources.push(sc);

                //开始搜索数据
                if(that.keyword) {
                    that.$http.get(`/user/search?keyword=${that.keyword}`, {
                        cancelToken: sc.source.token
                    }).then(({ data = [] }) => {
                        //置空请求canceltoken
                        sc.source = null;
                        this.dataList = data;

                    }).catch(({ response: { data = { message: '搜索失败' } } = {} } = {}) => {
                        //置空请求canceltoken
                        sc.source = null;
                        that.$Message.error(data);
                    });
                }
            },
            500 //空闲时间间隔设置500ms
        ),

        getRecUser() {
            this.$http.get('/user/find-by-tags').then(({ data = [] }) => {
                console.log(data);
                this.rec = [...data];
            }).catch(err => {
                console.log(err);
            });
        }
    },
    created() {
        this.getRecUser();
    }
}
</script>
<style lang='less'>
@search_usr-prefixCls: search_usr;

.page-search_usr {
    .head-top-title {
        padding: 0 120px 0 30px;
        width: 100%;
    }
}
.@{search_usr-prefixCls} {
    &-search-list {
        background-color: #fff;
        padding: 0 30px;
        &-item {
            border-bottom: 1px solid #ededed;
            /*no*/
            width: 100%;
            height: 100px;
            line-height: 98px;
            font-size: 30px;
            color: #333;
        }
    }
}
</style>