<template>
  <div class="feedParentContainer">
    <div :class="$style.nothingDefault"> 
      <img v-if="nothing" :src="`http://localhost:8080${nothing}`" />
    </div>
    <div v-if="!nothing" :class="{fixed: !showTop, noFixed: showTop}">
      
    </div>
    <mt-loadmore
      v-if="!nothing"
      :bottom-method="loadBottom"
      :top-method="loadTop"
      :bottom-all-loaded="bottomAllLoaded"
      :top-all-loaded="topAllLoaded"
      ref="loadmore"
      bottomPullText="上拉加载更多动态"
      bottomDropText="释放加载更多动态"
      topPullText="下拉更新动态"
      topDropText="释放更新动态"
      :bottomDistance="70"
    >
      <div class="feed-list" v-if="!nothing">
        <Feed v-for="(feed, index) in feedsList" :feed="feed" :index="index" :key="feed.id"></Feed>
      </div>
    </mt-loadmore>
  </div>
</template>
<script>
  import request, { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import Feed from './Feed';
  import nothingImg from '../statics/images/defaultNothingx3.png';
  import { NOTICE, FEEDSFOLLOWING, FEEDSFOLLWOINGADD, FEEDFOLLOWINGUPDATE } from '../stores/types';

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
      isShowComfirm: false,
      CanInput: false,
      showTop: true,
      feedType: {
        'following': {
          list: FEEDSFOLLOWING,
          add: FEEDSFOLLWOINGADD,
          update: FEEDFOLLOWINGUPDATE
        }
      }
    }),
    methods: {
      // 加载更多
      loadBottom () {
        let limiterSend = '';
        let api = this.option.uri; // 查询地址
        let limiter = this.option.limiter; // 分页查询方式
        let max_id = this.maxId; // 分页参数
        if( max_id == 0) {
          return ;
        }
        if(limiter == 'page') {
          this.page += 1;
          limiterSend = `?page=${max_id}`;
        } else {
          limiterSend = `?max_id=${max_id}`;
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
          data.forEach((d) => {
            // this.feeds.push(d);
            this.$store.dispatch(type.add, cb => {
              cb(d);
            })
          });
          if(length < 15) {
            this.bottomAllLoaded = true;
          }
          this.maxId = data[length - 1].feed.feed_id;
          setTimeout(() => {
            this.$refs.loadmore.onBottomLoaded();
          }, 1500)
        });
      },
      loadTop () {
        setTimeout(() => {
          if(this.$refs.loadmore)
          this.$refs.loadmore.onTopLoaded();
        }, 1500)
      }
    },
    computed: {
      error: function () {
        let errors = Object.values(this.errors);
        return errors[0] || '';
      },
      nothing () {
        let type = this.feedType[this.option.type];
        let feedList = this.$store.getters[type.list];
        return feedList.length ? 0 : nothingImg;
      },
      feedsList() {
        let type = this.feedType[this.option.type];
        return this.$store.getters[type.list];
      }
    },
    mounted () {
      let limiterSend = '';
      let api = this.option.uri;
      let limiter = this.option.limiter;
      if (limiter == 'page') {
        this.limitCounter = 1;
        limiterSend = '?page=1';
      }
      addAccessToken().get(createAPI(`${api}${limiterSend}`), 
        {}, 
        {
          validate: status  => status === 200
        }
      )
      .then(response => {
        let type = this.feedType[this.option.type];
        this.$store.dispatch(type.list, cb => {
          cb(response.data.data);
        })
        // this.feeds = response.data.data;
        let lastFeed = response.data.data[response.data.data.length.length - 1];
        this.maxId = lastFeed.feed.feed_id;
        if(response.data.data.length < 15) {
          this.bottomAllLoaded = true;
        }
      })
      .catch(({ response: { data = {} } = {} } ) => {
        const { code = 'xxxx' } = data;
        this.errors = Object.assign({}, this.errors, { serverError: errorCodes[code] });
      });
    },
    updated () {
      this.showTop = false;
      setTimeout(() => {
        if(this.$refs.loadmore){
          this.$refs.loadmore.onTopLoaded();
        }
      }, 500);
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
    top: 0; 
    bottom: 0; 
    left: 0; 
    right: 0;
    img {
      width: 60%;
    }
  }
</style>
<style scoped>
  .mint-loadmore {padding-bottom: 60px}
  .mint-loadmore-content-parent-no-trans .mint-loadmore-content {
    transform: inherit;
  }
  .noFixed {
    height: 55px;
    display: none;
  }
  .fixed {
    height: 55px;
    display: block;
  }
</style>
