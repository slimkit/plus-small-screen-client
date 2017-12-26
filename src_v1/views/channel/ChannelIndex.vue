<template>
  <div class="channelIndex">
    <BackIcon width="21" height="21" @click.native="goTo(-1)" color="#999" style="z-index: 4; position: fixed; left: 12px; top: 12px;" />
    <Tabs v-model="currentTab" @on-click="getChannels">
      <Tab-pane label="我订阅的" name="myChannel">
        <section>
          <ul v-if="myChannelIds.length" class="channelCateParent">
            <li v-for="(channel, index) in myChannel" class="channelItem"  @click.self="changeUrl(`/channel/${channel.id}`)">
              <div class="channelCover" @click="changeUrl(`/channel/${channel.id}`)">
                <img :src="getImg(channel.cover.id)" alt="" />
              </div>
              <div class="channelIntro" @click="changeUrl(`/channel/${channel.id}`)">
                <h4>{{ channel.title }}</h4>
                <section>
                  分享 <i>{{ channel.feed_count}}</i> 订阅 <i>{{ channel.follow_count }}</i>
                </section>
              </div>
              <div class="channelOperation">
                <Button @click="handleUnSubscrible(index)" type="ghost" style="color: #999" icon="ios-checkmark-empty">已订阅</Button>
              </div>
            </li>
          </ul>
          <div v-else class="nothingDefault"> 
            <img :src="nothingMy" />
          </div>
        </section>
      </Tab-pane>
      <Tab-pane label="全部频道" name="allChannel" >
        <section>
          <ul v-if="allChannelIds.length" class="channelCateParent">
            <li v-for="(channel, index) in allChannel" class="channelItem" @click.self="changeUrl(`/channel/${channel.id}`)">
              <div class="channelCover" @click="changeUrl(`/channel/${channel.id}`)">
                <img :src="getImg(channel.cover.id)" alt="" />
              </div>
              <div class="channelIntro" @click="changeUrl(`/channel/${channel.id}`)">
                <h4>{{ channel.title }}</h4>
                <section>
                  分享 <i>{{ channel.feed_count}}</i> 订阅 <i>{{ channel.follow_count }}</i>
                </section>
              </div>
              <div class="channelOperation">
                <Button @click="handleSubscrible(index)" v-if="!channel.follow_status" type="ghost" style="color: #59b6d7" icon="ios-plus-empty">订阅</Button>
                <Button v-else type="ghost" @click="handleUnSubscribleInAll(index)" style="color: #999" icon="ios-checkmark-empty">已订阅</Button>
              </div>
            </li>
          </ul>
          <div v-else class="nothingDefault"> 
            <img :src="nothingMy" />
          </div>
        </section>
      </Tab-pane>
    </Tabs>
  </div>
</template>
<style lang="less">
  .channelIndex {
    position: relative;
    .ivu-tabs-bar {
      margin-bottom: 0;
      background: #fff;
      border-bottom: 1px #e2e3e3 solid;
      position: fixed;
      top: 0;
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
      padding-top: 46px;
      .channelCateParent {
        background-color: #fff;
        .channelItem {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 12px 0;
          border-bottom: 1px solid #e2e3e3;
          &:last-child {
            margin-bottom: 0;
            border-bottom: none;
          }
          .channelCover {
            height: 18vw;
            width: 25vw;
            padding: 0 12px;
            position: relative;
            overflow: hidden;
            padding: 0 12px;
            &:before {
              content: "";
              display: block;
              padding-top: 100%;
            }
            img {
              object-fit: cover;
              width: 100%;
              position: absolute;
              top: 0;
              left: 12px;
              right: 12px;
              bottom: 0;
              height: 100%;
            }
          }
          .channelIntro {
            width: 50vw;
            height: 18vw;
            position: relative;
            section {
              position: absolute;
              bottom: 0;
              i {
                color: #59b6d7;
                font-style: normal;
                margin-right: 12px;
              }
            }
          }
          .channelOperation {
            width: 25vw;
            display: flex;
            justify-content: flex-end;
            padding: 0 12px 0 0;
            .ivu-btn-ghost {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              .ivu-icon-ios-plus-empty:before {
                color: #59b6d7;
                font-size: 24px;
              }
              .ivu-icon-ios-checkmark-empty:before {
                color: #999;
                font-size: 24px;
              }
            }
          }
        }
      }
    }
  }
</style>

<script>
  import { createAPI, addAccessToken, createOldAPI } from '../../utils/request';
  import { changeUrl, goTo } from '../../utils/changeUrl';
  import BackIcon from '../../icons/Back';
  import buildUrl from 'axios/lib/helpers/buildURL';
  import { resolveImage } from '../../utils/resource';
  const nothingImg = resolveImage(require('../../statics/images/defaultNothingx3.png'));

  const channelIndex = {
    data: () => ({
      myChannel: [],
      myChannelIds: [],
      allChannel: [],
      allChannelIds: [],
      currentTab: 'allChannel'
    }),
    computed: {
      nothingMy () {
        return this.myChannelIds.length  ? 0 : nothingImg;
      },
      nothingAll() {
        return this.allChannelIds.length ? 0 : nothingImg;
      }
    },
    methods: {
      goTo,
      changeUrl,
      getImg (id) {
        return buildUrl(createAPI(`files/${id}`), {w: 100, h: 100});
      },
      /**
       * 订阅频道
       * @param  {[type]} index [description]
       * @return {[type]}       [description]
       */
      handleSubscrible (index) {
        let element = this.allChannel[index];
        addAccessToken().post(createOldAPI(`channels/${element.id}/follow`), {},
          {
            validateStatus: status => status === 201
          }
        )
        .then ( response => {
          this.allChannel[index].follow_count += 1;
          this.allChannel[index].follow_status = 1;
          this.myChannelIds.push(element.id);
          this.myChannel.push(element);
        })
      },
      /**
       * 从全部频道中取消订阅
       * @param  {[type]} index [description]
       * @return {[type]}       [description]
       */
      handleUnSubscribleInAll (index) {
        let element = this.allChannel[index];
        addAccessToken().delete(createOldAPI(`channels/${element.id}/follow`), {},
          {
            validateStatus: status => status === 204
          }
        )
        .then ( response => {
          let myIndex = this.myChannelIds.findIndex( item => {
            return item === element.id;
          });
          this.myChannelIds.splice(myIndex, 1);
          let indeX = this.myChannel.findIndex( item => {
            return item.di === element.id;
          });
          this.myChannel.splice(indeX, 1);
          this.allChannel[index].follow_status = 0;
          this.allChannel[index].follow_count -= 1;
        })
      },
      /**
       * 取消订阅
       * @param  {[type]} index [description]
       * @return {[type]}       [description]
       */
      handleUnSubscrible (index) {
        let element = this.myChannel[index];
        addAccessToken().delete(createOldAPI(`channels/${element.id}/follow`), {},
          {
            validateStatus: status => status === 204
          }
        )
        .then ( response => {
          this.myChannel.splice(index, 1);
          let myIndex = this.myChannelIds.findIndex( item => {
            return item === element.id;
          });
          this.myChannelIds.splice(myIndex, 1);
          let indeX = this.allChannel.findIndex( item => {
            return item.id === element.id;
          });
          this.allChannel[indeX].follow_status = 0;
          this.allChannel[indeX].follow_count -= 1;
        })
      }
    },
    created () {
      // 获取全部频道
      addAccessToken().get(createOldAPI('channels'), 
        {}, 
        {
          validateStatus: status => status === 200
        }
      )
      .then( response => {
        let allChannel = response.data.data;
        this.allChannel = [ ...allChannel ];
        if(allChannel.length) {
          allChannel.forEach( channel => {
            this.allChannelIds.push(channel.id);
          });
        }
      });

      // 获取我关注的频道
      addAccessToken().get(createOldAPI('channels/my'),
        {},
        {
          validateStatus: status => status === 200
        }
      )
      .then( response => {
        let myChannel = response.data.data;
        this.myChannel = [ ...myChannel ];
        if(myChannel.length) {
          myChannel.forEach( channel => {
            this.myChannelIds.push(channel.id);
          });
        }
      });
    },
    components: {
      BackIcon
    }
  };

  export default channelIndex;
</script>
