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

  const wsUrl = 'ws://192.168.2.150:9900';
  window.TS_WEB.socketUrl = wsUrl;
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
      let currentUser = localEvent.getLocalItem('UserLoginInfo');
      if(lodash.keys(currentUser).length > 0) {
        addAccessToken().get(createAPI('im/users'), {} , {
          validateStatus: status => status === 200
        })
        .then( response => {
          let data= response.data;
          if(data.status || data.code === 0) {
            // window.TS_WEB.im_token = data.data.im_password;
            // let webSocket = new window.WebSocket(`${wsUrl}?token=${data.data.im_password}`);
            // webSocket.onopen = (evt) => {
            //   webSocket.send('2["convr.get"]');
            // };
            // webSocket.onmessage = (evt) => {
            //   let data = evt.data;
            //   console.log(data);
            // }
            connect(`${window.TS_WEB.socketUrl}?token=${data.data.im_password}`);
          }
        })
      }
    },
    updated () {
      console.log('ccc');
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
