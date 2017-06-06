<template>
  <div class="newsIndex">
    <header class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="5">
          <BackIcon width="21" height="21" color="#999"  @click.native="goTo(-1)"/>
        </Col>
        <Col span="14" class="title-col">
          资讯
        </Col>
        <Col span="5" class="header-end-col">
          搜索
        </Col>
      </Row>
    </header>
    <nav class="newsIndex-nav">
      <ul>
        <li :class="{ actived: currentCateId == 0 }" @click="handleCateId(-1)">
          <span>推荐</span>
        </li>
        <li 
          @click="handleCateId(cate.id)" 
          v-for="(cate, index) in myCates" 
          :key="index"
          :class="{ actived: currentCateId == cate.id }"
        >
          <span>
          {{ cate.name }}
          </span>
        </li>
      </ul>
      <span class="newsIndex-nav-downArrow">
        <BackIcon height="18" width="18" color="#999" />
      </span>
    </nav>
    <section class="newsIndex-container">
      <section class="newsIndex-container-recommend">
        
      </section>
      <section class="newsIndex-container-newsLists">
        <ul>
          <li 
            class="newsIndex-container-newslist"
            v-for="(list, index) in newsLists"
            :key="index"
          >
            
          </li>
        </ul>
      </section>
    </section>
  </div>
</template>

<script>
  import { createAPI, addAccessToken } from '../../utils/request';
  import lodash from 'lodash';
  import localEvent from '../../stores/localStorage';
  import { changeUrl, goTo } from '../../utils/changeUrl';
  import { resolveImage } from '../../utils/resource';
  import { getUserInfo } from '../../utils/user';

  import BackIcon from '../../icons/Back';

  const newsIndex = {
    components: {
      BackIcon
    },
    data: () => ({
      isWeiXin: TS_WEB.isWeiXin,
      myCates: [], // 我订阅的分类
      moreCates: [], // 其他分类
      newsLists: [], // 首页数据
      recommendLists: [], // banner内容
      currentCateId: -1, //当前的分类ID
      max_id: 0 // 查询条件之一
    }),
    methods: {
      goTo,
      changeUrl,
      handleCateId (cateId) {
        this.currentCateId = cateId;
        this.getList();
      },
      loadMore () {
        this.getList(true);
      },
      getList (loadMore = false) {
        if(!loadMore) this.max_id = 0;
        let query = `cate_id=${this.currentCateId}`;
        if(this.max_id > 1) {
          query += `&max_id=${max_id}`;
        }
        addAccessToken().get(createAPI(`news?cate_id=${this.currentCateId}`),{},
        {
          validateStatus: status => status === 200
        })
        .then( response => {
          let data = response.data.data;
          this.recommendLists = data.recommend // 推荐banner数据
          if( !loadMore ) {
            this.newsLists = data.list; // 首页数据
          } else {
            this.newsLists = [ ...this.newsLists, ...data.list ];
          }
        });
      }
    },
    created () {
      // 获取资讯分类
      addAccessToken().get(createAPI('news/cates'), {}, {

      })
      .then( response => {
        let data = response.data.data;
        this.myCates = data.my_cates; // 我订阅的频道
        this.moreCates = data.more_cates; // 其他频道
      })
      
      // 获取推荐资讯
      let cate_id = -1;
      addAccessToken().get(createAPI(`news?cate_id=${cate_id}`),{},
      {
        validateStatus: status => status === 200
      })
      .then( response => {
        let data = response.data.data;
        if(data.list.length) {
          this.newsLists = data.list; // 首页数据
          this.max_id = data.list[data.list.length - 1].id;
        }
        this.recommendLists = data.recommend // 推荐banner数据
      })
    }
  }

  export default newsIndex;
</script>

<style lang="less" scoped>
  .newsIndex {
    .newsIndex-nav {
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
          overflow: scroll;
          -webkit-overflow-scrolling: touch;
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
        .actived {
          font-size: 16px;
          font-weight: 600;
        }
      }
      .newsIndex-nav-downArrow {
        position: absolute; 
        right: 0;
        top: 0;
        padding-right: 8px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        background: #fff;
        box-shadow: -5px 0 10px #fff;
        width: 10vw;
      }
    }
  }
</style>