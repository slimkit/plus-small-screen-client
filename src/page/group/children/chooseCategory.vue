<template>
    <div class="full-page">
        <head-top :go-back='true' :title='$route.meta.title'></head-top>
        <div class="group--types-list">
            <div @click='ok(type)' class="group--types-list-item ellipsis" :class='{active: type.id === choosed}' v-for='type in types' v-if='type.id' :key='`group--type-${type.id}`'>
                {{ type.name }}
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import HeadTop from '@/components/HeadTop';
export default {
    name: 'chooseCategory',
    components: {
        HeadTop
    },
    computed: {
        ...mapState({
            types: s => s.GROUPTYPES
        }),

        choosed() {
            return this.$parent.category;
        }
    },
    methods: {
        ok(type) {
            this.$parent.category = type;

            this.$Message.success({
                Message: `已选择 ${ type.name } 分类 `,
            });

            this.$router.go(-1);
        },
    }
}
</script>
<style lang='less'>
.group--types-list {
    margin-top: 40px;
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    &-item {
        height: 60px;
        width: calc(~'25% - 10px');
        margin: 0 10px 10px 0;
        padding: 0 20px;
        line-height: 60px;
        border-radius: 4px;
        /*no*/
        background: #f4f5f5;
        font-size: 28px;
        text-align: center;
        &.active {
            background-color: #d9eef6;
        }
    }
}
</style>