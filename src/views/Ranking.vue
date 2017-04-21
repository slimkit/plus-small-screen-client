<template>
  <div class="Ranking">
    <div class="commonHeader">
      <Row :gutter="16">
        <Col span="4">
          <div @click="goTo(-1)">
            <BackIcon height="21" width="21" color="#999" />
          </div>
        </Col>
        <Col span="16" class="title-col">
          点赞排行榜
        </Col>
        <Col span="4"></Col>
      </Row>
    </div>
    <div :class="$style.rankingContent">
      <div :class="$style.ranking" v-for="(digg, index) in formatedList" :key="index">
        <Row :gutter="16" :class="$style.rankRow">
          <Col span="4"  :class="$style.rankAvatar">
            <img width="100%;" :src="digg.avatar" alt="digg.name" @click="changeUrl(`/users/feeds/${digg.user_id}`)" />
            <span>{{index+1}}</span>
          </Col>
          <Col span="20">
            <h4 :class="$style.name" @click="changeUrl(`/users/feeds/${digg.user_id}`)" >{{digg.name}}</h4>
            <div :class="$style.intro">{{digg.intro}}</div>
            <div :class="$style.gray">点赞<span :class="$style.diggCount">{{digg.value}}</span></div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
  import { NOTICE } from '../stores/types';
  import { createAPI, addAccessToken } from '../utils/request';
  import BackIcon from '../icons/Back';
  import { friendNum } from '../utils/friendNum';
  import localEvent from '../stores/localStorage';
  import { changeUrl, goTo } from '../utils/changeUrl';

  const Ranking = {
    components: {
      BackIcon
    },
    data: () => ({
      page: 0,
      diggLists: []
    }),
    methods: {
      changeUrl,
      goTo
    },
    computed: {
      formatedList () {
        let lists = this.diggLists;
        let newLists = [];
        lists.forEach( list => {
          let digg = {};
          let user = localEvent.getLocalItem(`user_${list.user_id}`);
          const { avatar: { 30: avatar = ''} = {} } = user;
          const { name = '' } = user;
          const { datas: { intro: { value: intro = '还没有简介呢' } = {} } } = user;
          digg.name = name,
          digg.avatar = avatar;
          digg.intro = intro;
          digg.value = friendNum(parseInt(list.value));
          digg.user_id = list.user_id;
          if(!Object.keys(user).length) {
            getUserInfo(list.user_id, gotUser => {
              const { avatar: { 30: avatar = '' } = {} } = gotUser;
              const { name = '' } = gotUser;
              const { datas: { intro: { value: intro = '还没有简介呢' } = {} } } = gotUser;
              digg.intro = intro;
              digg.name = name,
              digg.avatar = avatar;
            })
          }
          newLists.push(digg);
        });
        return newLists;
      }
    },
    created () {
      addAccessToken().get(createAPI(`diggsrank?page=${this.page}`),{},
        {
          validateStatus: status => status === 200
        }
      )
      .then(response => {
        this.diggLists = response.data.data;
      })
      .catch(({ response: { message = '网络状况堪忧' } = {} } ) => {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: data.message,
            time: 2000,
            status: false
          });
        });
      })
    }
  };
  export default Ranking;
</script>
<style lang="scss" module>
  .rankingContent {
    background-color: #fff;
    .ranking {
      border-bottom: 1px solid #e2e3e3;
      padding: 8px 0;
      .rankRow {
        .rankAvatar {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          img {
            width: 100%;
            border-radius: 50%;
          }
          span {
            padding: 2px 0;
          }
        }
        .name {
          font-weight: 400;
          font-size: 16px;
          line-height: 100%;
          padding: 4px 0;
        }
        .intro {
          text-align: justify;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-break: break-all;
          color: #999;
          padding: 2px;
        }
        .gray {
          color: #999;
          padding: 2px;
        }
        .diggCount {
          color: #59b6d7;
          padding: 0 4px;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
</style>