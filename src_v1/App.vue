<template>
  <div class="container-fluid" id="app">
    <div v-wechat-title="$route.meta.title"></div>

    <div class="app-views">
      <router-view></router-view>
    </div>

    <FeedMoreAction />
    <PinnedPop />

    <NoticeText/>
    <IviewSwiper/>
    <PrePost :config="prePostConfig" />
    <PostFeed/>
    <Confirm />
    <postQuestion />
    <PostAnswer />
    <CheckinLayer/>
    {{ imStatus }}
    {{ setBodyOverflew }}
  </div>
</template>
<script>
  import NoticeText from './components/Notice';
  import IviewSwiper from './components/IviewSwiper';
  import PrePost from './components/PrePost';
  import PostFeed from './components/PostFeed';
  import CommentInput from './components/CommentInput';
  import FeedDiggList from './components/FeedDiggList';
  import Confirm from './components/Confirm';
  import postQuestion from './components/postQuestion';
  import PostAnswer from './components/PostAnswer';
  import CheckinLayer from './components/CheckinLayer';

  import FeedMoreAction from './components/FeedMoreAction';
  import PinnedPop from './components/PinnedPop';

  // im聊天相关
  import lodash from 'lodash';
  import { createAPI, addAccessToken, createOldAPI } from './utils/request';
  import errorCodes from './stores/errorCodes';
  import { connect } from './utils/webSocket';
  import { getUserInfo, getLoggedUserInfo } from './utils/user';
  import { IMSTATUS, USERS_APPEND, MESSAGENOTICE, MESSAGEROOMS } from './stores/types';
  import { mapState } from 'vuex';

  // indexedDB
  import Dexie from 'dexie';

  const App = {
    components: {
      NoticeText,
      IviewSwiper,
      PostFeed,
      FeedDiggList,
      CommentInput,
      Confirm,
      PrePost,
      postQuestion,
      PostAnswer,
      FeedMoreAction,
      PinnedPop,
      CheckinLayer
    },
    data: () => ({
      prePostConfig: {
        // 签到应用状态
        checkin: {
          status: false,
          amount: 0,
        }
      },
    }),
    computed: {
      imStatus () { // im状态监测
        if(! TS_WEB.socketUrl.serve) return;

        let imstatus = this.$store.getters[IMSTATUS];
        let userLoginInfo = this.$storeLocal.get('UserLoginInfo') || {};

        if(lodash.keys(userLoginInfo).length && !imstatus.open && TS_WEB.webSocket !== null && TS_WEB.webSocket.readyState != 1 && TS_WEB.readyState != 0) {
          connect();
        }
        
        return '';
      },
      ...mapState({
        showPost: state => state.showPost.showPost.show,
        prePost: state => state.prePost.prePost.show,
        imageSwiper: state => state.imageSwiper.imageSwiper.show
      }),

      setBodyOverflew () {
        if (!this.showPost && !this.prePost && !this.imageSwiper) {
          window.document.body.style.overflow = 'auto';
        } else {
          window.document.body.style.overflow = 'hidden';
        }
        return '';
      }
    },
    created() {
      addAccessToken().get(
        createAPI('bootstrappers'),
        {
          validateStatus: status => status === 200
        }
      )
      .then( ({ data }) => {
        const {site: { gold_name: { name = '金币' }, reward: { status = true, amounts = '' } = {} } = {}, feed = {} } = data;

        this.$storeLocal.set('feedReward', feed.reward);
        this.$storeLocal.set('feedPayControl', feed.paycontrol);
        this.$storeLocal.set('feedPayItems', feed.items);
        this.$storeLocal.set('feedLimit', feed.limit);
        this.$storeLocal.set('rewardSetting', { status: status, items: lodash.split(amounts, ',') });
        this.$storeLocal.set('onlookers_amount', data['question:onlookers_amount']);
        this.$storeLocal.set('apply_amount', data['question:apply_amount']);
        this.$storeLocal.set('ratio', data['wallet:ratio']);
        this.prePostConfig.checkin = { status: data.checkin, amount: data['checkin:attach_balance'] };
      })
      // 创建 DB;
      let db = new Dexie('ThinkSNS');
      db.debug = 'dexie';
      db
      .version(4)
      .stores({
        // 用户
        // userbase: "++,user_id,avatar,bg,bio,email,extra,location,name,phone,sex,verified, wallat",

        // 动态
        // feedbase: "++, user_id, storages, &feed_id, feed_content, feed_from, created_at, feed_comment_count, feed_digg_count, feed_view_count",

        // 评论
        // commentsbase: "++, body, created_at, &id, reply_to_user_id, user_id, source_id",

        // ImMessage
        messagebase: "++, txt, cid, uid, hash, mid, seq, time, owner, [cid+mid], [cid+owner]",

        // chatroom
        chatroom: "++, cid, user_id, name, pwd, type, uids, last_message_time, owner, [cid+owner], newMessage",

        // 对我的评论[消息]
        commentslist: "++, user_id, uid, [user_id+uid]",

        // 对我的点赞[消息]
        diggslist: "++, user_id, uid, [user_id+uid]"
      });

      // 保存
      window.TS_WEB.dataBase = db;
      
      let currentUser = this.$storeLocal.get('UserLoginInfo');

      if(lodash.keys(currentUser).length > 0) {
        window.TS_WEB.currentUserId = currentUser.user_id;
        // 获取当前登录用户信息
        getLoggedUserInfo();

        // 设置消息提示查询时间
        let time = 0;
        time = this.$storeLocal.get('messageFlushTime');
        let nowtime = parseInt(new window.Date().getTime() / 1000);
        if(!time) {
          time = nowtime - 86400;
        }
        let types = 'diggs,comments,follows';
        // 查询新消息
        addAccessToken().get(createOldAPI(`users/flushmessages?key=${types}&time=${time+1}`), {} , {
          validateStatus: status => status === 200
        })
        .then( response => {
          let count = {
            fans: 0,
            diggs: {
              count: 0,
              uids: []
            },
            comments: {
              count: 0,
              uids: []
            },
            notice: 0
          }
          let data = response.data.data || {};
          for( let index in data ) {
            if(data[index].key == "follows") {
              count.fans = data[index].count;
            } else if( data[index].key == 'comments') {
              count.comments.count = data[index].count;
              count.comments.uids = data[index].uids;
              count.comments.time = data[index].time;
            } else if( data[index].key == 'diggs') {
              count.diggs.count = data[index].count;
              count.diggs.uids = data[index].uids;
              count.diggs.time = data[index].time;
            } 
          }
          window.TS_WEB.dataBase.transaction('rw?',
            window.TS_WEB.dataBase.commentslist,
            window.TS_WEB.dataBase.diggslist,
            () => {
              // 点赞用户本地存储
              if(count.diggs.count) {
                Array.from(new Set(count.diggs.uids)).forEach( uid => {
                  window.TS_WEB.dataBase.diggslist.where('[user_id+uid]').equals([window.TS_WEB.currentUserId, uid]).delete().then( () => {
                    window.TS_WEB.dataBase.diggslist.put({
                      user_id: window.TS_WEB.currentUserId,
                      uid: uid
                    })
                  })
                  .catch( e => {
                    console.log(e)
                  });
                })
              }
              // 评论用户本地存储
              if(count.comments.count) {
                Array.from(new Set(count.comments.uids)).forEach( uid => {
                  window.TS_WEB.dataBase.commentslist.where('[user_id+uid]').equals([window.TS_WEB.currentUserId, uid]).delete().then( () => {
                    window.TS_WEB.dataBase.commentslist.put({
                      user_id: window.TS_WEB.currentUserId,
                      uid: uid
                    })
                  })
                  .catch( e => {
                    console.log(e)
                  });
                })
              }
            })
          this.$store.dispatch(MESSAGENOTICE, cb => {
            cb(count)
          });
        });

        // 如果配置了im服务器
        if(TS_WEB.socketUrl) {
          // 获取会话列表
          addAccessToken().get(createAPI('im/conversations/list/all'), {}, {
            validateStatus: status => status === 200
          })
          .then( response => {
            let data = response.data;
            let lists = [];
            if(data.status || data.code === 0 ) {
              if(!data.data.length) return;
              window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.chatroom, () => {
                data.data.forEach( list => {
                  window.TS_WEB.dataBase.chatroom.where('[cid+owner]').equals([list.cid, window.TS_WEB.currentUserId ]).count( number => {
                    if(!number > 0) {
                      list.last_message_time = 0;
                      list.owner = window.TS_WEB.currentUserId;
                      // 将对话列表写入到本地数据库
                      window.TS_WEB.dataBase.chatroom.put(list);
                      // 组装vuex所需要的数据
                      let room = {
                        cid: list.cid, // 聊天id
                        user_id: 0, // 聊天对象id
                        name: '', // 聊天对象昵称
                        avatar: '', // 聊天对象头像
                        lists: [], // 聊天内容， 默认为空
                        count: 0 // 新消息统计， 默认为空
                      };
                      let uids = list.uids.split(',');
                      let user_id = 0;
                      if(uids[0] == window.TS_WEB.currentUserId) {
                        user_id = uids[1];
                      } else {
                        user_id = uids[0];
                      }
                      room.user_id = user_id;

                      let user = this.$storeLocal.get(`user_${user_id}`);
                      if(user === undefined) {
                        getUserInfo(user_id).then( user => {
                          room.name = user.name;
                          room.avatar = user.avatar;
                          this.$store.dispatch(MESSAGEROOMS, cb => {
                            cb(room);
                          })
                        })
                      } else {
                        room.name = user.name;
                        room.avatar = user.avatar;
                        this.$store.dispatch(MESSAGEROOMS, cb => {
                          cb(room);
                        })
                      }
                    }
                  });
                })
              })
              .catch(e => {
                console.log(e);
              })
            }
          });
          connect();
        }
      }
    }
  }

  export default App;
</script>
<style lang="less">
  @import './styles/font.css';
  @import '~animate.css/animate.min.css';
  .animated {
    -webkit-animation-duration: .3s;
    animation-duration: .3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  .animated.hinge {
    -webkit-animation-duration: .3s;
    animation-duration: .3s;
  }
</style>
