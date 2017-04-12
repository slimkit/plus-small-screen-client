<template>
  <mt-loadmore 
    :bottom-method="loadBottom"
    :top-method="loadTop"
    :bottom-all-loaded="bottomAllLoaded"
    :top-all-loaded="topAllLoaded"
    ref="loadmore"
    :key="1"
    :bottom-distance="120"
  >
    <div class="feed-list">
      <Feed v-for="feed in feeds" :feed="feed" :key="feed.id"></Feed>
    </div>
    <div v-show="bottomAllLoaded && bottomStatus !== 'loading'" style="display: flex; justify-content: center; align-items: center; padding: 10px 0">
      <span>没有更多了</span>
    </div>
  </mt-loadmore>
</template>
<script>
  import request, { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import Feed from './Feed';
  import { getUserInfo } from '../utils/user';
  // import Scroller from 'vue-scroller';

  const FeedLists = {
    components: {
      Feed
    },
    props: {
      option: Object
    },
    data: () => ({
      feeds: [],
      maxId: 0,
      limit: 15,
      errors: {},
      limitCounter: 0,
      bottomAllLoaded: false,
      topAllLoaded: true,
      bottomStatus: '',
      isShowComfirm: false,
      CanInput: false,
    }),
    methods: {
      loadBottom () {
        this.bottomStatus = 'loading';
        console.log(this);
      },
      loadTop () {
        console.log(this);
        setTimeout(() => {
          this.$refs.loadmore.onTopLoaded();
        }, 1500)
      }
    },
    computed: {
      error: function () {
        let errors = Object.values(this.errors);
        return errors[0] || '';
      }
    },
    mounted () {
      let limiterSend = {};
      let api = this.option.uri;
      let limiter = this.option.limiter;
      if (limiter == 'page') {
        this.limitCounter = 1;
        limiterSend = '?page=1';
      } else {
        limiterSend = '?'
      }
      addAccessToken().get(createAPI(`${api}${limiterSend}`), 
        {}, 
        {
          validate: status  => status === 200
        }
      )
      .then(response => {
        this.feeds = response.data.data;
        this.$refs.loadmore.onBottomLoaded();
      })
      .catch(({ response: { data = {} } = {} } ) => {
        const { code = 'xxxx' } = data;
        this.errors = Object.assign({}, this.errors, { serverError: errorCodes[code] });
      });
    },
    updated () {
      if (this.$refs.my_scroller)
        this.$refs.my_scroller.resize();
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
<style>
  .mint-loadmore-content-parent-no-trans .mint-loadmore-content {
    transform: inherit!important;
  }
</style>
