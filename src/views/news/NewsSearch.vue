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
            v-childfocus
          />
          <CloseIcon @click.native="cleanKeyword();" height="20" width="20" color="#999" v-if="keywordCount" style="position: absolute; top: 6px; right: 8px;"/>
        </Col>
      <Col @click.native="doSearch()" style="color: #59b6d7;" span="4" class="header-end-col">
        搜索
      </Col>
      </Row>
    </header>
    <!--组件列表-->
    <section v-if="!resultList.length && !storeSearched"></section>
    <section class="nothingDefault" v-if="nothing && storeSearched"> 
      <img :src="nothing" />
    </section>
    <section v-if="resultList.length && storeSearched" :class="$style.newsIndexContainer">
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
              v-for="(news, index) in storeSearchResult"
              :key="index"
              :class="$style.new"
              @click="changeUrl(`/news/${news.id}/detail`)"
            >
              <div :class="$style.sourceTitle">
                <h4>{{ news.title }}</h4>
                <section :class="$style.sourceFrom">
                  <i>
                    <timeago :class="$style.timer" :since="timers(news.created_at, 8, false)" locale="zh-CN" :auto-update="60"></timeago>
                  </i>
                  <i v-if="news.from">来自 {{ news.from }}</i>
                </section>
              </div>
              <figure :class="$style.sourceImg">
                <img v-if="news.image" v-lazy="getImg(news.image.id)" :alt="news.title">
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
  import { changeUrl, goTo } from '../../utils/changeUrl';
  import { mapState } from 'vuex';
  import { resolveImage } from '../../utils/resource';
  import buildURL from 'axios/lib/helpers/buildURL';

  const defaultNothing = resolveImage(require('../../statics/images/defaultNothingx2.png'));
  const newsSearch = {
    created () {
      this.keyword = this.storeKeyWord;
      this.resultList = [ ...this.storeSearchResult ];
      this.resultListIds = [ ...this.storeResultIds ];
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
      limit: 15,
    }),
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
        storeResultIds: state => state.newsAbout.newsAbout.resultIds,
        storeSearched: state => state.newsAbout.newsAbout.storeSearched
      })
    },
    methods: {
      changeUrl,
      leaveSearch() {
        this.$store.dispatch(RESETKEYWORD);
        goTo(-1);
      },
      timers,
      getImg (id) {
        return buildURL(createAPI(`files/${id}`), {w: 200, height: 200});
      },
      bottomStatusChange(status) {
        this.bottomStatus = status;
      },
      cleanKeyword () {
        this.keyword = '';
      },
      doSearch ( loadMore = true ) {
        if(!this.keywordCount) return;

        if(!loadMore){
          this.max_id = 0;
        }
        addAccessToken().get(createAPI(`news?limit=${ this.limit }&key=${ this.keyword }&after=${ this.max_id }`),{},
          {
            validateStatus: status => status === 200
          }
        )
        .then( ({data = []}) => {
          const len = data.length;
          if(len) {
            if(loadMore){
              this.resultList = [ ...this.resultList, ...data ];
            }else{
              this.resultList = [ ...data ];
            }
            // 最后一条数据.ID
            this.max_id = data[len - 1].id;

            data.forEach( news => {
              if(!this.resultListIds.includes(news.id)) {
                this.resultListIds.push(news.id);
              }
            });
          }
          // 存储 搜索关键字
          this.$store.dispatch(NEWSSEARCHKEY, cb => {
            cb(this.keyword);
          });
          // 存储 搜索结果
          this.$store.dispatch(NEWSSEARCHRESULT, cb => {
            cb(this.resultList);
          });
          this.$store.dispatch(RESULTIDS, cb => {
            cb(this.resultListIds);
          })

          // 判断是否有下一页
          if(len < this.limit) {
            this.bottomAllLoaded = true;
          }

          if(this.$refs.searchNewsLoadmore) {
            setTimeout( () => {
              this.$refs.searchNewsLoadmore.onTopLoaded();
            }, 800)
          }
        });
      },
      loadTop () {
        this.doSearch(false);
      },
      loadBottom () {
        this.doSearch();
      }
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