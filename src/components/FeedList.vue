<template>
  <div class="feedParentContainer">
    <div id="spinner" v-show="showSpinner">
      <div id="spinner-parent">
        <div class="spinner-double-bounce-bounce2" />
        <div class="spinner-double-bounce-bounce1" />
      </div>
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
      ref="loadmore"
      :bottomDistance="70"
      @bottom-status-change="bottomStatusChange"
    >
      <ul class="feed-list" v-if="!nothing">
        <Feed v-for="(feed, index) in feedsList" :feed="feed" :key="feed.id"></Feed>
      </ul>
      <div slot="bottom" class="mint-loadmore-bottom">
        <span v-if="bottomAllLoaded">没有更多了</span>
        <section v-else>
          <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
          <span v-show="bottomStatus === 'loading'">加载中...</span>
          <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
        </section>
      </div>
    </mt-loadmore>
  </div>
</template>
<script>
  import request, { createAPI, addAccessToken } from '../utils/request';
  import Feed from './Feed';
  import { NOTICE, FEEDSLIST, FOLLOWINGFEEDS, FOLLOWINGIDS, HOTIDS, NEWIDS, HOTFEEDS, NEWFEEDS, ADDFOLLOWINGIDS, ADDHOTIDS, ADDNEWIDS, COLLECTIONIDS, COLLECTIONFEEDS, ADDCOLLECTIONIDS } from '../stores/types';
  import router from '../routers/index';
  import lodash from 'lodash';
  import { resolveImage } from '../utils/resource';
  const nothingImg = resolveImage(require('../statics/images/defaultNothingx3.png'));
  const FeedLists = {
    components: {
      Feed
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
        let limiterSend = '';
        let api = this.option.uri; // 查询地址
        
        if( this.maxId == 0) {
          setTimeout(() => {
            this.bottomAllLoaded = true;
            if(this.$refs.loadmore)
              this.$refs.loadmore.onBottomLoaded();
          }, 500)
          return ;
        }
        
        limiterSend = `&after=${this.maxId}&limit=15`;

        addAccessToken().get(createAPI(`${api}${limiterSend}`), {},
          {
            validate: status  => status === 200
          }
        )
        .then(({ data = {} }) => {
          let type = this.feedType[this.option.type];
          let morefeeds = data.feeds;
          let length = morefeeds.length;
          let ids = [];
          let feeds = {};
          if(!length > 0) {
            this.bottomAllLoaded = true;
            setTimeout(() => {
              if(this.$refs.loadmore)
                this.$refs.loadmore.onBottomLoaded();
            }, 500)
            return;
          }
          morefeeds.forEach( d => {
            ids.push(d.id);
            feeds[d.id] = d;
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
          this.maxId = morefeeds[morefeeds.length - 1].id;
          setTimeout(() => {
            if(this.$refs.loadmore)
              this.$refs.loadmore.onBottomLoaded();
          }, 500)
        })
      },
      loadTop () {
        let limiterSend = '';
        let api = this.option.uri;
        let limiter = this.option.limiter;
        let type = this.feedType[this.option.type];
        let currentType = this.option.type; // 区分当前为哪种列表分类
        let ids = this.$store.getters[type.ids];
        addAccessToken().get(createAPI(`${api}${limiterSend}`), {}, 
          {
            validate: status  => status === 200
          }
        )
        .then( response => {
          let feeds = response.data.feeds;
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
              return value == feed.id;
            }) == -1) {
              newIds.push(feed.id);
            }
            newFeeds[feed.id] = feed;
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
          setTimeout(() => {
            if(this.$refs.loadmore) {
              this.$refs.loadmore.onTopLoaded();
            }
          }, 500)
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
      let type = this.feedType[this.option.type];
      let storeIds = this.$store.getters[type.ids];
      if(storeIds.length > 5) {
        this.firstId = storeIds[0];
        this.maxId = storeIds[storeIds.length -1];
        setTimeout(() => {
          if(this.$refs.loadmore){
            this.$refs.loadmore.onTopLoaded();
          }
        }, 500);
        storeIds = [];
        setTimeout( () => {
          this.showSpinner = false;
        }, 600);
        return;
      }
      let limiterSend = '';
      let api = this.option.uri;
      let limiter = this.option.limiter;
      addAccessToken().get(createAPI(`${api}&limit=15`), 
        {}, 
        {
          validate: status  => status === 200
        }
      )
      .then(response => {

        let feeds = response.data.feeds;
        let storeFeeds = {};
        let ids = [];
        //
        if(!feeds.length > 0) {
          setTimeout( () => {
            this.showSpinner = false;
          }, 300);
          this.bottomAllLoaded = true;
          return;
        }

        this.firstId = feeds[0].id;

        feeds.forEach( feed => {
          ids.push(feed.id);
          storeFeeds[feed.id] = feed;
        });

        this.$store.dispatch(FEEDSLIST, cb => {
          cb(storeFeeds);
        })

        this.$store.dispatch(type.ids, cb => {
          cb(ids);
        })

        let lastFeed = feeds[feeds.length - 1];
        this.maxId = lastFeed.id;

        if(feeds.length < 15) {
          this.bottomAllLoaded = true;
        }
        feeds = [];
        setTimeout( () => {
          this.showSpinner = false;
        }, 900);
      });
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
<style scoped lang="less">
  .feedParentContainer {
    padding-top: 46px;
    .mint-loadmore {padding-bottom: 60px}
    .mint-loadmore-content-parent-no-trans .mint-loadmore-content {
      transform: inherit;
    }
  }
</style>