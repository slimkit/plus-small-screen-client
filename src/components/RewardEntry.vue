<template>
  <div>
    <Row :gutter="24" type="flex" align="middle" justify="center">
      <Col class-name="center" span="6">
        <Button @click.native="openReward" type="error" size="small">打赏</Button>
      </Col>
    </Row>
    <Row :gutter="24" type="flex" align="middle" justify="center">
      <Col class-name="center" span="12">
        <span class="center_count">{{reward.count}}</span>人打赏，共<span class="center_count">{{ showAmount(reward.amount) }}</span>{{ goldName }}
      </Col>
    </Row>
    <Row :gutter="24" type="flex" align="middle" justify="center" >
      <Col span="24" class-name="center" @click.native="openRewardList">
        <img v-lazy="rewardUser" class="rewardUser" alt="" v-for="(rewardUser, index) in formatedRewardUsers">
        <i v-show="rewardUsers.length"> ></i>
      </Col>
    </Row>
    <Modal v-model="rewardOpen" width="80vw">
      <p slot="header" style="text-align:center">
          <span>打赏</span>
      </p>
      <div style="text-align:center">
        <Row :gutter="24" style="border-bottom: 1px solid #e9eaec; padding-bottom: 16px;">
          <Col span="8" v-for="(item, index) in items" :key="index">
            <Button @click.native="setAmount(trueAmount(item))" :class="['ivu-btn', 'ivu-btn-ghost', {active: amount === item && customAmount === ''}]">{{ item }} </Button>
          </Col>
        </Row>
        <Row :gutter="24" type="flex" justify="space-around" style="padding-top: 8px; font-size: 14px;">
          <Col span="12" class-name="text-align-left">
            <label for="account">自定义{{ goldName }}数量</label>
          </Col>
          <Col span="12"  class-name="text-align-right">
            <input type="number" style="width: 100%;" autocomplete="off" dir="rtl" :placeholder="`输入${goldName}数量`" v-model.number="customAmount" />
          </Col>
        </Row>
      </div>
      <div slot="footer">
          <Button type="ghost" @click="resetReward">重置</Button>
          <Button type="primary" @click="doReward" :disabled="!amount && !customAmount" :loading="modal_loading">打赏</Button>
      </div>
    </Modal>
    <Modal
      v-model="rewardListOpen"
      class-name="full-screen-modal"
    >
      <p slot="header" style="text-align:center">
          <span>打赏列表</span>
      </p>
      <mt-loadmore
        v-if="!nothing"
        :bottom-method="loadBottom"
        :top-method="loadTop"
        :bottom-all-loaded="bottomAllLoaded"
        :top-all-loaded="topAllLoaded"
        @bottom-status-change="bottomStatusChange"
        ref="loadMoreLists"
        :bottomDistance="70"
      >
        <Row 
          :gutter="24" 
          style="border-bottom: 1px solid #e9eaec; padding: 16px 0; background-color: #fff;"
          v-for="(user, index) in formatedRewardUsersList"
          :key="index"
          type="flex"
          align="middle"
          justify="center"
        >
          <Col span="4" class-name="content">
            <img v-lazy="user.avatar" :alt="user.uname" />
          </Col>
          <Col span="14" class-name="content">
            <span>{{ user.uname }} </span>打赏了文章
          </Col>
          <Col span="6" class-name="left-content">
            <timeago style="color: #ccc; font-size: 12px;" :since="timers(user.time, 8, false)" locale="zh-CN" :auto-update="60"></timeago>
          </Col>
        </Row>
        <div slot="bottom" class="mint-loadmore-bottom">
          <span v-show="bottomAllLoaded">没有更多了</span>
          <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
          <span v-show="bottomStatus === 'loading'">加载中...</span>
          <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
        </div>
      </mt-loadmore>
      <div slot="footer" style="border-top: none;">
        
      </div>
    </Modal>
  </div>
</template>

<style lang="less">
  .rewardUser {
    width: 8vw;
    padding: 0 1vw;
  }
  .text-align-left {
    text-align: left;
  }
  .text-align-right {
    text-align: right;
  }
  .center {
    text-align: center;
    font-size:12px;
    padding: 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      color: #fff;
      &.center_count {
        color: #ed3f14;
      }
    }
    i {
      font-style: normal;
      color: #ccc;
      font-size: 16px;
    }
  }
  .full-screen-modal {
    overflow: hidden;
    .ivu-modal {
      margin: 0;
      width: 100vw;
      height: 100vh;
      top: 0;
      .ivu-modal-content {
        border-radius: 0;
        height: 100vh;
        overflow: hidden;
        .ivu-modal-header {
          position: fixed;
          top: 0;
          width: 100vw;
          width: 100vw;
          height: 46px;
          display: flex;
          align-items: center;
          background: #fff;
          z-index: 9;
        }
        .ivu-modal-close {
          z-index: 10;
        }
        .ivu-modal-body {
          overflow: scroll;
          height: calc(~"100% - 46px");
          position: fixed;
          top: 46px;
          width: 100%;
          padding: 0;
          background-color: #f4f5f5;
          .mint-loadmore-bottom {
            margin-bottom: -50px;
            font-size: 14px;
          }
          .mint-loadmore-top {
            font-size: 14px;
          }
        }
        .ivu-modal-footer {
          border-top: none;
          padding: 0;
        }
        .left-content {
          text-align: right;
        }
        .content {
          text-align: left;
          color: #ccc;
          img {
            width: 100%;
          }
          span {
            color: #000;
          }
        }
      }
    }
  }
</style>

<script>
  import { createAPI, addAccessToken } from '../utils/request';
  import PlusMessageBundle from '../utils/es';
  import { resolveImage } from '../utils/resource';
  import _ from 'lodash';
  import timers from '../utils/timer';
  import { showAmount, trueAmount }from '../utils/balance';
  import storeLocal from 'store';

  const defaultNobody = resolveImage(require('../statics/images/img_default_nobody@2x.png'));
  const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));

  const rewardsUsers = {

    // 前三个用户组装请求的url，由于考虑到接口不相同的情况，
    props: {
      'component': String, // API前缀 例如 feeds
      'rewardableId': Number, // 被打赏的资源 例如 5
      'apiMethod': String, // API方法 例如 rewards/rewarders
      'source': Object // 被打赏的数据源
    },
    data: () => ({
      items: [],
      ratio: 100,
      goldName: window.TS_WEB.goldName,
      rewardListOpen: false, // 打赏用户列表modal开关
      rewardOpen: false, // 打赏开关控制
      amount: 0, // 打赏金额
      customAmount: '', // 自定义金额
      modal_loading: false,
      rewardUsers: [], // 打赏用户列表
      bottomAllLoaded: false,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      order_type: 'date', // 根据打赏金额进行查询
      limit: 20,
      since: 0, // 金额查询节点
      order: 'desc' // 排序方式
    }),

    created () {
      this.getRewardUsers(this.rewardable_id, 'new');
    },

    computed: {
      formatedRewardUsers () {
        const { rewardUsers } = this;
        let twentyUser = _.chunk(rewardUsers, 10)[0] || [];
        let formated = [];
        twentyUser.reverse().forEach( rewardUser => {

          formated.push( rewardUser.user.avatar ? rewardUser.user.avatar : defaultAvatar);
        })
        return formated;
      },

      nothing () {
        const { rewardUsers } = this;
        return rewardUsers.length === 0 ? defaultNobody : 0;
      },

      formatedRewardUsersList () {
        const { rewardUsers } = this;
        let formated = [];
        rewardUsers.forEach( rewardUser => {

          formated.push({
            avatar: rewardUser.user.avatar ? rewardUser.user.avatar : defaultAvatar,
            uname: rewardUser.user.name,
            time: rewardUser.created_at
          });
        })
        return formated;
      },

      reward () {
        const { source: { reward: { amount = 0, count = 0 } = {} } = {} } = this
        return  { amount: amount === null ? 0 : amount, count: count };
      }
    },

    watch: {
      customAmount: function (newCustomAmount) {
        if (newCustomAmount !== '') {
          this.resetAmount();
        }
      }
    },

    methods: {
      showAmount,
      trueAmount,
      timers,
      loadBottom () {
        this.getRewardUsers(this.rewardableId, 'loadMore');
      },
      loadTop() {
        this.getRewardUsers(this.rewardableId, 'loadNew');
      },
      bottomStatusChange(status) {
        this.bottomStatus = status;
      },
      openRewardList () {
        this.rewardListOpen = true;
      },
      getRewardUsers (rewardable_id, type = 'new') {
        const { limit, since, order_type, order } = this;
        let params = {
          limit,
          order_type,
          order
        };

        if (type === 'loadMore') params.since = since;

        addAccessToken().get(createAPI(`${this.component}/${this.rewardableId}/${this.apiMethod}`), {
          params
        },
        {
          validateStatus: status => status === 200
        })
        .then(({ data = [] }) => {

          if (type === 'new') {
            this.rewardUsers = data;
            this.since = _.last(data)['id'] || 0;
            if (data.length < limit) this.bottomAllLoaded = true;
          }

          if (type === 'loadMore') {
            this.rewardUsers = _.uniqBy([ ...this.rewardUsers, ...data ], 'id');
            this.since = _.last(data)['id'] || 0;
            if (data.length < limit) this.bottomAllLoaded = true;
            setTimeout( () => {
              this.$refs.loadMoreLists.onBottomLoaded();
            }, 800);
          }

          if (type === 'loadNew') {
            this.rewardsUsers = _.uniqBy([
              ...data,
              ...this.rewardUsers
            ], 'id');
            setTimeout( () => {
              this.$refs.loadMoreLists.onTopLoaded();
            }, 800);
          }
        })
        .catch(({ response: { data } = {} }) => {
          console.log(data);
        })
      },
      // 重置打赏金额
      resetReward () {
        this.amount = 0;
        this.customAmount = '';
      },

      resetAmount () {
        this.amount = 0;
      },

      // 按钮点击设置打赏金额
      setAmount (amount) {
        this.amount = amount;
        this.customAmount = '';
      },

      // 开启打赏界面
      openReward () {
        this.rewardOpen = true;
      },

      // 执行打赏操作
      doReward () {
        const { customAmount, amount, source: { reward : { amount : oldAmount = 0, count: oldCount = 0 } } } = this;
        if (!amount && !customAmount) {
          return;
        }

        let postAmount = 0;

        if (customAmount ) postAmount = trueAmount(customAmount);
        if (amount) postAmount = amount;
        this.modal_loading = true;

        addAccessToken().post(createAPI(`${this.component}/${this.rewardableId}/${this.apiMethod}`), {
          amount: postAmount
        },
        {
          validateStatus: status => status === 201
        })
        .then( ({ data }) => {
          this.modal_loading = false;
          this.rewardOpen = false;
          this.resetReward();
          this.source.reward.amount = oldAmount === null ? postAmount : parseInt(oldAmount) + postAmount;
          this.source.reward.count  = oldCount + 1;
          this.$Message.success(PlusMessageBundle(data).getMessage());
          this.getRewardUsers(this.rewardableId);
        })
        .catch( ({ response: { data } = {} }) => {
          this.modal_loading = false;
          this.$Message.error(PlusMessageBundle(data).getMessage());
        })
      }
    },

    mounted () {
      this.items = storeLocal.get('rewardSetting')['items'] || [];
      this.ratio = storeLocal.get('ratio') || 100;
    }
  };

  export default rewardsUsers;
</script>