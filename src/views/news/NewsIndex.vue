
<template>
  <div :class="$style.newsIndex">
    <div id="spinner" v-show="showSpinner">
      <div id="spinner-parent">
        <div class="spinner-double-bounce-bounce2"></div>
        <div class="spinner-double-bounce-bounce1"></div>
      </div>
    </div>
    <header class="commonHeader">
      <Row :gutter="24" style="height: 46px; border-bottom: 1px solid #e2e3e3;">
        <Col span="5">
          <BackIcon width="21" height="21" color="#999"  @click.native="goTo(-1)"/>
        </Col>
        <Col span="14" class="title-col">
          资讯
        </Col>
        <Col span="5" class="header-end-col" @click.native="changeUrl('/news/search')">
          <SearchIcon height="21" width="21" color="#999" />
        </Col>
      </Row>
      <nav :class="$style.newsIndexNav">
        <ul>
          <li :class="{ actived: currentNewsCateId === 0 }" @click="handleCateId(0)">
            <span>推荐</span>
          </li>
          <li 
            @click="handleCateId(cate.id)" 
            v-for="(cate, index) in oldMyCates" 
            :key="index"
            :class="{ actived: currentNewsCateId === cate.id }"
          >
            <span>
            {{ cate.name }}
            </span>
          </li>
        </ul>
        <span :class="$style.newsIndexNavDownArrow" @click="handleShowEditBox()">
          <DownArrowIcon height="18" width="18" color="#999" />
        </span>
      </nav>
    </header>
    <section class="nothingDefault" v-if="nothing"> 
      <img :src="nothing" />
    </section>
    <!--组件列表-->
    <section v-else :class="$style.newsIndexContainer">
      <section class="newsIndexContainerRecommend">
        
      </section>
      <section class="newsIndexContainerNewsLists">
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
          <ul :class="$style.newsLists">
            <li
              class="newsIndex-container-newslist"
              v-for="(news, index) in newsLists"
              :key="index"
              :class="$style.new"
              @click="changeUrl(`news/${news.id}/detail`)"
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
    <section v-if="showEditBox" :class="$style.editBox">
      <section :class="$style.operations">
        <span v-if="!canEdit">编辑关注分类</span>
        <span v-else>点击可调整分类</span>
        <div :class="$style.controller">
          <span v-if="canEdit" @click="handleCanEdit(false)">
            完成
          </span>
          <span v-else @click="handleCanEdit(true)">
            编辑
          </span>
          <span @click="handleShowEditBox(false)">
            收起
          </span>
        </div>
      </section>
      <section :class="$style.allCates">
        <p :class="$style.allCatesTitle">我的订阅</p>
        <section :class="$style.allCatesBox">
          <span :class="[$style.allCatesChild, $style.recommendCate]" > 推荐 </span>
          <span 
            :class="[ $style.allCatesChild, { endChild: (index + 2) % 4 === 0 }]" 
            v-for="(cate, index) in myCates" 
            :key="index"
            @click="deleteMyCates(index)"
          >
            <CloseIcon :class="$style.closeIcon" v-if="canEdit" height="15" width="15" color="#999" />
            {{cate.name}}
          </span>
        </section>
        <p :class="$style.allCatesTitle">更多订阅</p>
          <section :class="$style.allCatesBox">
            <span 
              :class="[ $style.allCatesChild, { endChild: (index + 1) % 4 === 0, canEdit: canEdit }]" 
              v-for="(cate, index) in moreCates" 
              :key="index"
              @click="addToMyCates(index)"
            >
              {{cate.name}}
            </span>
          </section>
      </section>
    </section>
  </div>
</template>

<script>
  import { createAPI, addAccessToken, createOldAPI } from '../../utils/request';
  import lodash from 'lodash';
  import { changeUrl, goTo } from '../../utils/changeUrl';
  import { getUserInfo } from '../../utils/user';
  import timers from '../../utils/timer';
  import BackIcon from '../../icons/Back';
  import CloseIcon from '../../icons/Close';
  import SearchIcon from '../../icons/Search';
  import DownArrowIcon from '../../icons/DownArrow';
  import { resolveImage } from '../../utils/resource';
  import { mapState } from 'vuex';
  import { CURRENTNEWSCATEID } from '../../stores/types';
  import buildUrl from 'axios/lib/helpers/buildURL';

  const defaultNothing = resolveImage(require('../../statics/images/defaultNothingx2.png'));

  const newsIndex = {
    components: {
      BackIcon,
      CloseIcon,
      SearchIcon,
      DownArrowIcon
    },
    data: () => ({
      isWeiXin: TS_WEB.isWeiXin,
      myCates: [], // 我订阅的分类
      moreCates: [], // 其他分类
      oldMyCates: [],
      oldMoreCates: [],
      newsLists: [], // 首页数据
      max_id: 0, // 查询条件之一,
      showSpinner: false, // 等待。。。
      bottomAllLoaded: false,
      topAllLoaded: false,
      topStatus: '',
      bottomStatus: '',
      newsListIds: [], // 资讯id集合
      canEdit: false,
      key: "",   // 查询关键字
      limit: 5, // 每页显示条数
      showEditBox: false
    }),
    computed: {
      nothing () {
        return (this.newsLists.length) ? false : defaultNothing;
      },
      ...mapState({
        currentNewsCateId: state => state.newsAbout.newsAbout.currentnewscateid
      }),
      searchParams(){
        let 
            cate_id = this.currentNewsCateId || 0, // 分类ID
            recommend = 0;  // 是否推荐
            recommend = cate_id === 0 ? 1 : 0;
        return {
          limit: this.limit || 15,
          cate_id,
          recommend
        }
      }
    },
    methods: {
      timers,
      goTo,
      changeUrl,
      getImg (id) {
        return buildUrl(createAPI(`files/${id}`), {w: 100, h: 100});
      },
      deleteMyCates (index) {
        if(!this.canEdit) return;
        let element = this.myCates[index];
        let newSet = new Set(this.myCates);
        newSet.delete(element);
        this.myCates = Array.from(newSet);
        this.moreCates.push(element);
      },

      addToMyCates( index ) {
        if(!this.canEdit) return;
        let element = this.moreCates[index];
        let newSet = new Set(this.moreCates);
        newSet.delete(element);
        this.moreCates = Array.from(newSet);
        this.myCates.unshift(element);
      },

      handleCanEdit ( status = true ) {
        this.canEdit = status;
        if(!status) this.changeMyCates();
      },

      handleShowEditBox( status = true ) {
        console.log(status);
        this.showEditBox = status;
        if(!status) {
          this.canEdit = false;
          this.myCates = [ ...this.oldMyCates ];
          this.moreCates = [ ...this.oldMoreCates ];
        }
      },

      changeMyCates () {
        let cates = '';
        this.myCates.forEach( cate => {
          cates += cate.id + ',';
        });
        cates = cates.substring(0, cates.length -1);
        addAccessToken().patch(createAPI(`news/categories/follows`),
          {
            follows: cates
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then( response => {
          this.oldMyCates = this.myCates;
          this.oldMoreCates = this.moreCates;
          this.$store.dispatch(CURRENTNEWSCATEID, cb => {
            cb(0);
          });
          this.getUserCates();
          this.getNewsList();
        })
      },

      bottomStatusChange(status) {
        this.bottomStatus = status;
      },

      // 上拉加载
      loadBottom () {
        this.getNewsList(true);
      },
      // 下拉刷新
      loadTop () {
        this.getNewsList();
      },

      // 请求数据
      getNewsList (loadMore = false) {
        if(!loadMore) {
          this.max_id = 0
        };
        addAccessToken().get(createAPI(`news?after=${this.max_id}`),{
          params: this.searchParams
        },{
          validateStatus: status => status === 200
        })
        .then(({ data = [] }) => {

          let length = data.length;

          // 判断是否有下一页
          if( length < this.limit ) {
            this.bottomAllLoaded = true;
          } else {
            this.bottomAllLoaded = false;
          }

          data.forEach( nwes => {
            this.newsListIds.push(nwes.id);
          });

          // 判断 刷新 OR 加载更多
          if( !loadMore ) {
            this.newsLists = [ ...data ]; // 刷新
          } else {
            this.newsLists = [ ...this.newsLists, ...data ]; // 加载更多
          }

          // 最后一条的 ID
          if(data.length) this.max_id = data[data.length - 1].id;

          setTimeout(() => {
            if(this.$refs.loadmore)
              loadMore ? this.$refs.loadmore.onBottomLoaded() : this.$refs.loadmore.onTopLoaded();
          }, 500);

          this.showSpinner = false;
        });
      },

      // 改变分类ID
      handleCateId (cateId) {
        if(cateId === this.currentNewsCateId) return;
        this.$store.dispatch(CURRENTNEWSCATEID, cb => {
          cb(cateId);
        })
        this.showSpinner = true;
        this.newsListIds = []; // 清除资讯数据
        this.recommendListIds = []; // 清除推荐数据
        this.getNewsList();
      },

      // 获取用户订阅分类信息
      getUserCates(){
      
        this.showSpinner = true;
        
        // 获取资讯分类
        addAccessToken().get(createAPI('news/cates'),
          {},
          {
            validateStatus: status => status === 200
          }
        )
        .then( response => {
          let {
            my_cates = [],
            more_cates = []
          } = response.data || {};

          // 未订阅时 截取全部分类的前5个
          my_cates = my_cates.length > 0 ? my_cates : more_cates.splice(0, 5);

          this.myCates = [ ...my_cates ]; // 我订阅的频道
          this.oldMyCates = [...my_cates];
          this.moreCates = [ ...more_cates ]; // 其他频道
          this.oldMoreCates = [ ...more_cates ];
        })
        .catch(error => {
          if(error.response) {
            const { status = 0 } = error.response;
            if(status === 404){
              this.myCates = [] // 我订阅的频道
              this.moreCates = []; // 其他频道
              this.oldMyCates = [];
              this.oldMoreCates = [];
              console.log('none');
            }
          }
        });

        this.showSpinner = false;
      }
    },
    created () {
      // 获取用户订阅分类信息
      this.getUserCates();

      // 获取资讯列表 默认请求推荐资讯
      this.getNewsList(true);
    }
  }

  export default newsIndex;
</script>

<style lang="less" scoped>
  .commonHeader {
    height: 87px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 6;
    border-bottom: none;
  }
  .actived {
    font-size: 16px;
    font-weight: 600;
  }
  #spinner {
    top: 87px;
  }
  .nothingDefault {
    padding-top: 87px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    img {
      width: 70%;
    }
  }
  .mint-loadmore {
    padding-bottom: 50px;
    overflow: initial;
  }
</style>
<style lang="less" module>
  .newsIndex {
    .newsIndexNav {
      width: 100vw;
      overflow: hidden;
      padding: 8px 2px;
      border-bottom: 1px solid #e2e3e3;
      background: #fff;
      position: relative;
      ul {
          display: flex;
          align-items: center;
          width: 90vw;
          overflow-x: scroll;
        &::-webkit-scrollbar {
          height: 0;
          display: none;
        }
        li {
          display: inline-table;
          span {
            padding: 4px 10px;
          }
        }
      }
      .newsIndexNavDownArrow {
        position: absolute; 
        right: 0;
        top: 0;
        padding-right: 12px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        background: #fff;
        box-shadow: -5px 0 10px #fff;
        width: 10vw;
      }
    }
    .newsIndexContainer {
      padding-top: 87px;
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
    .editBox {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      z-index: 6;
      .operations {
        padding: 8px 12px;
        height: 46px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        background-color: #e2e3e3;
        .controller {
          color: #59b6d7;
        }
      }
      .allCates {
        font-size: 14px;
        padding: 8px 12px;
        .allCatesTitle {
          color: #999;
          padding: 20px 0 10px 0;
        }
        .allCatesBox {
          display: inline-table;
          width: 100%;
          .allCatesChild {
            &.recommendCate {
              background-color: #d9eef6;
            }
            width: calc(~"91% / 4");
            padding: 8px 2.5vw;
            background-color: #eee;
            display: inline-flex;
            justify-content: center;
            margin: 0 3% 3% 0;
            border-radius: 5px;
            position: relative;
            svg.closeIcon {
              position: absolute;
              top: -5px;
              left: -5px;
            }
          }
        }
      }
    }
  }
</style>
<style scoped lang="less">
  .endChild {
    margin-right: 0!important;
  }
</style>