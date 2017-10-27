<template>
    <div class="rankShow">
        <!-- header -->
        <header class="commonHeader" style="position: fixed; top:0; width:100%">
            <Row :gutter="24">
                <Col span="5" style="display: flex; justify-content:flex-start;align-items: center" @click.native="goTo(-1)">
                	<BackIcon height="21" width="21" color="#999" />
                </Col>
                <Col span="14" class="title-col">{{ rankInfo.title }}</Col>
            </Row>
        </header>
        <!-- /header -->
        <!-- Loadding -->
        <div id="spinner" v-if="loading">
          <div id="spinner-parent">
            <div class="spinner-double-bounce-bounce2" />
            <div class="spinner-double-bounce-bounce1" />
          </div>
        </div>
        <!-- content -->
         <template v-else-if="! empty">
            <div class="content">
              <mt-loadmore
              :bottom-method="loadMore"
              :top-method="loadNew"
              :bottom-all-loaded="bottomAllLoaded"
              :top-all-loaded="true"
              :autoFill="false"
              ref="loadmore"
              :bottomDistance="70"
              @bottom-status-change="bottomStatusChange"
              @top-status-change="topStatusChange"
            >
              <rank-item v-for="(item, index) in rankList" :person='item' :key="index"></rank-item>
              <div v-show='bottomAllLoaded' class="notDate">没有更多了</div>
            </mt-loadmore>
           </div>
        </template>
        <!-- /content -->
      <!-- ranklist is empty. -->
      <img v-else style="width: 80vw; left: 10vw;  position: relative; top: 5vh;" v-lazy="nothingImage" alt="" />
    </div>
</template>

<script>
import { goTo, changeUrl } from '../../utils/changeUrl';
import { resolveImage } from '../../utils/resource';
import BackIcon from '../../icons/Back';
import LoadingBlack from '../../icons/LoadingBlack';
import RankItem from './RankItem';
import { addAccessToken, createAPI } from '../../utils/request';
const nothingImage = resolveImage(require('../../statics/images/defaultNothingx2.png'));

export default {
    name: "rank-show",
    components: {
      BackIcon,
      RankItem
    },
    data() {
      return({
        limit: 10,
        nothingImage,
        rankList: [],
        bottomAllLoaded: false,
        loading: false,
        bottomStatus: '',
        topStatus: '',
        rankInfo: {
          uri: null,
          title: null,
        }
      })
    },
    methods: {
      goTo,
      changeUrl,
      loadMore(){
        if(this.bottomAllLoaded) return;
        this.getRanks('loadMore');
      },
      loadNew(){
        this.getRanks();
      },
      bottomStatusChange(status){
        this.bottomStatus = status;
      },
      topStatusChange(status){
        this.topStatus = status;
      },
      getRanks(loadtype = 'new') {
        const { limit, rankList: { length = 0 } } = this;
        let params = {
          limit
        }
        if(loadtype === 'loadMore') {
          params.offset = length;
        }
        addAccessToken().get(createAPI(this.rankInfo.uri), { params })
        .then(({ data = [] }) => {
          if(loadtype === 'new' ) {
            this.rankList = data;
            this.loading = false;
            if(data.length === limit) {
              this.bottomAllLoaded = false;
            }
            this.$refs.loadmore.onTopLoaded();
            return;
          }

          if(loadtype === 'loadNew') {
            this.rankList = _.uniqBy([
              ...data,
              ...this.rankList
            ], 'id');
            this.$refs.loadmore.onTopLoaded();
            return;
          }

          if(loadtype === 'loadMore') {
            this.rankList = [
              ...this.rankList,
              ...data
            ];
            if(data.length === limit) {
              this.bottomAllLoaded = false;
            }
            if(data.length < limit) {
              this.bottomAllLoaded = true;
            }
            this.$refs.loadmore.onBottomLoaded();

            return;
          }
        })
        .catch(err => {
          console.log(err);
        });
      },
      byQueryTypeGetRankInfo() {
        let type = this.$route.query.type;
        let title = '';
        let uri = '';
        switch (type) {
          case 'followers':
            title = '全站粉丝排行榜';
            uri = 'ranks/followers';
            break;
          case 'balance':
            title = '财富达人排行榜';
            uri = 'ranks/balance';
            break;
          case 'income':
            title = '收入达人排行榜';
            uri = 'ranks/income';
            break;
          case 'checkin':
            title = '社区签到排行榜';
            uri = 'checkin-ranks';
            break;
          case 'exports':
            title = '社区专家排行榜';
            uri = 'question-ranks/experts';
            break;
          case 'likes':
            title = '问答达人排行榜';
            uri = 'question-ranks/likes';
            break;
          case 'dayQuestion':
            title = '今日解答排行榜';
            uri = 'question-ranks/answers?type=day';
            break;
          case 'weekQuestion':
            title = '一周解答排行榜';
            uri = 'question-ranks/answers?type=week';
            break;
          case 'monthQuestion':
            title = '本月解答排行榜';
            uri = 'question-ranks/answers?type=month';
            break;
          case 'dayFeed':
            title = '今日动态排行榜';
            uri = 'feeds/ranks?type=day';
            break;
          case 'weekFeed':
            title = '一周动态排行榜';
            uri = 'feeds/ranks?type=week';
            break;
          case 'monthFeed':
            title = '本月动态排行榜';
            uri = 'feeds/ranks?type=month';
            break;
          case 'dayNews':
            title = '今日资讯排行榜';
            uri = 'news/ranks?type=day';
            break;
          case 'weekNews':
            title = '一周资讯排行榜';
            uri = 'news/ranks?type=week';
            break;
          case 'monthNews':
            title = '本月资讯排行榜';
            uri = 'news/ranks?type=month';
            break;
          default:
            title = '全站粉丝排行榜';
            uri = 'ranks/followers';
            break;
        }
        this.rankInfo.title = title;
        this.rankInfo.uri = uri;
      }
    },
    computed: {
      /**
       * The question is emoty.
       * @return {Boolean}
       */
      empty () {
        const { length } = this.rankList;
        
        return ! length;
      }
    },
    mounted() {
      this.byQueryTypeGetRankInfo();
      this.getRanks();
    },
}
</script>
<style lang="less">
	.content {
    padding-top: 46px;
    height: 100vh;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .mint-loadmore-bottom{
      margin-bottom: -50px;
    }
	}
  .notDate {
    text-align: center;
    font-size: 12px;
  }
</style>