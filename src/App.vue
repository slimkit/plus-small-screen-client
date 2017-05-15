<template>
  <div class="container-fluid" id="app">
    <div v-wechat-title="$route.meta.title"></div>
    <router-view></router-view>
    <NoticeText/>
    <IviewSwiper/>
    <PostFeed/>
    <FeedDiggList/>
    <CommentInput/>
    <Confirm />
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
  import { MESSAGELISTS } from './stores/types';

  const App = {
    components: {
      NoticeText,
      IviewSwiper,
      PostFeed,
      FeedDiggList,
      CommentInput,
      Confirm
    },
    created () {
      // let currentUser = localEvent.getLocalItem('UserLoginInfo');
      // if(lodash.keys(currentUser).length > 0) {
      //   addAccessToken().get(createAPI('im/users'), {} , {
      //     validateStatus: status => status === 200
      //   })
      //   .then( response => {
      //     let data= response.data;
      //     if(data.status || data.code === 0) {
      //       window.TS_WEB.im_token = data.data.im_password; // 保存im口令
      //       if(window.TS_WEB.socketUrl) {
      //         connect(`ws://${window.TS_WEB.socketUrl}?token=${data.data.im_password}`); // 如果后台设置了socket地址 链接websocket
      //       }
      //     }
      //   });
      // }
    },
    beforeMount() {
      if(TS_WEB.loaded) return;
      let currentUser = localEvent.getLocalItem('UserLoginInfo');
      if(lodash.keys(currentUser).length > 0) {
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
              getUserInfo(user_id, 30).then( user => {
                li.name = user.name;
                li.avatar = user.avatar[30];
                li.lists = [];
                li.cid = list.cid;
                li.user_id = user_id;
              });
              lists = { ...lists, [`room_${list.cid}`]: li };
            });
          }
          this.$store.dispatch(MESSAGELISTS, cb => {
            cb(lists);
          });
          TS_WEB.loaded = true;
        });
      }
    },
    updated () {
      let currentUser = localEvent.getLocalItem('UserLoginInfo');
      if(lodash.keys(currentUser).length > 0) {
        if(lodash.keys(TS_WEB.webSocket).length && TS_WEB.webSocket.readyState != 1) {
          connect(TS_WEB.webSocket.url);
        } else if(TS_WEB.webSocket == null) {
          addAccessToken().get(createAPI('im/users'), {} , {
            validateStatus: status => status === 200
          })
          .then( response => {
            let data= response.data;
            if(data.status || data.code === 0) {
              window.TS_WEB.im_token = data.data.im_password; // 保存im口令
              if(window.TS_WEB.socketUrl) {
                connect(`ws://${window.TS_WEB.socketUrl}?token=${data.data.im_password}`); // 如果后台设置了socket地址 链接websocket
              }
            }
          });
        } else {
          if(TS_WEB.loaded) return;
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
                getUserInfo(user_id, 30).then( user => {
                  li.name = user.name;
                  li.avatar = user.avatar[30];
                  li.lists = [];
                  li.cid = list.cid;
                  li.user_id = user_id;
                });
                lists = { ...lists, [`room_${list.cid}`]: li };
              });
            }
            this.$store.dispatch(MESSAGELISTS, cb => {
              cb(lists);
            });
            TS_WEB.loaded = true;
          });
        }
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
