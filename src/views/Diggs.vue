<template>
  <div class="comments">
    <div class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="5">
          <BackIcon @click.native="goTo(-1)" height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          赞
        </Col>
      </Row>
    </div>
    <div v-if="nothing" class="nothingDefault"> 
      <img :src="nothing" />
    </div>
    <mt-loadmore
      v-if="!nothing"
      :bottom-method="loadBottom"
      :top-method="loadTop"
      :bottom-all-loaded="bottomAllLoaded"
      :top-all-loaded="topAllLoaded"
      @bottom-status-change="bottomStatusChange"
      ref="loadmoreDiggs"
      :bottomDistance="70"
    >
      <div class="commentContent">
        <div :class="$style.comments">
          <Row :gutter="16" v-for="(digg, index) in formated" :key="index" :class="$style.comment">
            <Col span="4" class="avatar-parent-col">
              <img @click="changeUrl(`/users/feeds/${digg.user_id}`)" class="avatar" :src="digg.avatar" :alt="digg.name" />
            </Col>
            <Col span="13">
              <h4 @click="changeUrl(`/users/feeds/${digg.user_id}`)">{{digg.name}}</h4>
              <timeago style="font-size: 14px; color: #999;" :since="digg.time" locale="zh-CN" :auto-update="60"></timeago>
            </Col>
            <Col span="2">
              <DiggIcon height="21" width="21" color="#f4504d" />
            </Col>
            <Col span="5">
              <div :class="$style.sourceContent" @click="changeUrl(`/feed/${digg.likeable_id}`)">
                <img v-show="digg.cover" :src="digg.cover" />
                <div v-show="!digg.cover" :class="$style.source">
                  <div :class="$style.content">
                    {{digg.source_content}}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
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
  import { NOTICE, CLEANMESSAGE } from '../stores/types';
  import { createAPI, addAccessToken, createOldAPI } from '../utils/request';
  import { changeUrl, goTo } from '../utils/changeUrl';
  import timers from '../utils/timer';
  import BackIcon from '../icons/Back';
  import DiggIcon from '../icons/Digg';
  import { resolveImage } from '../utils/resource';
  import buildUrl from 'axios/lib/helpers/buildURL';
  import lodash from 'lodash';

  const defaultNobody = resolveImage(require('../statics/images/img_default_nobody@2x.png'));
  const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));

  const Diggs = {
    components: {
      BackIcon,
      DiggIcon
    },
    data: () => ({
      max_id: 0,
      diggs: [],
      ids: [],
      bottomAllLoaded: false,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      isWeiXin: TS_WEB.isWeiXin,
      formated: []
    }),
    methods: {
      changeUrl,
      goTo,
      loadTop () {
        addAccessToken().get(createAPI(`user/likes?limit=15`),{},
          {
            validateStatus: status => status === 200
          }
        )
        .then(({ data = []}) => {
          let diggs = data;
          if(diggs.length) {
            this.max_id = diggs[0].id;
          }
          let newdiggs = [];
          diggs.forEach( digg => {
            if( this.ids.findIndex(function(value, index, arr) {
              return value == digg.id;
            }) == -1) {
              newdiggs.push(digg);
            }
          });
          this.diggs = [ ...newdiggs, ...this.diggs ];
          this._loadFormateDiggs(newdiggs);
          setTimeout( () => {
            if(this.$refs.loadmoreDiggs)
              this.$refs.loadmoreDiggs.onTopLoaded();
          }, 500)
        })
      },
      bottomStatusChange(status) {
        this.bottomStatus = status;
      },
      loadBottom () {
        if(!this.max_id) return ;
        addAccessToken().get(createAPI(`user/likes?limit=15&after=${this.max_id}`),{},
          {
            validateStatus: status => status === 200
          }
        )
        .then(({data = []}) => {
          let diggs = data;
          if(diggs.length) {
            this.diggs = [ ...this.diggs, diggs ];
            this._loadFormateDiggs(diggs, false);
            if(diggs.length < 15) {
              this.bottomAllLoaded = true;
            };
            setTimeout( () => {
              if(this.$refs.loadmoreDiggs)
                this.$refs.loadmoreDiggs.onBottomLoaded();
            }, 500);
            this.max_id = diggs[diggs.length - 1].id;
          }
        })
      },
      _loadFormateDiggs( diggs, top = true) {
        diggs.forEach(digg => {
          if(lodash.findIndex(this.formated, { id: digg.id }) !== -1) return;
          let 
            digg_source = {...digg.likeable},
            user = this.$storeLocal.get(`user_${digg.user_id}`);
          const { avatar = defaultAvatar, name = '' } = user;
          if(digg_source.images.length > 0) {
            digg.cover = buildUrl(createAPI(`files/${digg_source.images[0].id}`), {w: 100, h: 100});
          }else if(digg_source.feed_content){
            digg.source_content = digg_source.feed_content;
          }
          digg.name = name;
          digg.avatar = avatar;
          digg.time = timers(digg.created_at, 8, false);
          if(!top) {
            this.formated = [ ...this.formated, digg ];
          } else {
            this.formated = [ digg, ...this.formated ];
          }
        });
      },
      _initFormatedDiggs () {
        this.diggs.forEach(digg => {
          let
            digg_source = {...digg.likeable},
            user = this.$storeLocal.get(`user_${digg.user_id}`);
            const { avatar = defaultAvatar, name = '' } = user;
            
            if(digg_source.images.length > 0) {
              digg.cover = buildUrl(createAPI(`files/${digg_source.images[0].id}`), {w: 100, h: 100});
            }else if(digg_source.feed_content){
              digg.source_content = digg_source.feed_content;
            }
            digg.name = name;
            digg.avatar = avatar;
            digg.time = timers(digg.created_at, 8, false)
            this.formated = [ ...this.formated, digg ];
        });
      }
    },
    computed: {
      nothing () {
        return this.diggs.length > 0 ? 0 : defaultNobody;
      }
    },
    created () {
      this.$store.dispatch(CLEANMESSAGE, cb => {
        cb('diggs');
      });
      addAccessToken().get(createAPI(`user/likes?limit=15&after=${this.max_id}`),{},
        {
          validateStatus: status => status === 200
        }
      )
      .then(({data = []}) => {
        this.diggs = data;
        let length = this.diggs.length;
        if( length ) {
          this.max_id = this.diggs[length - 1].id;
        }
        // 点赞记录写入本地数据
        window.TS_WEB.dataBase.transaction('rw?',
          window.TS_WEB.dataBase.diggslist,
          () => {
            this.diggs.forEach( digg => {
              this.ids.push(digg.id);
              window.TS_WEB.dataBase.diggslist.where('[user_id+uid]').equals([window.TS_WEB.currentUserId, digg.user_id]).delete().then( () => {
                window.TS_WEB.dataBase.diggslist.put({
                  user_id: window.TS_WEB.currentUserId,
                  uid: digg.user_id
                })
              })
              .catch( e => {
                console.log(e)
              });
            });
          }
        );
        this._initFormatedDiggs();
        if(length < 15) {
          this.bottomAllLoaded = true;
          setTimeout( () => {
            if(this.$refs.loadmoreDiggs) {
              this.$refs.loadmoreDiggs.onBottomLoaded();
            }
          })
        }
      })
    }
  };
  export default Diggs;
</script>
<style lang="scss" module>
  .comments {
    .comment {
      border-bottom: 1px #ededed solid;
      padding: 8px 0;
      background-color: #fff;
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .sourceContent {
    background-color: #ededed;
    padding: 2px;
    position: relative;
    height: 100%;
    &:before {
      content: '';
      display: block;
      padding-top: 100%;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      object-fit: cover;
      right: 0;
      bottom: 0;
      height: 100%;
    }
    .source {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      font-size: 10px;
      color: #999;
      .content {
        padding: 4px;
        text-align: justify;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        word-break: break-all;
        display: -webkit-box;
      }
    }
  }
</style>
<style scoped lang="scss">
  .comments {
    .commonHeader {
      position: relative;
      z-index: 2;
    }
  }
  .row-container {
    align-items: center;
  }
  .mint-loadmore {
    padding-bottom: 50px;
    overflow: initial;
  }
</style>