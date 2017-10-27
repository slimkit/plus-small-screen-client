<template>
 <div class="findSomeOne">
  <!-- header -->
  <header class="commonHeader" style="position: fixed; top:0; width:100%">
      <Row :gutter="24">
          <Col span="5" style="display: flex; justify-content:flex-start;align-items: center" @click.native="goTo(-1)">
          <BackIcon height="21" width="21" color="#999" />
          </Col>
          <Col span="14" class="title-col">
              排行榜
          </Col>
      </Row>
  </header>
  <!-- /header -->
  <!-- nav -->
  <nav class="findNavBar">
      <Row :gutter="0" class="NavRow">
          <Col :span="5" class="NavCol">
          <router-link class="navLink" to="/rank/list/user">用户</router-link>
          </Col>
          <Col :span="5" class="NavCol">
          <router-link class="navLink" to="/rank/list/question">问答</router-link>
          </Col>
          <Col :span="5" class="NavCol">
          <router-link class="navLink" to="/rank/list/feed">动态</router-link>
          </Col>
          <Col :span="5" class="NavCol">
          <router-link class="navLink" to="/rank/list/news">资讯</router-link>
          </Col>
      </Row>
  </nav>
  <!-- /nav -->
  <!-- content -->
  <div :class="$style.RankList">
    <!-- 用户综合排行 -->
    <div v-if="type == 'user'">
      <rank-list-item type="followers" :items="user.followers" title="全站粉丝排行榜"></rank-list-item>
      <rank-list-item type="balance" :items="user.balance" title="财富达人排行榜"></rank-list-item>
      <rank-list-item type="income" :items="user.income" title="收入达人排行榜"></rank-list-item>
      <rank-list-item type="checkin" :items="user.checkin" title="社区签到排行榜"></rank-list-item>
      <rank-list-item type="experts" :items="user.experts" title="社区专家排行榜"></rank-list-item>
      <rank-list-item type="likes" :items="user.likes" title="问答达人排行榜"></rank-list-item>
    </div>
    <!-- 用户问题排行 -->
    <div v-else-if = "type == 'question'">
      <rank-list-item type="dayQuestion" :items="question.day" title="今日解答排行榜"></rank-list-item>
      <rank-list-item type="weekQuestion" :items="question.week" title="一周解答排行榜"></rank-list-item>
      <rank-list-item type="monthQuestion" :items="question.month" title="本月解答排行榜"></rank-list-item>
    </div>
    <!-- 用户动态排行 -->
    <div v-else-if = "type == 'feed'">
      <rank-list-item type="dayFeed" :items="feed.day" title="今日动态排行榜"></rank-list-item>
      <rank-list-item type="weekFeed" :items="feed.week" title="一周动态排行榜"></rank-list-item>
      <rank-list-item type="monthFeed" :items="feed.month" title="本月动态排行榜"></rank-list-item>
    </div>
    <!-- 用户咨询排行 -->
    <div v-else-if = "type == 'news'">
      <rank-list-item type="dayNews" :items="news.day" title="今日资讯排行榜"></rank-list-item>
      <rank-list-item type="weekNews" :items="news.week" title="一周资讯排行榜"></rank-list-item>
      <rank-list-item type="monthNews" :items="news.month" title="本月资讯排行榜"></rank-list-item>
    </div>
  </div>
</div>   
</template>
<script>
import { changeUrl, goTo } from '../../utils/changeUrl';
import { createAPI, addAccessToken } from '../../utils/request';

import BackIcon from '../../icons/Back';
import RankListItem from './RankListItem';
import LoadingBlack from '../../icons/LoadingBlack';

const RankList = {
    name: "Rank",
    components: {
      BackIcon,
      LoadingBlack,
      RankListItem
    },
    data() {
      return({
        user: {
          followers: [],
          balance: [],
          income: [],
          checkin: [],
          experts: [],
          likes: [],
        },
        question: {
          day: [],
          week: [],
          month: [],
        },
        feed: {
          day: [],
          week: [],
          month: [],
        },
        news: {
          day: [],
          week: [],
          month: [],
        }
      })
    },
    computed: {
      type () {
        return this.$route.params.type
      }
    },
    watch: {
      '$route' (to) {
        this.byRouteParamTypeGetData(to.params.type);
      }
    },
    methods: {
      changeUrl,
      goTo,
      requestRankApi(param, type, uri) {
        let params = { limit: 5, offset: 0 };
        addAccessToken().get(createAPI(uri), { params })
        .then(({ data = [] }) => {
          this[param][type] = data;
        })
        .catch(err => {
          console.log(err);
        });
      },
      byRouteParamTypeGetData (type) {
        let dateArr = ['day', 'week', 'month'];

        if (type == 'question') {
          for (let i = 0; i < dateArr.length; i++) {
            this.requestRankApi(type, dateArr[i], `question-ranks/answers?type=${dateArr[i]}`);
          }
        } else if (type == 'feed') {
          for (let i = 0; i < dateArr.length; i++) {
            this.requestRankApi(type, dateArr[i], `feeds/ranks?type=${dateArr[i]}`);
          }
        } else if (type == 'news') {
          for (let i = 0; i < dateArr.length; i++) {
            this.requestRankApi(type, dateArr[i], `news/ranks?type=${dateArr[i]}`);
          }
        } else {
          this.requestRankApi(type, 'followers', 'ranks/followers');
          this.requestRankApi(type, 'balance', 'ranks/balance');
          this.requestRankApi(type, 'income', 'ranks/income');
          this.requestRankApi(type, 'checkin', 'checkin-ranks');
          this.requestRankApi(type, 'experts', 'question-ranks/experts');
          this.requestRankApi(type, 'likes', 'question-ranks/likes');
        }
      }
    },
    created() {
      // 默认获取user排行
      this.byRouteParamTypeGetData(this.$route.params.type);
    },
}

export default RankList;
</script>
<style lang="less" module>
  .RankList {
    margin-top: 91px;
    min-height: 100%;
  }
  .marginTop {
    margin-top: 4px;
  }
</style>

