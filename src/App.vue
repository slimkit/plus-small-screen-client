<template>
  <div class="container-fluid" id="app">
    <div v-wechat-title="$route.meta.title"></div>
    <router-view></router-view>
    <NoticeText/>
    <IviewSwiper/>
    <PostFeed/>
    <CommentInput/>
    <Confirm />
    {{ imStatus }}
  </div>
</template>
<script>
  import NoticeText from './components/Notice';
  import IviewSwiper from './components/IviewSwiper';
  import PostFeed from './components/PostFeed';
  import FeedDiggList from './components/FeedDiggList';
  import CommentInput from './components/CommentInput';
  import Confirm from './components/Confirm';

  // im聊天相关
  import localEvent from './stores/localStorage';
  import lodash from 'lodash';
  import { createAPI, addAccessToken } from './utils/request';
  import errorCodes from './stores/errorCodes';
  import { connect } from './utils/webSocket';
  import { getUserInfo } from './utils/user';
  import { MESSAGELISTS, IMSTATUS, USERS_APPEND, MESSAGENOTICE } from './stores/types';

  const App = {
    components: {
      NoticeText,
      IviewSwiper,
      PostFeed,
      FeedDiggList,
      CommentInput,
      Confirm
    },
    computed: {
      imStatus () { // im状态监测
        let imstatus = this.$store.getters[IMSTATUS];
        let userLoginInfo = localEvent.getLocalItem('UserLoginInfo');
        if(lodash.keys(userLoginInfo).length && !imstatus.open && TS_WEB.webSocket !== null && TS_WEB.webSocket.readyState != 1 && TS_WEB.readyState != 0) {
          connect();
        }
        return '';
      }
    },
    created() {
      if(TS_WEB.loaded) return;
      let currentUser = localEvent.getLocalItem('UserLoginInfo');

      if(lodash.keys(currentUser).length > 0) {
        // 提交用户到vuex
        let userInfo = localEvent.getLocalItem(`user_${currentUser.user_id}`);
        if(!lodash.keys(userInfo).length > 0) {
          getUserInfo(currentUser.user_id, 30).then(user => {
            localEvent.setLocalItem(`user_${data.user_id}`, user);
            this.$store.dispatch(USERS_APPEND, cb =>{
              cb(user)
            });
          });
        } else {
          this.$store.dispatch(USERS_APPEND, cb =>{
            cb(userInfo)
          });
        }
        // 设置消息提示查询时间
        let time = 0;
        time = localEvent.getLocalItem('messageFlushTime');
        let nowtime = parseInt(new window.Date().getTime() / 1000);
        if(!time) {
          time = nowtime - 86400;
        }
        let types = 'diggs,comments,follows,notices';
        // 查询新消息
        addAccessToken().get(createAPI(`users/flushmessages?key=${types}&time=${time+1}`), {} , {
            validateStatus: status => status === 200
          })
        .then( response => {
          let count = {
            fans: 0,
            diggs: 0,
            comments: 0,
            notice: 0
          }
          let data = response.data.data;
          for( let index in data ) {
            if(data[index].key == "follows") {
              count.fans = data[index].count;
            } else if( data[index].key == 'comments') {
              count.comments = data[index].count;
            } else if( data[index].key == 'diggs') {
              count.diggs = data[index].count;
            } else {
              count.notices = data[index].count;
            }
          }
          this.$store.dispatch(MESSAGENOTICE, cb => {
            cb(count)
          })
        });
        // im设置
        connect();
        // 获取会话列表
        addAccessToken().get(createAPI('im/conversations/list/all'), {}, {
          validateStatus: status => status === 200
        })
        .then( response => {
          let data = response.data;
          let lists = {};
          if(data.status || data.code === 0 ) {
            if(!data.data.length) return;
            data.data.forEach( list => {
              lists[`room_${list.cid}`] = {};
              let li = {};
              let uids = list.uids.split(',');
              let user_id = 0;
              if(uids[0] == currentUser.user_id) {
                user_id = uids[1];
              } else {
                user_id = uids[0];
              }
              let lastMessage = localEvent.getLocalItem(`room_${list.cid}_last_message`);
              let messageList = [];
              let messageBody = {};;
              if(lastMessage.length) {
                messageBody.user_id = lastMessage[1].uid;
                messageBody.txt = lastMessage[1].txt;
                messageBody.time = lastMessage[1].ext.time;
                messageList.push(messageBody);
              }
              getUserInfo(user_id, 30).then( user => {
                li.name = user.name;
                li.avatar = user.avatar[30];
                li.lists = messageList;
                li.cid = list.cid;
                li.user_id = user_id;
                this.$store.dispatch(MESSAGELISTS, cb => {
                  cb(li);
                });
              });
            });
          }
          TS_WEB.loaded = true;
        });
      }
    }
  }

  export default App;
</script>
<style lang="less">
  @import './styles/common.less';
</style>
<style lang="css">
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
