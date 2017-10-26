<template>
  <div>
    <div id="spinner" v-show="showSpinner">
      <div id="spinner-parent">
        <div class="spinner-double-bounce-bounce2" />
        <div class="spinner-double-bounce-bounce1" />
      </div>
    </div>
    <header :class="['commonHeader', $style.commonHeader]" id="balance-header">
      <Row :gutter="24">
        <Col span="5" style="display: flex; justify-content: flex-start">
          <BackIcon v-if="!isWeixin" @click.native="$router.push('/users/profile')" height="21" width="21" color="#fff" />
        </Col>
        <Col span="12" class="title-col">
          <div>
            <span :class="$style.newsTitle" style="font-size: 18px; padding: 0 5px">钱包</span>
          </div>
        </Col>
        <Col span="7" class="header-end-col">
          <router-link :class="$style.toRecords" to="/balance/records">收支细明</router-link>
        </Col>
      </Row>
    </header>
    <section :class="$style.balanceContent">
      <Row :gutter="24">
        <Col span="24" align="middle" type="flex">
          <p>账户余额({{ goldName }})</p>
        </Col>
      </Row>
      <Row :gutter="24" align="middle" type="flex">
        <Col span="24">
          <h1>
            {{ showAmount(balance) }}
          </h1>
        </Col>
      </Row>
    </section>
    <section :class="$style.operations">
      <Row :gutter="24" :class="$style.operation" @click.native="openRecharge">
        <Col span="20">
          充值
        </Col>
        <Col span="4" class="header-end-col">
          <RightArrowIcon height="21" width="21" color="#bfbfbf" />
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.operation" @click.native="openWithdraw">
        <Col span="20">
          提现
        </Col>
        <Col span="4" class="header-end-col">
          <RightArrowIcon height="21" width="21" color="#bfbfbf" />
        </Col>
      </Row>
    </section>
    <section class="button-operation">
      <Row :gutter="24">
        <Col span="12">
          <Button class="rule-operation" size="large" long type="text" @click.native="showRule">充值/提现规则</Button>
        </Col>
        <Col span="12">
          <router-link to='/balance/withdraws'>提现记录</router-link>
        </Col>
      </Row>
    </section>
    <Modal 
      v-model="rechargeOpen"
      @on-cancel="resetAllRecharge"
    >
      <p slot="header" style="text-align:center">
          <span>充值</span>
      </p>
      <div style="text-align:center">
        <Row :gutter="24" style="border-bottom: 1px solid #e9eaec; padding-bottom: 16px;">
          <Col span="8" v-for="(label, index) in system.labels" :key="index">
            <Button @click.native="setRecharge(label)" :class="['ivu-btn', 'ivu-btn-ghost', {active: rechargeNum === label && customRecharge === ''}]">{{ showAmount(label) }}</Button>
          </Col>
        </Row>
        <Row :gutter="24" type="flex" justify="space-around" style="padding-top: 8px; font-size: 14px;">
          <Col span="12" :class="$style.textAlignLeft">
            <label for="account">自定义{{goldName}}数量</label>
          </Col>
          <Col span="12"  :class="$style.textAlignRight">
            <input type="number" dir="rtl" :class="$style.balanceInput" autocomplete="off" :placeholder="`输入${goldName}数量`" v-model.number="customRecharge" />
          </Col>
        </Row>
      </div>
      <div style="text-align: center; padding-top: 16px">
        <Row :gutter="24">
          <Col span="24" :class="$style.textAlignLeft">
            <Select v-model="rechargeType" size="large" placeholder="选择充值方式">
              <Option v-for="item in rechargeTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </div>
      <div slot="footer">
          <Button type="primary" size="large" long @click="doRecharge" :disabled="!rechargeNum && !customRecharge || !rechargeType" :loading="modal_loading">确定</Button>
      </div>
    </Modal>
    <Modal 
      v-model="withdrawOpen"
      @on-cancel="resetAllWithdraw"
    >
      <p slot="header" style="text-align:center">
          <span>提现</span>
      </p>
      <div style="text-align:center">
        <Row :gutter="24" type="flex" justify="space-around" style="padding-top: 8px; font-size: 14px;">
          <Col span="12" :class="$style.textAlignLeft">
            <label for="account">提现数量</label>
          </Col>
          <Col span="12"  :class="$style.textAlignRight">
            <input dir="rtl" :class="$style.balanceInput" type="number" autocomplete="off" :placeholder="`输入${ goldName }数量`" v-model.number="withdrawNum" />
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="24" :class="$style.textAlignLeft">
            <Select v-model="withdrawType" size="large" placeholder="选择提现方式">
              <Option v-for="item in withdrawTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
        <Row :gutter="24" type="flex" justify="space-around" style="padding-top: 8px; font-size: 14px;">
          <Col span="12" :class="$style.textAlignLeft">
            <label for="account">提现账户</label>
          </Col>
          <Col span="12"  :class="$style.textAlignRight">
            <input :class="$style.balanceInput" dir="rtl" type="text" autocomplete="off" placeholder="输入提现账户" v-model.number="account" />
          </Col>
        </Row>
      </div>
      <div slot="footer">
          <Button type="primary" size="large" long @click="doWithdraw" :disabled="!withdrawNum || !withdrawType || !account" :loading="modal_loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<style lang="less" module>
  .commonHeader {
    color: #fff!important;
    background-color: #59b6d7!important;
    border-bottom: none!important;
    .toRecords {
      color: #fff;
    }
  }
  .balanceContent {
    background-color: #59b6d7;
    p, h1 {
      color: #fff;
      text-align: left;
    }
    p {
      font-size: 12px;
      padding-top: 24px;
    }
    h1 {
      padding-top: 36px;
      padding-bottom: 12px;
      font-weight: 400;
      font-size: 40px;
    }
  }
  .operations {
    background-color: #fff;
    .operation {
      padding: 12px 0;
      border-bottom: 1px solid #efefef;
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .textAlignLeft {
    text-align: left;
  }
  .textAlignRight {
    text-align: right;
    .balanceInput {
      width: 100%;
    }
  }
</style>
<style lang="less">
  .button-operation {
    position: fixed;
    bottom: 2vh;
    width: 100vw;
    text-align: center;
    .rule-operation {
      &.ivu-btn-text {
        background-color: rgba(255,255,255, 0);
      }
    }
  }
  .ivu-modal-confirm-body {
    div {
      word-break: break-all;
    }
  }
</style>

<script>
  import pingPP from 'pingpp-js';
  import { createAPI, addAccessToken, createRequestURI } from '../../utils/request';
  import BackIcon from '../../icons/Back';
  import RightArrowIcon from '../../icons/RightArrow';
  import _ from 'lodash';
  import PlusMessageBundle from '../../utils/es';
  import {showAmount} from '../../utils/balance';
  
  const Balance = {
    components: {
      BackIcon,
      RightArrowIcon
    },
    data: () => ({
      goldName: window.TS_WEB.goldName,
      isWeixin: window.TS_WEB.isWeiXin, // 微信客户端
      showSpinner: false, // 加载动画开关
      system: {
        ratio: 100, // 显示比例
        recharge_type: [], // 充值方式
        cash: [], // 提现方式
        rule: '', // 提现/充值规则
        case_min_amount: 1, // 最低提现真实金额
        labels: [] // 充值选项
      },
      rechargeOpen: false, // 开启充值modal
      customRecharge: '', // 自定义充值金额
      balance: 0, // 账户余额
      rechargeNum: 0, // 充值金额
      withdrawNum: '', // 提现金额
      records: [], // 细明记录
      withdrawRecords: [], // 提现细明
      modal_loading: false,
      rechargeType: '', // 充值方式
      withdrawOpen: false, // 提现modal开关
      withdrawType: '', // 提现账号类型 支付宝/微信
      account: '' // 提现账户
    }),

    mounted () {
      const { user_id } = this.$storeLocal.get("UserLoginInfo");
      const { wallet: { balance = 0 } } = this.$storeLocal.get(`user_${user_id}`);
      this.balance = balance;

      this.wallet(); // 获取钱包配置

      let charge = this.$storeLocal.get('chargeId');
      if (charge) {
        addAccessToken().get(
          createAPI(`wallet/charges/${charge}?mode=retrieve`),
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data: { status = 0, amount = 1, action = 1 } = {} }) => {
          this.$storeLocal.remove('chargeId');
          if (!status) {
            this.$Message.warning({
              content: '充值未成功,请稍后在细明中查询',
              duration: 3
            });
            return;
          }
          if (status) {
            if (action === 1) {
              this.balance = this.balance += amount;
              this.$Message.success({
                content: '充值成功',
                duration: 3
              });
              return;
            }

            if (action === 2) {
              this.$Message.success({
                content: '操作成功',
                duration: 3
              });
              return;
            }
          }
        })
        // 正常逻辑
      }
    },

    watch: {
      customRecharge: function (newcustomRecharge) {
        if (newcustomRecharge !== '') {
          this.resetRecharge();
        }
      }
    },

    methods: {
      showAmount,
      /**
       * 充值操作
       * @return {[type]} [description]
       */
      doRecharge() {
        const { customRecharge, rechargeNum, balance, rechargeType } = this;
        if ((!customRecharge && !rechargeNum) || !rechargeType) {
          return;
        }

        let data = {};
        if (customRecharge ) data.amount = customRecharge * 100;
        if (rechargeNum) data.amount = rechargeNum;

        data.type = rechargeType;

        if (rechargeType === 'alipay_wap') {
          data = {
            ...data,
            extra: {
              success_url: createRequestURI('h5/balance')
            }
          }
        }

        addAccessToken().post(
          createAPI('wallet/recharge'),
          {
            ...data
          },
          {
            validataStatus: status => status === 201
          }
        )
        .then(({ data: { charge = {}, id } }) => {
          this.$storeLocal.set('chargeId', id);
          pingPP.createPayment(charge, function(result, err) {
            if (result=="success") {
              // payment succeeded
            } else {
              console.log(result+" "+err.msg+" "+err.extra);
            }
          });
        })
      },
      /**
       * 提现申请操作
       * @return {[type]} [description]
       */
      doWithdraw () {
        const { account, withdrawNum, withdrawType } = this;
        if (!account || !withdrawNum || !withdrawType) {
          return;
        }

        addAccessToken().post(
          createAPI('wallet/cashes'),
          {
            account,
            type: withdrawType,
            value: withdrawNum * this.system.ratio
          },
          {
            validataStatus: status => status === 201
          }
        )
        .then( () => {
          this.$Message.info({
            content: '提交成功,等待审核',
            duration: 3
          });
          this.withdrawOpen = false;
          this.resetAllWithdraw();
        })
        .catch(({response: { data } }) => {
          this.$Message.error({
            content: PlusMessageBundle(data).getMessage(),
            duration: 3
          })
        })
      },
      /**
       * 开启充值modal
       * @return {[type]} [description]
       */
      openRecharge () {
        this.rechargeOpen = true;
      },
      /**
       * 开启提现modal
       * @return {[type]} [description]
       */
      openWithdraw () {
        this.withdrawOpen = true;
      },
      /**
       * 获取钱包配置
       * @return {[type]} [description]
       */
      wallet () {
        addAccessToken().get(
          createAPI('wallet'),
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data = {} }) => {
          this.system = {
            ...this.system,
            ...data
          };
          this.$storeLocal.set('ratio', data.ratio);
          if (!this.$storeLocal.get('showChargeRule')) {
            this.showRule();
            this.$storeLocal.set('showChargeRule', 1);
          }
        })
      },

      /**
       * 重置充值金额
       * @return {[type]} [description]
       */
      resetAllRecharge () {
        this.customRecharge = '';
        this.rechargeNum = 0;
        this.rechargeType = '';
      },

      /**
       * 重置提现选项
       * @return {[type]} [description]
       */
      resetAllWithdraw () {
        this.withdrawNum = '';
        this.withdrawType = '';
        this.account = ''
      },
      /**
       * 自定义金额时将选项置空
       * @return {[type]} [description]
       */
      resetRecharge () {
        this.rechargeNum = 0;
      },
      setRecharge (num) {
        this.rechargeNum = num;
        this.customRecharge = '';
      },

      showRule () {
        const { system: { rule = ''} } = this;
        this.$Modal.info({
          title: '充值/提现规则',
          content: rule,
          okText: '朕知道了'
        });
      }
    },

    computed: {
      rechargeTypes () {
        let rechargeTypes = [];
        const { system: { recharge_type: types = [] } = {} } = this;
        if (_.indexOf(types, 'alipay_wap') !== -1 && !this.isWeixin) {
          rechargeTypes.push({
            value: 'alipay_wap',
            label: '支付宝'
          });
        }

        if (_.indexOf(types, 'wx_wap') !== -1 && this.isWeixin) {
          rechargeTypes.push({
            value: 'wx_wap',
            label: '微信'
          })
        }

        return rechargeTypes || [];
      },

      withdrawTypes () {
        let withdrawTypes = [];
        const { system: { cash = [] } } = this;
        if (_.indexOf(cash, 'alipay') !== -1) {
          withdrawTypes.push({
            label: '支付宝',
            value: 'alipay'
          });
        }

        if (_.indexOf(cash, "wechat") !== -1) {
          withdrawTypes.push({
            label: '微信',
            value: 'wechat'
          });
        }

        return withdrawTypes || [];
      }
    }
  };

  export default Balance;
</script>