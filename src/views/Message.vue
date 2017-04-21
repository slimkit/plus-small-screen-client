<template>
  <div class="messageList">
    <div class="commonHeader">
      <Row :gutter="16">
        <Col span="16" offset="4" class="title-col">
          消息
        </Col>
        <Col span="4">
          
        </Col>
      </Row>
    </div>
    <div :class="$style.entryLists">
      <Row :gutter="16" :class="$style.entry">
        <div :class="$style.entryContainer" @click="changeUrl('/users/diggs')">
          <Col span="4" :class="$style.entryIcon">
            <div :class="$style.diggIcon">
              <DiggIcon height="30" width="30" color="#fff" />
            </div>
          </Col>
          <Col span="15">
            <h4 style="font-weight: 400;">赞过的</h4>
            <div v-if="diggsCount" style="color: #999;">{{ diggLists }} <span v-show="diggsCount > 3">等人</span>赞了我</div>
            <div v-if="!diggsCount" style="color: #999">还没有人赞我</div>
          </Col>
          <Col span="5" v-if="diggsCount" :class="$style.time">
            <timeago style="font-size: 14px; color: #999;" :since="diggTime" locale="zh-CN" :auto-update="60"></timeago>
            <span>{{diggsCount}}</span>
          </Col>
        </div>
      </Row>
      <Row :gutter="16" :class="$style.entry" >
        <div :class="$style.entryContainer" @click="changeUrl('/users/mycomments')">
          <Col span="4" :class="$style.entryIcon">
            <div :class="$style.commentIcon">
              <CommentIcon height="30" width="30" color="#fff" />
            </div>
          </Col>
          <Col span="15">
            <h4 style="font-weight: 400;">评论的</h4>
            <div v-if="commentCount" style="color: #999;">{{ commentLists }} <span v-show="commentCount > 3">等人</span>评论了我</div>
            <div v-if="!commentCount" style="color: #999">还没有人评论我</div>
          </Col>
          <Col span="5" v-if="commentCount" :class="$style.time">
            <timeago style="font-size: 14px; color: #999;" :since="commentTime" locale="zh-CN" :auto-update="60"></timeago>
            <span>{{commentCount}}</span>
          </Col>
        </div>
      </Row>
    </div>
    <ToolBar/>
  </div>
</template>
<script>
  import { NOTICE } from '../stores/types';
  import { createAPI, addAccessToken } from '../utils/request';
  import ToolBar from '../components/ToolBar';
  import localEvent from '../stores/localStorage';
  import { getUserInfo } from '../utils/user';
  import DiggIcon from '../icons/Digg';
  import CommentIcon from '../icons/Comment';
  import timers from '../utils/timer';
  import { changeUrl } from '../utils/changeUrl';

  const currentUser = localEvent.getLocalItem('UserLoginInfo');
  const MessageList = {
    components: {
      ToolBar,
      DiggIcon,
      CommentIcon
    },
    data: () => ({
      messages: {},
      currentUser: currentUser.user_id
    }),
    computed: {
      diggsCount () {
        const { diggs: { count = 0 } = {} } = this.messages;
        return count;
      },
      diggTime () {
        return this.messages.diggs.time;
      },
      diggLists () {
        const { diggs: { uids = [] } = {} } = this.messages;
        let users = '';
        let count = 0;
        uids.forEach( (digg, index) => {
          if(count == 3) return;
          let userLocalInfo = localEvent.getLocalItem(`user_${digg}`);
          const { name = ''} = userLocalInfo;
          users += name + '、';
          if(!Object.keys(userLocalInfo).lenght) {
            getUserInfo(digg, user => {
              const { name = '' } = user;
              users += name + '、';
            });
          }
          count ++;
        });
        users = users.substr(0, users.length - 1);
        return users;
      },
      commentTime() {
        const { comments: { time = new window.Date().getTime() } = {} } = this.messages;
        return time;
      },
      commentCount() {
        const { comments: { count = 0 } = {} } = this.messages;
        return count;
      },
      commentLists () {
        const { comments: { uids = [] } = {} } = this.messages;
        let users = '';
        let count = 0;
        uids.forEach((comment, index) => {
          if(count == 3) return;
          let userLocalInfo = localEvent.getLocalItem(`user_${comment}`);
          const { name = '' } = userLocalInfo;
          users += name + '、';
          if(!Object.keys(userLocalInfo).length) {
            getUserInfo(comment, user => {
              const { name = '' } = user;
              users += name + '、';
            });
          }
          count ++;
        })
        users = users.substr(0, users.length - 1);
        return users;
      }
    },
    methods: {
      timers,
      changeUrl,
      removeByValue (arr, val) {
        let newArr = [];
        for(var i=0; i<arr.length; i++) {
          if(arr[i] !== parseInt(val)) {
            newArr.push(arr[i]);
          }
        }
        return newArr;
      }
    },
    created () {
      let types = 'diggs,comments';
      // let time = parseInt(new window.Date().getTime() / 1000) - 43200;
      let messages = {};
      addAccessToken().get(createAPI(`users/flushmessages?key=${types}`),{},
        {
          validateStatus: status => status === 200
        }
      )
      .then( response => {
        let datas = response.data.data;
        datas.forEach((data) => {
          let uids = new window.Array();
          if(data.uids.length) {
            uids = data.uids.split(',').map( uid => parseInt(uid) );
          }
          messages[data.key] = {
            count: data.count,
            max_id: data.max_id,
            uids: uids,
            time: this.timers(data.time, 8, false)
          }
        });
        this.messages = { ...this.messages, ...messages };
      })
      .catch(({ response: { data = {} } = {} } ) => {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: data.message,
            time: 2000,
            status: false
          });
        });
      });
    }
  };
  export default MessageList;
</script>
<style lang="scss" module>
  .entryLists {
    .entry {
      height: 70px;
      display: flex;
      align-items: center;
      background: #fff;
      border-bottom: 1px solid #e2e3e3;
      .entryContainer {
        width: 100%;
        .time {
          display: flex;
          justify-content: flex-end;
        }
        .entryIcon {
          display: flex;
          justify-content: center;
          align-items: center;
          .diggIcon {
            padding: 2vw;
            border-radius: 50%;
            background-color: #fe8f90;
          }
          .commentIcon {
            background-color: rgb(89, 182, 215);
            border-radius: 50%;
            padding: 2vw;
          }
        }
      }
    }
  }
</style>