<template>
    <div>
        <head-top :go-back='()=>{$router.push("/discover")}' append='true' title='圈子'>
            <div slot='append'>
                <v-icon type='base-search'></v-icon>
                <v-icon type='group-add' @click.native='createdGroup'></v-icon>
            </div>
        </head-top>
        <div>
            <!-- 我加入的 -->
            <div class="group-list-group joined" v-if='showJoined'>
                <group-list-item v-for='item in joined' v-if='item.id' :key='`group-${item.id}`'></group-list-item>
            </div>
            <!-- 我加入的 END -->
            <!-- 推荐 -->
            <div class="group-list-group recommend" v-if='showRecommend'>
                <group-list-item v-for='item in recommend' v-if='item.id' :key='`group-${item.id}`'></group-list-item>
            </div>
            <!-- 推荐 END -->
        </div>
    </div>
</template>
<script>
import HeadTop from '../../components/HeadTop';
import groupListItem from './components/groupListItem';
export default {
    name: 'groupIndex',
    components: {
        HeadTop,
        groupListItem
    },
    data() {
        return {
            joined: [],
            recommend: []
        }
    },
    computed: {
        showJoined() {
            return this.joined.length > 0;
        },
        showRecommend() {
            return this.recommend.length > 0;
        },
    },
    methods: {
        createdGroup() {
            this.$router.push('/add_group')
            // this.$Modal.info({
            //     content: '只有认证通过的用户才可以创建圈子, 是否去认证?',
            //     okText: '去认证',
            //     showOk: true,
            //     onOk() {
            //         console.log('去认证');
            //     }
            // })
        },

        // 获取首页圈子
        getGroup() {
            this.$http.get('/plus-group/user-groups').then(({ data = [] }) => {
                if(data) {
                    this.joined = [...data];
                }
            });

            this.$http.get('/plus-group/recommend/groups').then(({ data = [] }) => {
                if(data) {
                    this.recommend = [...data];
                }
            })
        },
    },
    created() {
        this.getGroup();
        this.$store.dispatch('GET_GROUP_TYPES');
    }
}
</script>