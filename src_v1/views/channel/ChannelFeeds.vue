<template>
  <div class="channelfeeds">
    <section class="channelInfo">
      <p class="back">
        <BackIcon @click.native="goTo(-1)" height="30" width="30" color="#fff" />
      </p>
      <section class="info">
        <img v-lazy="avatar" class="cover" :alt="channelInfo.title">
        <section class="detailInfo">
          <section>
            <img v-lazy="avatar" :alt="channelInfo.title" >
            <h4>{{ channelInfo.title }}</h4>
            <p>{{ channelInfo.description }}</p>
            <section>
              订阅 <i>{{ channelInfo.follow_count }}</i>
              分享 <i>{{ channelInfo.feed_count }}</i>
            </section>
          </section>
        </section>
      </section>
    </section>
    <section class="feedsLists">
      <div class="nothingDefault" v-if="nothing"> 
        <img :src="nothing" />
      </div>
      <mt-loadmore
        v-else
        :bottom-method="loadBottom"
        :top-method="loadTop"
        :bottom-all-loaded="bottomAllLoaded"
        :top-all-loaded="topAllLoaded"
        ref="loadmoreChannelFeeds"
        :bottomDistance="70"
        @bottom-status-change="bottomStatusChange"
      >
        <ul class="feed-list">
          <Feed v-for="(feed, index) in feedsLists" :feed="feed" :key="feed.feed.feed_id"></Feed>
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
  </div>
</template>
<style lang="less" scoped>
  .channelfeeds {
    .channelInfo {
      position: relative;
      display: flex;
      justify-content: center;
      z-index: 9;
      .back {
        position: absolute;
        top: 12px;
        left: 12px;
        right: 0;
        z-index: 10;
      }
      .info {
        height: 90vw;
        width: 100vw;
        z-index: 8;
        overflow: hidden;
        background-color: #fff;
        img.cover {
          width: 100vw;
          height: 90vw;
          left: 0;
          top: 0; 
          right: 0;
          filter:blur(50px)
        }
        .detailInfo {
          width: 100vw;
          height: 90vw;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #fff;
          img {
            object-fit: cover;
            width: 30vw;
            height: 30vw;
            border: 2px solid #fff;
          }
          h4 {
            padding: 4vw 0;

          }
          p {
            padding-bottom: 4vw;
          }
          section {
            i {
              font-style: normal;
              padding-right: 2vw;
            }
          }
        }
      }
    }
    .feedsLists {
      .mint-loadmore {
        overflow: visible;
      }
    }
    .plusIcon {
      position: fixed;
      bottom: 2vh;
      left: 0;
      right: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      span {
        border-radius: 100px;
        background-color: #59b6d7;
        border: 2px solid #fff;
        padding: 10px;
        box-shadow: 0 0 5px #59b6d7;
      }
    }
  }
</style>
<script>
  import Feed from '../../components/Feed';
  import { createAPI, createOldAPI, addAccessToken } from '../../utils/request';
  import { changeUrl, goTo } from '../../utils/changeUrl';
  import BackIcon from '../../icons/Back';
  import PlusIcon from '../../icons/Plus';
  import buildUrl from 'axios/lib/helpers/buildURL';
  import { resolveImage } from '../../utils/resource';
  import { SHOWPOST } from '../../stores/types';

  const nothingImg = resolveImage(require('../../statics/images/defaultNothingx3.png'));
  const ChannelFeeds = {
    data: () => ({
      channelId: 0,
      channelInfo: {},
      feedsLists: [],
      max_id: 0,
      bottomAllLoaded: false,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      showSpinner: true,
    }),
    created () {
      let channelId = this.$route.params.id;
      this.channelId = channelId;
      addAccessToken().get(createOldAPI(`channel/${channelId}`), {}, {
        validateStatus: status => status === 200
      })
      .then( response => {
        this.channelInfo = { ...response.data.data };
      });

      addAccessToken().get(createOldAPI(`channels/${channelId}/feeds`),{},
      {
        validateStatus: status => status === 200
      })
      .then( response => {
        let datas = response.data.data;
        if(datas.length < 15) {
          this.bottomAllLoaded = true;
        }
        if(datas.length) this.max_id = datas[datas.length -1].feed.feed_id;
        this.feedsLists = [ ...datas ];
        if(this.$refs.loadmoreChannelFeeds) {
          setTimeout( () => {
            this.$refs.loadmoreChannelFeeds.onTopLoaded();
          }, 800);
        }
      });
    },
    methods: {
      goTo,
      showPost() {
        this.$store.dispatch(SHOWPOST, cb => {
          cb({
            show: true,
            channelId: this.channelId
          });
        })
      },
      bottomStatusChange(status) {
        this.bottomStatus = status;
      },
      loadTop() {
        addAccessToken().get(createOldAPI(`channels/${this.channelId}/feeds`),{},
        {
          validateStatus: status => status === 200
        })
        .then( response => {
          let datas = response.data.data;
          let length = datas.length;
          if(length) {
            datas.reverse().forEach( data => {
              if(this.feedsLists.findIndex( item => {
                  return item.feed.feed_id == data.feed.feed_id;
                }) === -1
              ) {
                this.feedsLists.unshift(data);
              }
            })
          }
          if(this.$refs.loadmoreChannelFeeds) {
            setTimeout( () => {
              this.$refs.loadmoreChannelFeeds.onTopLoaded();
            }, 800);
          }
        });
      },
      loadBottom() {
        if(!this.max_id > 1) return;
        addAccessToken().get(createOldAPI(`channels/${this.channelId}/feeds?max_id=${this.max_id}`),{},
        {
          validateStatus: status => status === 200
        })
        .then( response => {
          let datas = response.data.data;
          let length = datas.length;
          if(length) {
            this.feedsLists = [ ...this.feedsLists, ...datas ];
          }
          if(length < 15) {
            this.bottomAllLoaded = true;
          }
          this.max_id = datas[length-1].feed.feed_id;
          if(this.$refs.loadmoreChannelFeeds) {
            setTimeout( () => {
              this.$refs.loadmoreChannelFeeds.onBottomLoaded();
            });
          }
        });
      }
    },
    computed: {
      nothing () {
        return this.feedsLists.length ? false : nothingImg;
      },
      bgImage () {
        const { cover: { id = 0 }  = {} } = this.channelInfo;
        if( !id ) return '';
        let cover = buildUrl(createOldAPI(`files/${id}`), {w: 100, h: 100});
        return `background: url(${cover});background-size:cover;filter:blur(50px);`;
      },
      avatar () {
        const { cover: { id = 0 }  = {} } = this.channelInfo;
        if(!id) return '';
        return buildUrl(createOldAPI(`files/${id}`), {w: 100, h: 100});
      }
    },
    components: {
      BackIcon,
      Feed,
      PlusIcon
    }
  }

  export default ChannelFeeds;
</script>