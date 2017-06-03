<template>
  <div class="feedParentContainer" id="feedParentContainer">
    <div id="spinner" v-show="showSpinner">
      <div id="spinner-parent">
        <div class="spinner-double-bounce-bounce2" />
        <div class="spinner-double-bounce-bounce1" />
      </div>
    </div>
    <div class="nothingDefault"> 
      <img v-if="nothing" :src="nothing" />
    </div>
    <div v-if="!nothing" class="fixed"></div>
    <!-- <mt-loadmore
      v-if="!nothing"
      :top-method="loadTop"
      :bottom-all-loaded="bottomAllLoaded"
      :top-all-loaded="topAllLoaded"
      ref="loadmore"
      :bottomDistance="70"
      @bottom-status-change="bottomStatusChange"
    > -->
      <!-- <div class="feed-list" v-if="!nothing"> -->
      <!-- <virtualList class="list" :size="115" :remain="15" v-if="!nothing" @toBottom="loadBottom"> -->
      <vue-recyclist
        :list = "feedsList"
        :size = "15"
        :offset = "200"
        :loadmore = "loadBottom"
        :nomore = "bottomAllLoaded"
        :spinner = "true"
        class="list"
      >
        <template slot="item" scope="props">
          <Feed :feed="props.data" :ke="props.index" />
        </template>
        <div slot="spinner">Loading...</div>
        <div slot="nomore">No More Data</div>
        <!-- <Feed v-for="(feed, index) in feedsList" :feed="feed" :key="index" :index="index"/> -->
      </vue-recyclist>
      <!-- </div> -->
      <!-- <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomAllLoaded">没有更多了</span>
        <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
        <span v-show="bottomStatus === 'loading'">加载中...</span>
        <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
      </div>
    </mt-loadmore> -->
  </div>
</template>
<script>
  import request, { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import Feed from './Feed';
  import { NOTICE, FEEDSLIST, FOLLOWINGFEEDS, FOLLOWINGIDS, HOTIDS, NEWIDS, HOTFEEDS, NEWFEEDS, ADDFOLLOWINGIDS, ADDHOTIDS, ADDNEWIDS, COLLECTIONIDS, COLLECTIONFEEDS, ADDCOLLECTIONIDS } from '../stores/types';
  import router from '../routers/index';
  import lodash from 'lodash';
  import { resolveImage } from '../utils/resource';
  import VueRecyclist from 'vue-recyclist'

  const nothingImg = resolveImage(require('../statics/images/defaultNothingx3.png'));
  const FeedLists = {
    components: {
      Feed,
      VueRecyclist
    },
    props: {
      option: Object
    },
    data: () => ({
      feeds: [],
      maxId: 0, // 更新查询用 最新和关注用
      page: 1, // 更新查询用 热门动态
      limit: 15,
      errors: {},
      limitCounter: 0,
      bottomAllLoaded: false,
      topAllLoaded: false,
      bottomStatus: '',
      isShowComfirm: false,
      topStatus: '',
      showSpinner: true,
      // showTop: true,
      firstId: 0, // 下拉刷新过滤节点
      feedType: { // vuex相关action
        'following': {
          ids: FOLLOWINGIDS,
          feeds: FOLLOWINGFEEDS,
          add: ADDFOLLOWINGIDS
        },
        'hot': {
          ids: HOTIDS,
          feeds: HOTFEEDS,
          add: ADDHOTIDS
        },
        'new': {
          ids: NEWIDS,
          feeds: NEWFEEDS,
          add: ADDNEWIDS
        },
        'collections': {
          ids: COLLECTIONIDS,
          feeds: COLLECTIONFEEDS,
          add: ADDCOLLECTIONIDS
        }
      }
    }),
    methods: {
      bottomStatusChange(status) {
        this.bottomStatus = status;
      },
      // 加载更多
      loadBottom () {
        if(!this.maxId > 1 || this.bottomAllLoaded) {
          console.log('xxx');
          return false;
        }
        let limiterSend = '';
        let api = this.option.uri; // 查询地址
        let limiter = this.option.limiter; // 分页查询方式
        if( !this.maxId > 1) {
          setTimeout(() => {
            this.bottomAllLoaded = true;
            // if(this.$refs.loadmore)
            //   this.$refs.loadmore.onBottomLoaded();
          }, 500)
          return ;
        }
        if(limiter == 'page') {
          this.page += 1;
          limiterSend = `?page=${this.page}`;
        } else {
          limiterSend = this.maxId ? `?max_id=${this.maxId}` : '';
        }
        addAccessToken().get(createAPI(`${api}${limiterSend}`), {},
          {
            validate: status  => status === 200
          }
        )
        .then(response => {
          let type = this.feedType[this.option.type];
          let data = response.data.data;
          let length = data.length;
          let ids = [];
          let feeds = {};
          if(!data.length > 0) {
            this.bottomAllLoaded = true;
            // setTimeout(() => {
            //   if(this.$refs.loadmore)
            //     this.$refs.loadmore.onBottomLoaded();
            // }, 500)
            return;
          }
          data.forEach((d) => {
            ids.push(d.feed.feed_id);
            feeds[d.feed.feed_id] = d;
          });
          this.$store.dispatch(FEEDSLIST, cb => {
            cb(feeds);
          })
          this.$store.dispatch(type.ids, cb => {
            cb(ids);
          })
          if(length < 15) {
            this.bottomAllLoaded = true;
          }
          this.maxId = data[data.length - 1].feed.feed_id;
          setTimeout( () => {
            this.showSpinner = false;
          }, 900);
          // setTimeout(() => {
          //   if(this.$refs.loadmore)
          //     this.$refs.loadmore.onBottomLoaded();
          // }, 500)
        })
      },
      loadTop () {
        let limiterSend = '';
        let api = this.option.uri;
        let limiter = this.option.limiter;
        let type = this.feedType[this.option.type];
        let currentType = this.option.type; // 区分当前为哪种列表分类
        let ids = this.$store.getters[type.ids];
        if (limiter == 'page') {
          this.limitCounter = 1;
          limiterSend = '?page=1';
        }
        addAccessToken().get(createAPI(`${api}${limiterSend}`), {}, 
          {
            validate: status  => status === 200
          }
        )
        .then( response => {
          let feeds = response.data.data;
          if(feeds.length == 0) {
            setTimeout(() => {
              if(this.$refs.loadmore)
              {
                this.$refs.loadmore.onTopLoaded();
              }
            }, 500)
            return;
          }
          let newIds = [];
          let newFeeds = {};
          feeds.forEach( feed => {
            if(ids.findIndex(function(value, index, arr) {
              return value == feed.feed.feed_id;
            }) == -1) {
              newIds.push(feed.feed.feed_id);
            }
            newFeeds[feed.feed.feed_id] = feed;
          });
          this.$store.dispatch(FEEDSLIST, cb => {
            cb(newFeeds);
          });
          this.$store.dispatch(type.add, cb => {
            cb(newIds);
          });
          newFeeds = {};
          newIds = [];
          feeds = [];
          // setTimeout(() => {
          //   if(this.$refs.loadmore) {
          //     this.$refs.loadmore.onTopLoaded();
          //   }
          // }, 500)
        });
      }
    },
    computed: {
      error: function () {
        let errors = lodash.values(this.errors);
        return errors[0] || '';
      },
      nothing () {
        let type = this.feedType[this.option.type];
        let feedList = this.$store.getters[type.ids];
        return feedList.length ? 0 : nothingImg;
      },
      feedsList() {
        let type = this.feedType[this.option.type];
        return this.$store.getters[type.feeds];
      }
    },
    mounted () {
      document.getElementById('feedParentContainer').style.height = '100vh';
      document.getElementById('feedParentContainer').style.overflowY = 'auto';
    //   let type = this.feedType[this.option.type];
    //   let storeIds = this.$store.getters[type.ids];
    //   if(storeIds.length > 5) {
    //     this.firstId = storeIds[0];
    //     this.maxId = storeIds[storeIds.length -1];
    //     // setTimeout(() => {
    //     //   if(this.$refs.loadmore){
    //     //     this.$refs.loadmore.onTopLoaded();
    //     //   }
    //     // }, 500);
    //     storeIds = [];
    //     setTimeout( () => {
    //       this.showSpinner = false;
    //     }, 600);
    //     return;
    //   }
    //   let limiterSend = '';
    //   let api = this.option.uri;
    //   let limiter = this.option.limiter;
    //   if (limiter == 'page') {
    //     this.limitCounter = 1;
    //     limiterSend = '?page=1';
    //   }
    //   addAccessToken().get(createAPI(`${api}${limiterSend}`), 
    //     {}, 
    //     {
    //       validate: status  => status === 200
    //     }
    //   )
    //   .then(response => {
    //     let feeds = response.data.data;
    //     console.log(feeds.length);
    //     let storeFeeds = {};
    //     let ids = [];
    //     if(!feeds.length > 0) {
    //       setTimeout( () => {
    //         this.showSpinner = false;
    //       }, 300);
    //       this.bottomAllLoaded = true;
    //       return;
    //     }
    //     this.firstId = feeds[0].feed.feed_id;
    //     feeds.forEach( feed => {
    //       ids.push(feed.feed.feed_id);
    //       storeFeeds[feed.feed.feed_id] = feed;
    //     });
    //     this.$store.dispatch(FEEDSLIST, cb => {
    //       cb(storeFeeds);
    //     })
    //     this.$store.dispatch(type.ids, cb => {
    //       cb(ids);
    //     })
    //     let lastFeed = feeds[feeds.length - 1];
    //     this.maxId = lastFeed.feed.feed_id;
    //     if(feeds.length < 15) {
    //       this.bottomAllLoaded = true;
    //     }
    //     feeds = [];
    //     setTimeout( () => {
    //       this.showSpinner = false;
    //     }, 900);
    //   });
    }
    ,
    updated () {
    //   this.showTop = false;
    //   setTimeout(() => {
    //     if(this.$refs.loadmore){
    //       // this.$refs.loadmore.onTopLoaded();
    //     }
    //   }, 500);
    }
  };
  export default FeedLists;
</script>

<style lang="scss" module>
  .notice {
    padding: 10px 0;
    height: 18px;
    background-color: #59b6d7;
    color: #fff;
    text-align: center;
    line-height: 18px;
  }
</style>
<style scoped>
  .mint-loadmore {padding-bottom: 60px}
  .mint-loadmore-content-parent-no-trans .mint-loadmore-content {
    transform: inherit;
  }
  .noFixed {
    height: 46px;
    display: none;
  }
  .fixed {
    height: 46px;
    display: block;
  }
  .list {
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
    max-width: 100%;
    height: 100%;
  }
</style>