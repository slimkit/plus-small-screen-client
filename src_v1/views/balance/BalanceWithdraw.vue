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
          <BackIcon v-if="!isWeixin" @click.native="goBack()" height="21" width="21" color="#333" />
        </Col>
        <Col span="14" class="title-col">
          提现记录
        </Col>
      </Row>
    </header>
    <div class="nothingDefault"> 
      <img v-if="nothing" :src="nothing" />
    </div>
    <div :style="{ height: wrapperHeight + 'px' }" :class="$style.pageLoadmoreWrapper" ref="wrapper" v-if="!nothing">
      <mt-loadmore
        :bottom-method="loadBottom"
        :top-method="loadTop"
        :bottom-all-loaded="bottomAllLoaded"
        :top-all-loaded="topAllLoaded"
        ref="loadmore"
        :bottomDistance="70"
        @bottom-status-change="bottomStatusChange"
        :class="$style.recordLoadMore"
      >
        <section>
          <Row 
            :gutter="24"
            v-for="(record, index) in withdrawRecords"
            :key="index"
            :class="$style.recordList"
            @click.native="showDetail(index)"
          >
            <Col span="4" :class="$style.time">
              <span>{{ localTime(record.created_at)['weekDay'] }}</span>
              <span>{{ localTime(record.created_at)['date'] }}</span>
            </Col>
            <Col span="15" :class="$style.recordBody">{{ record.type === 'wechat' ? '微信 ' : '支付宝 ' }} 账户提现</Col>
            <Col span="5" class="header-end-col" style="color: #bfbfbf">{{ record.status === 1 ? '提现成功' : ( record.status === 0 ? '待审核' : '被驳回') }}</Col>
          </Row>
        </section>
        <div slot="bottom" :class="['mint-loadmore-bottom', $style.mintLoadmoreBottom]">
          <span v-if="bottomAllLoaded">没有更多了</span>
          <section v-else>
            <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
            <span v-show="bottomStatus === 'loading'">加载中...</span>
            <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
          </section>
        </div>
      </mt-loadmore>
    </div>
    <Modal 
        v-model="detailOpen"
        @on-cancel="closeModal"
        :mask-closable="false"
      >
        <p slot="header" style="text-align:center">
            <span>提现详情</span>
        </p>
        <section style="text-align:center">
          <Row :gutter="24" type="flex" justify="space-around" style="padding-top: 16px; font-size: 14px;">
            <Col span="24" :class="$style.textAlignLeft">
              <p style="color: #bfbfbf;">{{ detail.status === 1 ? '提现成功' : ( detail.status === 0 ? '待审核' : '被驳回') }}</p>
            </Col>
          </Row>
          <Row :gutter="24" style="padding-top: 16px;">
            <Col span="24" :class="$style.textAlignLeft">
              <h1>{{ showAmount(detail.value) }}</h1>
            </Col>
          </Row>
        </section>
        <section style="margin-top: 16px;">
          <Row :gutter="24" :class="$style.recordDetail">
            <Col span="8" :class="$style.detailLabel">交易账户</Col>
            <Col
              span="16"
            >
              {{ detail.account }}
            </Col>
          </Row>
          <Row :gutter="24" :class="$style.recordDetail">
            <Col span="8" :class="$style.detailLabel">交易说明</Col>
            <Col span="16" style="word-break: break-all;">提现</Col>
          </Row>
          <Row :gutter="24" :class="$style.recordDetail">
            <Col span="8" :class="$style.detailLabel">交易时间</Col>
            <Col span="16">{{ localDateTime(detail.created_at) }}</Col>
          </Row>
        </section>
        <div slot="footer"></div>
      </Modal>
  </div>
</template>
<style lang='less' module>
  .commonHeader {
    position: fixed!important;
    top: 0;
    width: 100vw;
  }
  .pageLoadmoreWrapper {
    overflow: scroll;
    top: 46px;
    width: 100%;
    position: fixed;
    -webkit-overflow-scrolling: touch;
    .recordLoadMore {
      .mintLoadmoreBottom {
        margin-bottom: -50px;
      }
    }  
  }
  
  .recordDetail {
    border-bottom: 1px solid #ededed;
    font-size: 14px;
    padding: 8px 0;
    &:last-child {
      border-bottom: none;
    }
    .detailLabel {
      color: #bfbfbf;
    }
  }
  .textAlignLeft {
    text-align: left;
  }
  .textAlignRight {
    text-align: right;
  }
  .time {
    span {
      font-size: 12px;
      color: #bfbfbf;
      display: block;
      text-align: center;
    }
  }
  .recordList {
    background-color: #fff;
    padding-top: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #efefef;
    &:last-child {
      border-bottom: none;
    }
    .recordBody {
      text-align: initial;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
  }
</style>
<script>
  import { createAPI, addAccessToken} from '../../utils/request';
  import { resolveImage } from '../../utils/resource';
  import BackIcon from '../../icons/Back';
  import _ from 'lodash';
  import {showAmount} from '../../utils/balance';

  const nothingImg = resolveImage(require('../../statics/images/defaultNothingx3.png'));
  
  const BalanceWithdraw = {
    components: {
      BackIcon
    },
    data: () => ({
      showSpinner: false,
      isWeixin: window.TS_WEB.isWeiXin,
      withdrawRecords: [],
      limit: 20,
      after: 0,
      detailOpen: false,
      detailIndex: -1,
      bottomAllLoaded: true,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      wrapperHeight: 0
    }),

    created () {
      this.getWithdraws();
    },

    methods: {
      showAmount,
      getWithdraws (type = 'new') {
        if (type === 'new') this.showSpinner = true;
        const { limit, after } = this;
        let params = {
          limit
        };

        if (type === 'loadMore') params.after = after;

        addAccessToken().get(
          createAPI('wallet/cashes'),
          {
            params
          },
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data = []}) => {
          this.bottomAllLoaded = true;
          let length = data.length;

          if (length == this.limit && type !== 'loadNew') this.bottomAllLoaded = false; // 底部加载完毕
          
          if (type === 'new') {
            this.withdrawRecords = data;
            this.showSpinner = false;
            this.after = _.last(data)['id'];
            data = [];

            return ;
          }

          if (type === 'loadMore') {
            this.after = _.last(data)['id'];
            this.withdrawRecords = _.uniqBy([ ...this.withdrawRecords, ...data ], 'id');
            setTimeout( () => {
              this.$refs.loadmore.onBottomLoaded();
            }, 800);
            data = [];

            return;
          }

          if (type === 'loadNew') {
            this.withdrawRecords = _.uniqBy([
              ...data,
              ...this.withdrawRecords
            ], 'id');
            setTimeout( () => {
              this.$refs.loadmore.onTopLoaded();
            }, 800);
            data = [];

            return;
          }
        })
        // .catch(({ response: { data } }) => {
        //   console.log(data);
        // })
      },
      /**
       * 底部加载更多
       * @return {[type]} [description]
       */
      loadBottom () {
        this.getWithdraws('loadMore');
      },
      /**
       * 加载新的记录
       * @return {[type]} [description]
       */
      loadTop () {
        this.getWithdraws('loadNew');
      },
      /**
       * 底部状态改变
       * @param  {[type]} status [description]
       * @return {[type]}        [description]
       */
      bottomStatusChange(status) {
        this.bottomStatus = status;
      },
      /**
       * 开启modal
       * @param  {[type]} index 列表的index
       * @return {[type]} null
       */
      showDetail (index) {
        this.$refs.wrapper.style.overflowY = 'hidden';
        this.detailOpen = true;
        this.detailIndex = index;
      },
      /**
       * 关闭modal
       * @return {[type]} [description]
       */
      closeModal () {
        setTimeout( () => {
          this.detailIndex = -1;
          this.$refs.wrapper.style.overflow = 'scroll';
        }, 500);
      },
      /**
       * 回到上一页
       * @return {[type]} [description]
       */
      goBack () {
        if(window.history.length < 2) {
          this.$router.push('/balance');
          return;
        }
        this.$router.back();
      },
      localDateTime(time) {
        return (new Date(`${time}Z`)).toLocaleString();
      },
      localTime (dateString) {
        dateString = `${dateString}Z`;
        let newDate = new Date(dateString);
        let today = (new Date()).toLocaleDateString();
        let yesterday = (new Date(new Date()-86400000)).toLocaleDateString();
        let createdString = newDate.toLocaleDateString();
        let week = '';
        let weekDay = '';
        let date = '';
        if (createdString !== today && createdString !== yesterday) {
          week = newDate.getDay();
          switch (week) {
            case 1: 
              weekDay = '周一';
              break;
            case 2:
              weekDay = '周二';
              break
            case 3: 
              weekDay = '周三';
              break;
            case 4:
              weekDay = '周四';
              break;
            case 5:
              weekDay = '周五';
              break;
            case 6: 
              weekDay = '周六';
              break;
            case 0:
              weekDay = '周日';
              break;
          };
        }

        if (createdString === today) {
            weekDay =  '今天';
        }
        if (createdString === yesterday) {
          weekDay = '昨天';
        }
        return {
          weekDay,
          date: (newDate.getMonth() + 1) + '-' + newDate.getDate()
        };
      },
    },

    computed: {
      nothing () {
        return this.withdrawRecords.length == 0 ? nothingImg : 0;
      },

      detail () {
        const { detailIndex } = this;
        if (detailIndex === -1) return {};
        let detail = this.withdrawRecords[detailIndex] || {};
        
        return detail;
      },
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - 46;
    }
  };

  export default BalanceWithdraw;
</script>