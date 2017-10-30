<style lang="scss">
.checkin-modal {
    .ivu-modal-close {
        border-radius: 50%;
        width: 24px;
        height: 24px;
        color: #fff;
        background-color: rgba(255, 255, 255, .2);
        text-align: center;
        line-height: 24px;
        i {
            vertical-align: middle;
            line-height: 24px;
            font-size: 28px;
            position: initial;
            color: #fff;
        }
    }
    .ivu-modal-header {
        text-align: center;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        font-weight: normal;
        background-image: linear-gradient(45deg, #efb946, #ef8a46);
    }
    .ivu-modal-footer{
      // border-top: 0;
    }
    .checkin-title {
        margin-top: 15px;
        width: 100%;
        text-align: center;
        font-size: 22px;
        font-weight: normal;
        color: #fff;
    }

    .checkin-total {
        border-radius: 14px;
        margin: 15px auto;
        width: 120px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        color: #d46c28;
        font-weight: normal;
        background-color: rgba(255, 255, 255, .2);
        font-size: 16px;
    }

    .checkin-body {
        .checkin-reward {
            width: 100%;
            text-align: center;
            color: #d46c28;
            font-size: 32px;
        }
        .checkin-tips {
            text-align: center;
            font-size: 14px;
            color: #999;
        }
        .checkin-btn {
            margin-top: 20px;
            height: 45px;
            font-size: 18px;
            color: #fff;
            border: 0;
            background-image: linear-gradient(45deg, #efb946, #ef8a46);
            &[disabled] {
                background: rgb(204, 204, 204);
            }
        }
    }
    .checkin-footer {
        display: flex;
        justify-content: center;
        border: 0;
        .checkin-index {
            display: flex;
            flex-direction: column;
            align-items: center;
            + .checkin-index{
              margin-left: 20px;
            }
            img{
              display: block;
              width: 35px;
              height: 35px;
              border-radius: 50%;
            }
            i {
                font-size: 15px;
                color: #ccc;
                font-style: normal;
            }
        }
    }
}
</style>
<template>
    <Modal v-model="modalStatus" class='checkin-modal' @on-ok="handleOffModal" @on-cancel="handleOffModal">
        <div class="checkin-header" slot="header">
            <h1 class="checkin-title">每日签到</h1>
            <p class="checkin-total">
                累计签到{{ checkin_count }}天
            </p>
        </div>
        <div class="checkin-body">
            <p class="checkin-reward">+{{ attach_balance }}</p>
            <p class="checkin-tips">每日签到得金币</p>
            <Button class='checkin-btn' @click.native="handleCheckin" size="large" :disabled="checked_in" long>{{ checked_in ? '已签到' : '签到' }}</Button>
        </div>
        <div class="checkin-footer" slot='footer'>
            <div v-for="(user, index) in rank_users" :key='index' class="checkin-index">
                <img :src="user.avatar ? user.avatar : defaultAvatar">
                <i>{{ index+1 }}</i>
            </div>
        </div>
    </Modal>
</template>
<script>
import { mapState } from 'vuex';
import { SHOWCHECKIN } from '../stores/types';
import { resolveImage } from '../utils/resource';
import { createAPI, addAccessToken } from '../utils/request';

const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));

const checkinLayer = {
    data: () => ({
        modalStatus: false,
        // 当日签到状态 true 已签到 false 未签到
        checked_in: false,
        // 当日前五签到用户，按照签到时间顺序排列
        rank_users: [],
        // 当前用户签到总天数
        checkin_count: 0,
        // 签到用户积分增加值，单位是真实货币「分」单位
        attach_balance: 0,
        // 当前用户连续签到天数
        last_checkin_count: 0,
        // 默认显示头像
        defaultAvatar: defaultAvatar
    }),
    computed: {
        show() {
            return this.$store.state.showCheckin.showCheckin.show;
        }
    },
    watch: {
        show(val) {
            this.modalStatus = val;
            if(val) this.getUserCheckin();
        }
    },
    methods: {
        // 处理签到
        handleCheckin() {
            addAccessToken().put(
                    createAPI(`user/checkin`), { validateStatus: status => status === 204 }
                )
                .then(response => {
                    this.getUserCheckin();
                })
                .catch(({ response: { data = { message: '' } } }) => {
                    this.$Message.error(this.$MessageBundle(data).getMessage());
                });
        },
        // 获取用户签到信息
        getUserCheckin() {
            addAccessToken().get(
                    createAPI(`user/checkin`), { validateStatus: status => status === 200 }
                )
                .then(({ data } = {}) => {
                    const { checked_in, rank_users, checkin_count, attach_balance, last_checkin_count } = data;
                    this.checked_in = checked_in;
                    this.rank_users = rank_users;
                    this.checkin_count = checkin_count;
                    this.attach_balance = attach_balance;
                    this.last_checkin_count = last_checkin_count;
                })
                .catch(({ response: { data = { message: '' } } }) => {
                    this.$Message.error(this.$MessageBundle(data).getMessage());
                });
        },
        // 关闭签到框
        handleOffModal() {
            this.$store.dispatch(SHOWCHECKIN, cb => {
                cb(false);
            });
        }
    }
};
export default checkinLayer;
</script>