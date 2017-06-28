<template>
  <div class="collections">
    <div class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="5" @click.native="goBack(-1)">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          收藏
        </Col>
        <Col span="5"></Col>
      </Row>
    </div>
    <section class="tabButton">
      <span @click="changeTab('feeds')" :class="{ active: active === 'feeds' }">动态</span>
      <span @click="changeTab('news')" :class="{ active: active === 'news' }">资讯</span>
    </section>
    <mt-tab-container v-model="active" style="padding-top: 91px; min-height: 100vh;">
      <mt-tab-container-item id="feeds">
        <div v-if="nothingFeeds" :class="$style.nothingDefault"> 
          <img :src="nothingFeeds" />
        </div>
        <mt-loadmore
          v-else
          :bottom-method="loadFeedsBottom"
          :top-method="loadFeedsTop"
          :bottom-all-loaded="bottomFeedsAllLoaded"
          ref="loadmoreFeedsCollections"
          @bottom-status-change="bottomFeedsStatusChange"
          :bottomDistance="70"
        >
          <div class="feed-list" v-if="!nothingFeeds">
            <CollectionFeed v-for="(feed, index) in feedsList" :feed="feed" :key="feed.feed.feed_id" />
          </div>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-if="bottomFeedsAllLoaded">没有更多了</span>
            <section v-else>
              <span v-show="bottomFeedsStatus === 'pull' && !bottomFeedsAllLoaded">上拉加载更多</span>
              <span v-show="bottomFeedsStatus === 'loading'">加载中...</span>
              <span v-show="bottomFeedsStatus === 'drop' && !bottomFeedsAllLoaded">释放加载更多</span>
            </section>
          </div>
        </mt-loadmore>
      </mt-tab-container-item>
      <mt-tab-container-item id="news">
        <div v-if="nothingNews" :class="$style.nothingDefault"> 
          <img :src="nothingNews" />
        </div>
        <mt-loadmore
          v-else
          :bottom-method="loadNewsBottom"
          :top-method="loadNewsTop"
          :bottom-all-loaded="bottomNewsAllLoaded"
          ref="loadmoreNewsCollections"
          @bottom-status-change="bottomNewsStatusChange"
          :bottomDistance="70"
        >
          <div class="feed-list" v-if="!nothingNews">
            <ul :class="$style.newsLists">
              <li
                class="newsIndex-container-newslist"
                v-for="(list, index) in newsLists"
                :key="index"
                :class="$style.new"
                @click="changeUrl(`/news/${list.id}/detail`)"
              >
                <div :class="$style.sourceTitle">
                  <h4>{{ list.title }}</h4>
                  <section :class="$style.sourceFrom">
                    <i>
                      <timeago :class="$style.timer" :since="timers(list.created_at, 8, false)" locale="zh-CN" :auto-update="60"></timeago>
                    </i>
                    <i v-if="list.from">来自 {{ list.from }}</i>
                  </section>
                </div>
                <figure :class="$style.sourceImg">
                  <img v-lazy="getImg(list.storage.id, 30)" :alt="list.title">
                </figure>
              </li>
            </ul>
          </div>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-if="bottomNewsAllLoaded">没有更多了</span>
            <section v-else>
              <span v-show="bottomNewsStatus === 'pull' && !bottomNewsAllLoaded">上拉加载更多</span>
              <span v-show="bottomNewsStatus === 'loading'">加载中...</span>
              <span v-show="bottomNewsStatus === 'drop' && !bottomNewsAllLoaded">释放加载更多</span>
            </section>
          </div>
        </mt-loadmore>
      </mt-tab-container-item>
    </mt-tab-container>

    <!-- <Tabs v-model="currentTab" @on-click="getType">
      <Tab-pane label="动态" name="feeds">
        <div v-if="nothingFeeds" :class="$style.nothingDefault"> 
          <img :src="nothingFeeds" />
        </div>
        <mt-loadmore
          v-else
          :bottom-method="loadFeedsBottom"
          :top-method="loadFeedsTop"
          :bottom-all-loaded="bottomFeedsAllLoaded"
          :top-all-loaded="topFeedsAllLoaded"
          ref="loadmoreFeedsCollections"
          @bottom-status-change="bottomFeedsStatusChange"
          :bottomDistance="70"
        >
          <div class="feed-list" v-if="!nothingFeeds">
            <CollectionFeed v-for="(feed, index) in feedsList" :feed="feed" :key="feed.feed.feed_id" />
          </div>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-if="bottomFeedsAllLoaded">没有更多了</span>
            <section v-else>
              <span v-show="bottomFeedsStatus === 'pull' && !bottomFeedsAllLoaded">上拉加载更多</span>
              <span v-show="bottomFeedsStatus === 'loading'">加载中...</span>
              <span v-show="bottomFeedsStatus === 'drop' && !bottomFeedsAllLoaded">释放加载更多</span>
            </section>
          </div>
        </mt-loadmore>
      </Tab-pane>
      <Tab-pane label="资讯" name="news">
        <div v-if="nothingNews" :class="$style.nothingDefault"> 
          <img :src="nothingNews" />
        </div>
        <mt-loadmore
          v-else
          :bottom-method="loadNewsBottom"
          :top-method="loadNewsTop"
          :bottom-all-loaded="bottomNewsAllLoaded"
          :top-all-loaded="topNewsAllLoaded"
          ref="loadmoreNewsCollections"
          @bottom-status-change="bottomNewsStatusChange"
          :bottomDistance="70"
        >
          <div class="feed-list" v-if="!nothingNews">
            <CollectionFeed v-for="(feed, index) in feedsList" :feed="feed" :key="feed.feed.feed_id" />
          </div>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-if="bottomNewsAllLoaded">没有更多了</span>
            <section v-else>
              <span v-show="bottomNewsStatus === 'pull' && !bottomNewsAllLoaded">上拉加载更多</span>
              <span v-show="bottomNewsStatus === 'loading'">加载中...</span>
              <span v-show="bottomNewsStatus === 'drop' && !bottomNewsAllLoaded">释放加载更多</span>
            </section>
          </div>
        </mt-loadmore>
      </Tab-pane>
    </Tabs> -->
  </div>
</template>
<script>
  import request, { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import CollectionFeed from '../components/CollectionFeed';
  import { NOTICE, FEEDSLIST, COLLECTIONFEEDSIDS, COLLECTIONFEEDS, ADDCOLLECTIONFEEDSIDS, COLLECTIONNEWS, ADDCOLLECTIONNEWS, COLLECTIONTYPE } from '../stores/types';
  import router from '../routers/index';
  import BackIcon from '../icons/Back';
  import { changeUrl, goTo } from '../utils/changeUrl';
  import lodash from 'lodash';
  import { resolveImage } from '../utils/resource';
  import getImg from '../utils/getImage';
  import timers from '../utils/timer';

  const nothingImg = resolveImage(require('../statics/images/defaultNothingx3.png'));

  const FeedLists = {
    components: {
      CollectionFeed,
      BackIcon
    },
    data: () => ({
      feedsMaxId: 0, // 更新查询用 最新和关注用
      limit: 15,
      errors: {},
      bottomFeedsAllLoaded: false,
      bottomFeedsStatus: '',
      feedType: { // vuex相关action
        ids: COLLECTIONFEEDSIDS,
        feeds: COLLECTIONFEEDS,
        add: ADDCOLLECTIONFEEDSIDS
      },
      currentTab: 'feeds',
      isWeiXin: window.TS_WEB.isWeiXin,
      bottomNewsAllLoaded: false,
      bottomNewsStatus: '',
      newsMaxId: 0
    }),
    methods: {
      timers,
      getImg,
      changeUrl,
      goBack (num) {
        this.$store.dispatch(COLLECTIONTYPE, cb => {
          cb('feeds');
        });
        goTo(num);
      },
      changeTab(tabId) {
        this.$store.dispatch(COLLECTIONTYPE, cb => {
          cb(tabId);
        })
        if(tabId === 'news') {
          if(!this.newsLists.length) this.getNewsData();
        }
      },
      bottomNewsStatusChange (status) {
        this.bottomNewsStatus = status;
      },
      bottomFeedsStatusChange (status) {
        this.bottomFeedsStatus = status;
      },
      /**
       * 加载更多收藏的动态
       * @return {[type]} [description]
       */
      loadFeedsBottom () {
        if(!(this.feedsMaxId > 1)) {
          if(this.$refs.loadmoreFeedsCollections) {
            setTimeout( () => {
              this.$refs.loadmoreFeedsCollections.onBottomLoaded();
            }, 400)
          }
          return ;
        }
        addAccessToken().get(createAPI(`feeds/collections?max_id=${this.feedsMaxId}`), {},
          {
            validate: status  => status === 200
          }
        )
        .then(response => {
          let data = response.data.data;
          let length = data.length;
          if(!length > 0) {
            this.bottomFeedsAllLoaded = true;
            setTimeout(() => {
              if(this.$refs.loadmoreFeedsCollections)
              this.$refs.loadmoreFeedsCollections.onBottomLoaded();
            }, 800)
            return;
          }
          let ids = [];
          let feeds = {};
          data.forEach((d) => {
            ids.push(d.feed.feed_id);
            feeds[d.feed.feed_id] = d;
          });
          this.$store.dispatch(FEEDSLIST, cb => {
            cb(feeds);
          })
          this.$store.dispatch(this.feedType.ids, cb => {
            cb(ids);
          })
          if(length < 15) {
            this.bottomFeedsAllLoaded = true;
          }
          // this.feedsMaxId = data[data.length - 1].feed.feed_id;
          setTimeout(() => {
            if(this.$refs.loadmoreFeedsCollections)
              this.$refs.loadmoreFeedsCollections.onBottomLoaded();
          }, 800)
        })
      },
      /**
       * 加载新的收藏的动态
       * @return {[type]} [description]
       */
      loadFeedsTop () {
        let limiterSend = '';
        let api = this.uri;
        let ids = this.$store.getters[this.feedType.ids];
        addAccessToken().get(createAPI(`feeds/collections`), {}, 
          {
            validate: status  => status === 200
          }
        )
        .then( response => {
          let feeds = response.data.data;
          if(!feeds.length > 0) {
            setTimeout(() => {
              if(this.$refs.loadmoreFeedsCollections)
              {
                this.$refs.loadmoreFeedsCollections.onTopLoaded();
              }
            }, 800)
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
          this.$store.dispatch(this.feedType.add, cb => {
            cb(newIds);
          });
          newFeeds = {};
          newIds = [];
          feeds = [];
          setTimeout(() => {
            if(this.$refs.loadmoreFeedsCollections) {
              this.$refs.loadmoreFeedsCollections.onTopLoaded();
            }
          }, 800)
        });
      },
      /**
       * 刷新
       * @return {[type]} [description]
       */
      loadNewsTop () {
        addAccessToken().get(createAPI(`news/collections`), {}, {
          validate: status => status === 200
        })
        .then( response => {
          let datas = response.data.data;
          if(!datas.length) return;
          datas.forEach( data => {
            if(this.newsLists.findIndex( item => {
                return item.id === data.id
              }) === -1
              ) {
              this.$store.dispatch(ADDCOLLECTIONNEWS, cb => {
                cb(data);
              })
            }
          });
          if(this.$refs.loadmoreNewsCollections) {
            setTimeout( () => {
              this.$refs.loadmoreNewsCollections.onTopLoaded();
            }, 800);
          }
        });
      },
      loadNewsBottom () {
        if( !(this.newsMaxId > 1)) {
          if(this.$refs.loadmoreNewsCollections) {
            setTimeout( () => {
              this.$refs.loadmoreNewsCollections.onBottomLoaded();
            }, 400)
          }
          return;
        }
        addAccessToken().get(createAPI(`news/collections?max_id=${this.newsMaxId}`), {}, {
          validate: status => status === 200
        })
        .then( response => {
          let datas = response.data.data;
          let length = datas.length;
          if(!length) {
            this.bottomNewsAllLoaded = true;
            if(this.$refs.loadmoreNewsCollections) {
              setTimeout( () => {
                this.$refs.loadmoreNewsCollections.onBottomLoaded();
              }, 400)
            }
            return;
          }
          if(length < 15) {
            this.bottomNewsAllLoaded = true;
          }
          datas.forEach( data => {
            this.$store.dispatch(ADDCOLLECTIONNEWS, cb => {
              cb(data);
            })
          });
          if(this.$refs.loadmoreNewsCollections) {
            setTimeout( () => {
              this.$refs.loadmoreNewsCollections.onBottomLoaded();
            }, 800)
          }
        });
      },
      getNewsData () {
        addAccessToken().get(createAPI(`news/collections`), {}, {
          validate: status => status === 200
        })
        .then( response => {
          let datas = response.data.data;
          if(!datas.length) {
            this.bottomNewsAllLoaded = true;
            if(this.$refs.loadmoreNewsCollections) {
              setTimeout( () => {
                this.$refs.loadmoreNewsCollections.onTopLoaded();
              }, 800);
            }
            return;
          }
          datas.forEach( data => {
            this.$store.dispatch(ADDCOLLECTIONNEWS, cb => {
              cb(data);
            })
          })
          // this.newsMaxId = datas[datas.length - 1].id;
          if(datas.length < 15) {
            this.bottomNewsAllLoaded = true;
          };
        });
      }
    },
    computed: {
      error: function () {
        let errors = lodash.values(this.errors);
        return errors[0] || '';
      },
      nothingFeeds () {
        let feedList = this.$store.getters[this.feedType.ids];
        return feedList.length ? 0 : nothingImg;
      },
      nothingNews () {
        let newsList = this.$store.getters[COLLECTIONNEWS];
        return newsList.length ? 0 : nothingImg;
      },
      feedsList() {
        let feeds = this.$store.getters[this.feedType.feeds];
        if(feeds.length) this.feedsMaxId = feeds[feeds.length -1].feed.feed_id;
        return feeds;
      },
      newsLists () {
        let news = this.$store.getters[COLLECTIONNEWS];
        if(news.length) this.newsMaxId = news[ news.length -1 ].id;
        return news;
      },
      active () {
        return this.$store.getters[COLLECTIONTYPE];
      }
    },
    /**
     * 只加载收藏的动态
     * @return {[type]} [description]
     */
    created () {
      if(!this.$store.getters[COLLECTIONTYPE]) {
        this.$store.dispatch(COLLECTIONTYPE, cb => {
          cb('feeds');
        });
        addAccessToken().get(createAPI(`feeds/collections`), 
          {}, 
          {
            validate: status  => status === 200
          }
        )
        .then(response => {
          let feeds = response.data.data;
          if(!feeds.length > 0) return;
          let storeFeeds = {};
          let ids = [];
          feeds.forEach( feed => {
            ids.push(feed.feed.feed_id);
            storeFeeds[feed.feed.feed_id] = feed;
          });
          this.$store.dispatch(FEEDSLIST, cb => {
            cb(storeFeeds);
          })
          this.$store.dispatch(this.feedType.ids, cb => {
            cb(ids);
          });
          if(feeds.length < 15) {
            this.bottomFeedsAllLoaded = true;
          }
          feeds = [];
          if(this.$refs.loadmoreFeedsCollections) {
            setTimeout( () => {
              this.$refs.loadmoreFeedsCollections.onTopLoaded();
            }, 800);
          }
        });
      }
      // if(this.$refs.loadmoreNewsCollections) {
      //   setTimeout( () => {
      //     this.$refs.loadmoreNewsCollections.onTopLoaded();
      //     this.$refs.loadmoreNewsCollections.onBottomLoaded();
      //   }, 800);
      // }
      // if(this.$refs.loadmoreFeedsCollections) {
      //   setTimeout( () => {
      //     this.$refs.loadmoreFeedsCollections.onTopLoaded();
      //     this.$refs.loadmoreFeedsCollections.onBottomLoaded();
      //   }, 800);
      // }
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
  .nothingDefault {
    display: flex; 
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 55px; 
    bottom: 0; 
    left: 0; 
    right: 0;
    img {
      width: 60%;
    }
  }
  .newsLists{
    background-color: #fff;
    .new {
      padding: 12px;
      display: flex;
      align-items: flex-start;
      border-bottom: 1px solid #e2e3e3;
      .sourceTitle {
        width: 75vw;
        height: 18vw;
        padding-right: 8px;
        position: relative;
        h4 {
          color: #333;
          font-weight: 400;
          text-align: initial;
          overflow: hidden;
          text-overflow: ellipsis;  
          display: -webkit-box;  
          -webkit-line-clamp: 2;  
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
        .sourceFrom {
          position: absolute;
          bottom: 0;
          line-height: 1;
          i {
            vertical-align: sub;
            color: #999;
            font-style: normal;
            font-size: 12px;
            &:last-child {
              margin-left: 16px;
            }
            &:first-child {
              margin-left: 0;
            }
          }
        }
      }
      .sourceImg {
        width: 25vw;
        height: 18vw;
        img {
          width: 100%;
          height: 18vw;
          object-fit: cover;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
</style>
<style lang="less">
  .collections {
    position: relative;
    .tabButton {
      background-color: #fff; 
      z-index: 9; 
      position: fixed; 
      top: 46px; 
      left: 0; 
      right: 0; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      height: 45px;
      border-bottom: 1px solid #e2e3e3;
      span {
        height: 100%;
        padding: 8px 12px;
        color: #999;
        position: relative;
        bottom: -1px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.active{ 
          color: #333;
          border-bottom: 2px solid #59b6d7;
        }
      }
    }
    .mint-loadmore {
      overflow: visible;
    }
    .commonHeader {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
    }
    .ivu-tabs-bar {
      margin-bottom: 0;
      background: #fff;
      border-bottom: 1px #e2e3e3 solid;
      position: fixed;
      top: 46px;
      left: 0;
      right: 0;
      z-index: 3;
      .ivu-tabs-nav-scroll {
        display: flex;
        justify-content: center;
        height: 46px;
        line-height: 45px;
        .ivu-tabs-nav {
          height: 100%;
          .ivu-tabs-tab{
            line-height: 2;
            font-size: 16px;
            &.ivu-tabs-tab-active {
              color: #333;
            }
          }
        }
      }
    }
    .ivu-tabs-tabpane {
      height: 100vh;
      padding-top: 91px;
      .mint-loadmore {
        overflow: visible;
      }
    }
  }
</style>
