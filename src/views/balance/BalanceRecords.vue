<template>
  <div>
    <template>
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
            <Dropdown 
              trigger="click"
              style="margin-left: 20px"
              @on-click="(name) => {
                recordsType(name);
              }"
            >
              <span>
                  {{ menuText }}
                  <Icon type="arrow-down-b"></Icon>
              </span>
              <DropdownMenu slot="list">
                  <DropdownItem :selected="action === ''" name="all">全部</DropdownItem>
                  <DropdownItem name="in" :selected="action === 1" :divided="true">收入</DropdownItem>
                  <DropdownItem name="out" :selected="action === 0" :divided="true">支出</DropdownItem>
              </DropdownMenu>
          </Dropdown>
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
              v-for="(record, index) in records"
              :key="index"
              :class="$style.recordList"
              @click.native="showDetail(index)"
            >
              <Col span="4" :class="$style.time">
                <span>{{ localTime(record.created_at)['weekDay'] }}</span>
                <span>{{ localTime(record.created_at)['date'] }}</span>
              </Col>
              <Col span="15" :class="$style.recordBody">{{ record.subject }}</Col>
              <Col span="5" class="header-end-col" style="color: #ff9400">{{ record.action === 0 ? '-' : '+' }}{{ showAmount(record.amount) }}</Col>
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
            <span>账户详情</span>
        </p>
        <section style="text-align:center">
          <Row :gutter="24" type="flex" justify="space-around" style="padding-top: 16px; font-size: 14px;">
            <Col span="24" :class="$style.textAlignLeft">
              <p style="color: #bfbfbf;">{{ detail.status === 1 ? '交易成功' : '交易失败' }}</p>
            </Col>
          </Row>
          <Row :gutter="24" style="padding-top: 16px;">
            <Col span="24" :class="$style.textAlignLeft">
              <h1>{{ detail.action === 1 ? "+ " : "- " }}{{ showAmount(detail.amount) }}</h1>
            </Col>
          </Row>
        </section>
        <section style="margin-top: 16px;">
          <Row :gutter="24" :class="$style.recordDetail">
            <Col span="6" :class="$style.detailLabel">{{ detail.action === 1 ? '付款人' : '收款人' }}</Col>
            <Col
              span="18"
            >
              <AccountComponent :detail="detail" />
            </Col>
          </Row>
          <Row :gutter="24" :class="$style.recordDetail">
            <Col span="6" :class="$style.detailLabel">交易说明</Col>
            <Col span="18" style="word-break: break-all;">{{ detail.body }}</Col>
          </Row>
          <Row :gutter="24" :class="$style.recordDetail">
            <Col span="6" :class="$style.detailLabel">交易时间</Col>
            <Col span="18">{{ localDateTime(detail.created_at) }}</Col>
          </Row>
        </section>
        <div slot="footer"></div>
      </Modal>
    </template>
  </div>
</template>
<style lang="less" module>
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
  import BackIcon from '../../icons/Back';
  import { createAPI, addAccessToken } from '../../utils/request';
  import AccountComponent from './Account';
  import { resolveImage } from '../../utils/resource';
  import {showAmount} from '../../utils/balance';

  const nothingImg = resolveImage(require('../../statics/images/defaultNothingx3.png'));

  const BalanceRecords = {
    components: {
      BackIcon,
      AccountComponent
    },
    data: () => ({
      detailOpen: false,
      detailIndex: -1,
      showSpinner: false,
      isWeixin: window.TS_WEB.isWeiXin,
      records: [],
      action: '',
      limit: 20, // 单页数量
      after: 0, // 分页节点
      bottomAllLoaded: false,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      wrapperHeight: 0
    }),

    created () {
      this.getRecords();
    },

    methods: {
      showAmount,
      /**
       * 底部加载更多
       * @return {[type]} [description]
       */
      loadBottom () {
        this.getRecords('loadMore');
      },
      /**
       * 加载新的记录
       * @return {[type]} [description]
       */
      loadTop () {
        this.getRecords('loadNew');
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
        }, 500)
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
      /**
       * 设置细明类型
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      recordsType (name) {
        this.after = 0;
        this.bottomAllLoaded = false;
        this.topAllLoaded = false;
        if (name === 'in') this.action = 1;
        if (name === 'out') this.action = 0;
        if (name === 'all') this.action = '';
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
      /**
       * 获取记录列表
       * @param  {String} type [description]
       * @return {[type]}      [description]
       */
      getRecords (type = 'new') {
        if (type === 'new' ) this.showSpinner = true;
        const { after, limit, action } = this;
        let data = {};
        data.limit = limit;
        if (after && type === 'loadMore') data.after = after;
        if (action !== '') data.action = action;

        addAccessToken().get(
          createAPI('wallet/charges'),
          {
            params: {
              ...data
            }
          },
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          if (data.length < this.limit) this.bottomAllLoaded = true; // 底部加载完毕

          if( type === 'new' ) this.showSpinner = false;

          if( type === 'new') {
            this.records = data;
            this.after = _.last(data)['id'];

            return;
          }

          if (type === 'loadMore') {
            this.records = [
              ...this.records,
              ...data
            ];
            this.after = _.last(data)['id'];
            setTimeout( () => {
              this.$refs.loadmore.onBottomLoaded();
            }, 800);

            return;
          }

          if (type === 'loadNew') {
            this.records = _.uniqBy([
              ...data,
              ...this.records
            ], 'id');
            setTimeout( () => {
              this.$refs.loadmore.onTopLoaded();
            }, 800);

            return;
          }
        })
      },
    },

    watch: {
      action: function (newAction) {
        this.getRecords();
      }
    },

    computed: {
      nothing () {
        return this.records.length == 0 ? nothingImg : 0;
      },

      detail () {
        const { detailIndex } = this;
        if (detailIndex === -1) return {};
        let detail = this.records[detailIndex] || {};
        
        return detail;
      },
      /**
       * 下拉菜单文字
       * @return {[type]} [description]
       */
      menuText () {
        const { action } = this;
        if (action === 1) return '收入';
        if (action === 0) return '支出';

        return '全部'
      }
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - 46;
    }
  }

  export default BalanceRecords;
</script>