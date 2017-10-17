<template>
    <Row class="group-item">
        <Col class="group-avatar" :span="4">
        <img :src="avatar">
        </Col>
        <Col class="group-info" :span="14">
        <p>{{group.title}}</p>
        <p>分享 <span class="num">{{group.posts_count}}</span> 订阅数 <span class="num">{{group.members_count}}</span></p>
        </Col>
        <Col class="group-action" :span="6" style="flex: 0 1 auto">
        <div class="action-btn" :class="{primary: !is_member}" @click.stop="joinGroup">
            <Icon :type="is_member ? `checkmark` : `plus`"></Icon>{{is_member ? `已加入` : `加入`}}
        </div>
        </Col>
    </Row>
</template>
<script>
import { addAccessToken, createAPI } from '../../utils/request';
import { NOTICE } from '../../stores/types';
export default {
    name: 'group-item',
    props: {
        group: {
            type: Object,
            required: true
        },
    },
    data: () => ({}),
    computed: {
        avatar() {
            const { avatar } = this.group;
            return avatar ? `/api/v2/files/${avatar.id}` : null;
        },
        is_member() {
            return !!this.group.is_member;
        }
    },
    methods: {
        joinGroup() {
            const { id, is_member } = this.group,
                method = is_member ? "DELETE" : "POST";
            this.group.is_member = !is_member;
            addAccessToken()({
                method,
                url: createAPI(`groups/${this.group.id}/join`),
                validateStatus: status => (status === 201 || status === 204)
            }).then(({status, data = { message: "操作成功！"}}) => {
            }).catch(err=>{
                this.group.is_member = !this.is_member;
                this.$store.dispatch(NOTICE, cb => {
                    cb({
                        show: true,
                        time: 1500,
                        status: false,
                        text: "操作失败"
                    });
                });
            });
        }
    },
    created() {}
}
</script>
<style lang="scss">
.group {
    .group-item {
        padding: 15px 10px;
        height: 80px;
        background-color: #fff;
        border-bottom: 1px solid #dedede;
        .group-avatar {
            width: 60px;
            height: 60px;
            line-height: 60px;
            background-color: #ededed;
            text-align: center;
            >img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .group-info {
            p {
                margin: 10px;
                line-height: 1;
                font-size: 14px;
                color: #999;
                &:first-child {
                    font-size: 16px;
                    color: #333;
                }
                .num {
                    color: #59b6d7;
                }
            }
        }
        .group-action {
            .action-btn {
                width: 126/2px;
                height: 25px;
                line-height: 23px;
                text-align: center;
                border-radius: 4px;
                border: 1px solid #ccc;
                color: #ccc;
                &.primary {
                    color: #59b6d7;
                    border-color: #59b6d7;
                }
                i {
                    color: inherit;
                    font-size: 13px;
                    font-weight: 100;
                    margin-right: 1px;
                }
            }
        }
    }
}
</style>