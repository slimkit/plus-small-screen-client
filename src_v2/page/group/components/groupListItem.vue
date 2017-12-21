<template>
    <div :class="prefixCls" :id='`group-${group.id}`' @click='beforeToDetail'>
        <div :class="`${prefixCls}-header`">
            <img :src="header">
        </div>
        <div :class="`${prefixCls}-info`">
            <div :class="`${prefixCls}-name`">
                <h3>{{ group.name }}</h3>
                <i v-if='group.mode ==="paid"' :class="`${prefixCls}-paid-icon`">付费</i>
            </div>
            <p>
                <span>帖子
                    <i class="num">{{ group.posts_count || 0 | formatNum }}</i>
                </span>
                <span>成员
                    <i class="num">{{ group.users_count || 0 | formatNum }}</i>
                </span>
            </p>
        </div>
        <div :class="`${prefixCls}-action`">
            <a v-if='!group.joined' @click.stop='joinGroup(group.id)' :class="[`${prefixCls}-action-btn`, 'join']">
                <v-icon type='foot-plus'></v-icon>加入
            </a>
            <div v-if='role' :class="[`${prefixCls}-role`, roles.cls]">{{ roles.label }}</div>
        </div>
    </div>
</template>
<script>
const prefixCls = 'group-list-item'
export default {
    name: 'groupListItem',
    props: {
        group: {
            required: true
        },

        role: Boolean
    },
    data() {
        return {
            prefixCls
        }
    },

    computed: {
        header() {
            return this.group.avatar;
        },

        roles() {
            if(!this.role) return;
            const roles = {
                    label: '',
                    cls: ''
                },

                { joined: { role = '普通成员' } = {} } = this.group;

            switch(role) {
                case 'member':
                    roles.label = '普通成员';
                    break;
                case 'administrator':
                    roles.label = '管理员';
                    break;
                case 'founder':
                    roles.label = '圈主';
                    break;
            }
            roles.cls = role;

            return roles;
        }
    },

    methods: {
        to(path) {
            if(path) {
                this.$router.push({ path });
            }
        },
        joinGroup(id) {
            // PUT /groups/:group
            // # todo
            this.$http.put(`/plus-group/groups/${id}`).then(({ data }) => {
                this.$Message.success(data);
            }).catch(err => {
                const { response: { data = { message: '申请失败 可能是已经申请过了' } } = {} } = err;
                this.$Message.error(data);
            })
        },

        beforeToDetail() {
            if(this.group.mode === 'public' || this.group.joined) {
                this.to(`/group/detail/${this.group.id}`)
            } else {
                this.$Message.error('需要先加入圈子, 才能查看圈子信息哦~');
            }
        }
    }
}
</script>
<style lang='less'>
@group-list-item-prefix: group-list-item;
.@{group-list-item-prefix} {
    padding: 20px 30px;
    border-bottom: 1px solid #ededed;
    height: 180px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-role {
        height: 32px;
        line-height: 32px;
        padding: 0 17px;
        font-size: 20px;
        color: #fff;
        border-radius: 32/2px;
        background-color: #ccc;
        &.founder {
            background-color: #fca308;
        }
    }
    &-paid-icon {
        margin-left: 15px;
        border-radius: 3px;
        /*no*/
        padding: 0 5px;
        min-width: 50px;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        color: #fff;
        background: linear-gradient(135deg, #E8D1B3 0%, #E8D1B3 38%, #C8A06C 42%, #C8A06C 100%);
    }

    &-name {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        font-size: 32px;
        color: #333;
        h3 {
            margin: 0;
            padding: 0;
        }
    }
    &-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin: 0 20px;
        flex: 1 1 auto;

        p {
            font-size: 0;
            white-space: nowrap;
            margin: 0;
        }

        span {
            font-size: 28px;
            margin-right: 30px;
        }

        .num {
            color: #59b6d7;
            margin-left: 10px;
        }
    }
    &-action {
        flex: none;
        &-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            font-size: 26px;
            width: 126px;
            height: 50px;
            line-height: 46px;
            border: 1px solid #59b6d7;
            /*no*/
            border-radius: 8px;
            color: #59b6d7;
            background-color: #fff;
            .v-icon {
                width: 20px;
                height: 20px;
                margin-right: 5px;
            }
        }
    }
    &-header {
        flex: none;
        width: 120px;
        height: 120px;
        img {
            width: 100%;
            object-fit: cover;
            background-color: #ccc;
        }
    }
}
</style>