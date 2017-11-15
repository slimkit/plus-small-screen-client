<template>
  <div class="comments">
    <div class="commonHeader">
      <Row :gutter="24">
        <Col span="5">
          <BackIcon @click.native="goTo(-1)" height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          赞过的
        </Col>
      </Row>
    </div>
    <div v-if="nothing" class="nothingDefault"> 
      <img :src="nothing" />
    </div>
    <div class="loadMoreContainer">
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
                <user-avatar  @click.native="changeUrl(`/users/feeds/${digg.user_id}`)" :src="digg.avatar" :sex="digg.sex" size="small" />
              </Col>
              <Col span="13">
                <h4 @click="changeUrl(`/users/feeds/${digg.user_id}`)">{{digg.name}}</h4>
                <timeago style="font-size: 14px; color: #999;" :since="digg.time" locale="zh-CN" :auto-update="60"></timeago>
              </Col>
              <Col span="2">
                <DiggIcon height="21" width="21" color="#f4504d" />
              </Col>
              <Col span="5">
                <div :class="$style.sourceContent" @click="goToSource(digg.likeable_id, digg.likeable_type)">
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
  import buildURL from 'axios/lib/helpers/buildURL';
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
      bottomAllLoaded: true,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      isWeiXin: TS_WEB.isWeiXin,
      formated: [],
      limit: 20
    }),
    methods: {
      changeUrl,
      goTo,
      goToSource(id, type) {
        let url = '';
        switch(type) {
          case 'news':
            url = `/news/${id}/detail`;
            break;
          case 'groups':
            url = '';
            break;
          case 'question-answers':
            url = `/questions/answers/${id}`;
            break;
          case 'feeds':
            url = `/feed/${id}`;
            break;  
        }

        this.$router.push(url);
      },
      loadTop () {
        const { limit } = this;
        addAccessToken().get(createAPI(`user/likes`),
        {
          params: {
            limit
          }
        },
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
          let uids = data.map( digg => {
            return digg.user_id;
          });

          this.$store.dispatch('GET_USER_BY_ID', lodash.uniq(uids));

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
        const { max_id, bottomAllLoaded, limit } = this;
        if (bottomAllLoaded) {
          this.$refs.loadmoreDiggs.onBottomLoaded();

          return;
        }

        addAccessToken().get(createAPI(`user/likes`),
          {
            params: {
              limit,
              max_id
            }
          },
          {
            validateStatus: status => status === 200
          }
        )
        .then(({data = []}) => {
          const { length } = data;
          if(data) {
            let uids = data.map( digg => {
              return digg.user_id;
            });

            this.$store.dispatch('GET_USER_BY_ID', lodash.uniq(uids, true));

            this.diggs = [ ...this.diggs, ...data ];
            this._loadFormateDiggs(data, false);
            this.bottomAllLoaded = (length === limit) ? false : true;
            if(this.$refs.loadmoreDiggs)
              this.$refs.loadmoreDiggs.onBottomLoaded();
            this.max_id = diggs[diggs.length - 1].id;
          }
        })
      },
      _loadFormateDiggs( diggs, top = true) {
        // if(!top) {
        //   this.formated = lodash.uniqBy([ ...this.formated, ...diggs ], 'id');
        // } else {
        //   this.formated = lodash.uniqBy([ ...diggs, ...this.formated ], 'id');
        // }
        diggs.forEach(digg => {
          if (!digg.likeable) return;
          if (lodash.findIndex(this.ids, digg.id) !== -1) return ;
          let 
            user = this.$store.getters.getUserById(digg.user_id)[0] || {}, dig = {};
            const { likeable: { images = [], feed_content = '', body = '', content = '' } = {} } = digg;
            const { avatar, name, sex } = user;

            if (digg.likeable_type === 'question-answers') {
              let img = this.getFile(body);
              if (img) {
                dig.cover = img;
              } else {
                dig.source_content = body;
              }
            } else {
              if(images.length > 0) {
                dig.cover = buildURL(createAPI(`files/${images[0].id}`), {w: 100, h: 100});
              }else if(feed_content){
                dig.source_content = feed_content;
              }
            }
            dig.likeable_type = digg.likeable_type;
            dig.likeable_id = digg.likeable_id;
            dig.name = name;
            dig.avatar = avatar;
            dig.sex = sex;
            dig.time = timers(digg.created_at, 8, false)
            this.formated = [ dig, ...this.formated ];
        });
      },
      getFile (str) {
        if(!str) return 0;
        let file = str.match(/@!\[.*?]\((\d+)\)/);
        return file ? buildURL(createAPI(`files/${file[1]}`), {w: 100, h: 100}) : 0;
      },
      _initFormatedDiggs () {
        this.diggs.forEach(digg => {
          let
            user = this.$store.getters.getUserById(digg.user_id)[0] || {}, dig = {};
            const { likeable: { images = [], feed_content = '', body = '', content = '' } = {} } = digg;
            const { avatar, name, sex } = user;

            if (digg.likeable_type === 'question-answers') {
              let img = this.getFile(body);
              if (img) {
                dig.cover = img;
              } else {
                dig.source_content = body;
              }
            } else {
              if(images.length > 0) {
                dig.cover = buildURL(createAPI(`files/${images[0].id}`), {w: 100, h: 100});
              }else if(feed_content){
                dig.source_content = feed_content;
              }
            }
            dig.likeable_type = digg.likeable_type;
            dig.likeable_id = digg.likeable_id;
            dig.name = name;
            dig.avatar = avatar;
            dig.sex = sex;
            dig.time = timers(digg.created_at, 8, false)
            this.formated = [ ...this.formated, dig ];
        });
      }
    },
    computed: {
      nothing () {
        return this.diggs.length > 0 ? 0 : defaultNobody;
      }
    },
    created () {
      const { limit } = this;
      this.$store.dispatch(CLEANMESSAGE, cb => {
        cb('diggs');
      });
      addAccessToken().get(createAPI(`user/likes`),
      {
        params: {
          limit
        }
      },
        {
          validateStatus: status => status === 200
        }
      )
      .then(({data = []}) => {
        this.diggs = data;
        let uids = data.map( digg => {
          return digg.user_id;
        });

        this.$store.dispatch('GET_USER_BY_ID', lodash.uniq(uids, true));
        const { length } = data;
        this.bottomAllLoaded = (length === limit) ? false : true;
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
      })
    }
  };
  export default Diggs;
</script>
<style lang="less" module>
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
<style scoped lang="less">
  .comments {
    height: 100%;
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