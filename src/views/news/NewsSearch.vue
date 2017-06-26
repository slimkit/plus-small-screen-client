<template>
  <div>
    <header class="commonHeader" id="feed-header">
      <Row :gutter="24">
        <Col span="4" style="display: flex; justify-content: flex-start">
          <BackIcon @click.native="leaveSearch" height="21" width="21" color="#999" />
        </Col>
        <Col span="16" class="title-col" style="padding: 0; positoin: relative;">
          <Input 
            v-model="keyword"
            :autofocus="true"
            @on-enter="doSearch()"
          />
          <CloseIcon @click.native="cleanKeyword();" height="20" width="20" color="#999" v-if="keywordCount" style="position: absolute; top: 6px; right: 8px;"/>
        </Col>
      <Col @click.native="doSearch()" style="color: #59b6d7;" span="4" class="header-end-col">
        搜索
      </Col>
      </Row>
    </header>
    <!--组件列表-->
    <section v-if="!resultList.length && !searched"></section>
    <section class="nothingDefault" v-if="nothing && searched"> 
      <img :src="nothing" />
    </section>
    <section v-if="resultList.length && searched" :class="$style.newsIndexContainer">
      <section class="newsIndexContainerRecommend">
        
      </section>
      <section class="newsIndexContainerNewsLists">
        <mt-loadmore
          :bottom-method="loadBottom"
          :top-method="loadTop"
          :bottom-all-loaded="bottomAllLoaded"
          :top-all-loaded="topAllLoaded"
          ref="searchNewsLoadmore"
          :bottomDistance="70"
          @bottom-status-change="bottomStatusChange"
        >
          <ul :class="$style.newsLists">
            <li
              class="newsIndex-container-newslist"
              v-for="(list, index) in resultList"
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
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-if="bottomAllLoaded">没有更多了</span>
            <section v-else>
              <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
              <span v-show="bottomStatus === 'loading'">加载中...</span>
              <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
            </section>
          </div>
        </mt-loadmore>
      </section>
    </section>
  </div>
</template>

<script>
  import { CURRENTNEWSCATEID, NEWSSEARCHKEY, NEWSSEARCHRESULT, APPENDNEWSTORESULT, PREPENDNEWSTORESULT, RESETKEYWORD, RESULTIDS } from '../../stores/types';
  import BackIcon from '../../icons/Back';
  import CloseIcon from '../../icons/Close';
  import { createAPI, addAccessToken } from '../../utils/request';
  import lodash from 'lodash';
  import timers from '../../utils/timer';
  import getImg from '../../utils/getImage';
  import { changeUrl, goTo } from '../../utils/changeUrl';
  import { mapState } from 'vuex';
  import { resolveImage } from '../../utils/resource';

  const defaultNothing = resolveImage(require('../../statics/images/defaultNothingx2.png'));
  const newsSearch = {
    created () {
      this.resultList = [ ...this.storeSearchResult ];
      this.keyword = this.storeKeyWord;
      this.resultListIds = this.storeResultIds;
    },
    components: {
      BackIcon,
      CloseIcon
    },
    data: () => ({
      keyword: '',
      resultList:[],
      resultListIds: [],
      max_id: 0,
      bottomAllLoaded: false,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      searched: false
    }),
    methods: {
      changeUrl,
      leaveSearch() {
        this.$store.dispatch(RESETKEYWORD);
        goTo(-1);
      },
      timers,
      getImg,
      bottomStatusChange(status) {
        this.bottomStatus = status;
      },
      cleanKeyword () {
        this.keyword = '';
      },
      doSearch () {
        if(!this.keywordCount) return;
        this.searched = true;
        addAccessToken().get(createAPI(`news/search?limit=15&key=${this.keyword}`),
          {},
          {
            validateStatus: status => status === 200
          }
        )
        .then( response => {
          this.resultList = response.data.data;
          if(response.data.data.length) {
            this.max_id = response.data.data[response.data.data.length - 1].id;
            response.data.data.forEach( news => {
              this.resultListIds.push(news.id);
            });
          }
          this.$store.dispatch(NEWSSEARCHKEY, cb => {
            cb(this.keyword);
          });
          this.$store.dispatch(NEWSSEARCHRESULT, cb => {
            cb(this.resultList);
          });
          this.$store.dispatch(RESULTIDS, cb => {
            cb(this.resultListIds);
          })

          if(response.data.data.length < 15) {
            this.bottomAllLoaded = true;
          }
          if(this.$refs.searchNewsLoadmore) {
            setTimeout( () => {
              this.$refs.searchNewsLoadmore.onTopLoaded();
              this.$refs.searchNewsLoadmore.onBottomLoaded();
            }, 800)
          }
        });
      },
      loadTop () {
        if(!this.keywordCount) return;
        addAccessToken().get(createAPI(`news/search?limit=15&key=${this.keyword}`),
          {},
          {
            validateStatus: status => status === 200
          }
        )
        .then( response => {
          this.resultList = response.data.data;
          if(response.data.data.length) {
            response.data.data.forEach( news => {
              if(!this.resultListIds.includes(news.id)) {
                this.resultListIds.push(news.id);
                this.resultList = { news, ...this.resultList };
              }
            });
          }
          this.$store.dispatch(NEWSSEARCHRESULT, cb => {
            cb(this.resultList);
          })
          this.$store.dispatch(RESULTIDS, cb => {
            cb(this.resultListIds);
          });
          this.$store.dispatch(NEWSSEARCHKEY, cb => {
            cb(this.keyword);
          });
          if(this.$refs.searchNewsLoadmore) {
            setTimeout( () => {
              this.$refs.searchNewsLoadmore.onTopLoaded();
            }, 800)
          }
        });
      },
      /**
       * 加载更多
       * @return {[type]} [description]
       */
      loadBottom () {
        if(!this.keywordCount) return;
        addAccessToken().get(createAPI(`news/search?limit=15&key=${this.keyword}&max_id=${this.max_id}`),
          {},
          {
            validateStatus: status => status === 200
          }
        )
        .then( response => {
          this.resultList = { ...this.resultList, ...response.data.data };
          if(response.data.data.length) {
            this.max_id = response.data.data[response.data.data.length - 1].id;
            response.data.data.forEach( news => {
              this.resultListIds.push(news.id);
            });
          }
          this.$store.dispatch(NEWSSEARCHRESULT, cb => {
            cb(this.resultList);
          })
          this.$store.dispatch(RESULTIDS, cb => {
            cb(this.resultListIds);
          });
          this.$store.dispatch(NEWSSEARCHKEY, cb => {
            cb(this.keyword);
          });
          if(response.data.data.length < 15) {
            this.bottomAllLoaded = true;
          }
          if(this.$refs.searchNewsLoadmore) {
            setTimeout( () => {
              this.$refs.searchNewsLoadmore.onBottomLoaded();
            }, 800)
          }
        });
      }
    },
    computed: {
      keywordCount () {
        return this.keyword.length;
      },
      nothing () {
        return this.resultList.length ? false : defaultNothing;
      },
      ...mapState({
        storeKeyWord: state => state.newsAbout.newsAbout.searchKey,
        storeSearchResult: state => state.newsAbout.newsAbout.searchResult,
        storeResultIds: state => state.newsAbout.newsAbout.resultIds
      })
    }
  };

  export default newsSearch;
</script>
<style lang="less" scoped>
  .commonHeader {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 6;
  }
  .mint-loadmore {
    overflow: visible;
  }
  .nothingDefault {
    padding-top: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    img {
      width: 70%;
    }
  }
</style>
<style lang="less" module>
  .newsIndexContainer {
    padding-top: 46px;
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
  }
</style>