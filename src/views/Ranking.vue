<template>
  <div class="Ranking">
    <div class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="5">
          <BackIcon height="21" width="21" color="#999" @click.native="goTo(-1)" />
        </Col>
        <Col span="14" class="title-col">
          点赞排行榜
        </Col>
        <Col span="5"></Col>
      </Row>
    </div>
    <div class="nothingDefault"> 
      <img v-if="nothing" :src="nothing" />
    </div>
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
      <div :class="$style.rankingContent">
        <div :class="$style.ranking" v-for="(digg, index) in formatedList" :key="index">
          <Row :gutter="16" :class="$style.rankRow">
            <Col span="4"  :class="$style.rankAvatar">
              <img width="100%;" :src="digg.avatar" alt="digg.name" @click="changeUrl(`/users/feeds/${digg.user_id}`)" />
              <span>{{index+1}}</span>
            </Col>
            <Col span="20">
              <h4 :class="$style.name" @click="changeUrl(`/users/feeds/${digg.user_id}`)" >{{digg.name}}</h4>
              <div :class="$style.intro">{{digg.bio}}</div>
              <div :class="$style.gray">点赞<span :class="$style.diggCount">{{digg.value}}</span></div>
            </Col>
          </Row>
        </div>
      </div>
      <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomAllLoaded">没有更多了</span>
        <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
        <span v-show="bottomStatus === 'loading'">加载中...</span>
        <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
      </div>
    </mt-loadmore>
  </div>
</template>
<script>
  import { NOTICE } from '../stores/types';
  import { createAPI, createOldAPI, addAccessToken } from '../utils/request';
  import BackIcon from '../icons/Back';
  import { friendNum } from '../utils/friendNum';
  import localEvent from '../stores/localStorage';
  import { changeUrl, goTo } from '../utils/changeUrl';
  import defaultAvatar from '../statics/images/defaultAvatarx2.png';
  import lodash from 'lodash';
  import { resolveImage } from '../utils/resource';
  import { getUserInfo } from '../utils/user';

  const defaultNobody = resolveImage(require('../statics/images/img_default_nobody@2x.png'));

  const Ranking = {
    components: {
      BackIcon
    },
    data: () => ({
      page: 1,
      diggLists: [],
      bottomAllLoaded: false,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      isWeiXin: TS_WEB.isWeiXin
    }),
    methods: {
      changeUrl,
      goTo,
      // 下拉刷新 直接更新列表
      loadTop () {
        addAccessToken().get(createOldAPI(`diggsrank?page=1`),{},
          {
            validateStatus: status => status === 200
          }
        )
        .then(response => {
          this.page = 1;
          let diggs = response.data.data;
          this.diggLists = diggs;
          setTimeout( () => {
            if(this.$refs.loadMoreLists)
              this.$refs.loadMoreLists.onTopLoaded();
          }, 800)
        })
      },
      bottomStatusChange(status) {
        this.bottomStatus = status;
      },
      loadBottom () {
        addAccessToken().get(createOldAPI(`diggsrank?page=${this.page+1}&limit=15`),{},
          {
            validateStatus: status => status === 200
          }
        )
        .then(response => {
          this.page += 1;
          let diggs = response.data.data;
          this.diggLists = [ ...this.diggLists, ...diggs ];
          if(diggs.length < 15) {
            this.bottomAllLoaded = true;
          };
          setTimeout( () => {
            if(this.$refs.loadMoreLists)
              this.$refs.loadMoreLists.onBottomLoaded();
          })
        })
      }
    },
    computed: {
      formatedList () {
        let lists = this.diggLists;
        if(!lists.length) {
          return [];
        }
        let newLists = [];
        lists.reverse().forEach( list => {
          let digg = {};
          let user = this.$storeLocal.get(`user_${list.user_id}`);
          if(!lodash.keys(user).length) {
            getUserInfo(list.user_id).then(gotUser => {
              const { avatar = '' } = gotUser;
              const { name = '' } = gotUser;
              const { bio = '还没有简介呢' } = gotUser;
              digg.bio = bio;
              digg.name = name,
              digg.avatar = avatar ? avatar : defaultAvatar;
            });
          } else {
            const { avatar = '' } = user;
            const { name = '' } = user;
            const { bio = '还没有简介呢' } = user;
            digg.name = name,
            digg.avatar = avatar ? avatar : defaultAvatar;
            digg.bio = bio;
          }
          digg.value = friendNum(parseInt(list.value));
          digg.user_id = list.user_id;
          newLists.push(digg);
        });
        return newLists;
      },
      nothing () {
        return this.diggLists.length > 0 ? 0 : defaultNobody;
      }
    },
    created () {
      addAccessToken().get(createOldAPI(`diggsrank?page=${this.page}&limit=15`),{},
        {
          validateStatus: status => status === 200
        }
      )
      .then(response => {
        this.diggLists = response.data.data;

        if(this.diggLists.length < 15 ) {
          this.bottomAllLoaded = true;
        };
        setTimeout(() => {
          if(this.$refs.loadMoreLists) 
            this.$refs.loadMoreLists.onTopLoaded();
        })
      })
    }
  };
  export default Ranking;
</script>
<style lang="scss" module>
  .rankingContent {
    background-color: #fff;
    .ranking {
      border-bottom: 1px solid #ededed;
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
          text-align: inherit;
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
<style scoped>
  .mint-loadmore {
    padding-bottom: 50px;
    overflow: initial;
  }
</style>