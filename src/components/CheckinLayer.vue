<template>
    <Modal
        v-model="show"
        :styles="{top: '90px'}" width="250">
        <div :class="$style.checkinContainer">

        <h2>+{{ attach_balance }}</h2>
        <h2>累计签到 {{ checkin_count }}</h2>
        <Button @click.native="handleCheckin" :disabled="checked_in">{{ checked_in ? '已签到' : '签到' }}</Button>
        <div v-for="(user, index) in rank_users">
          <b>{{ index+1 }}</b>
          <img :src="user.avatar" style="height:50px;width:50px;">
        </div>
        </div>
    </Modal>
</template>

<script>
import { mapState } from 'vuex';
import SHOWCHECKIN from '../stores/types';
import { createAPI, addAccessToken } from '../utils/request';
import storeLocal from 'store';
const UserLoginInfo = storeLocal.get('UserLoginInfo') || {};

const checkinLayer = {
  data: () => ({
    // 当日签到状态 true 已签到 false 未签到
    checked_in: false,
    // 当日前五签到用户，按照签到时间顺序排列
    rank_users: [],
    // 当前用户签到总天数
    checkin_count: 0,
    // 当前用户连续签到天数
    attach_balance: 0,
    // 签到用户积分增加值，单位是真实货币「分」单位
    last_checkin_count: 0,
  }),
  props:['config'],
  computed: {
    ...mapState({
      show: state => state.showCheckin.showCheckin.show,
    }),
  },
  watch:{
    show (val) {
      if (val) {
       this.getUserCheckin();
      }
    }
  },
  methods: {
    // 处理签到
    handleCheckin () {
        addAccessToken().put(
          createAPI(`user/checkin`),
          { validateStatus: status => status === 204 }
        )
        .then(response => {
          this.checked_in = true;
        })
        .catch(({ response: { data = { message: '' } } }) => {
          this.$Message.error(this.$MessageBundle(data).getMessage());
        });
    },
    // 获取用户签到信息
    getUserCheckin () {
        addAccessToken().get(
          createAPI(`user/checkin`),
          { validateStatus: status => status === 200 }
        )
        .then(( { data } = {} ) => {
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
    }
  }
};

export default checkinLayer;
</script>
<style lang="less" module>
  .checkinContainer {

  }
</style>
