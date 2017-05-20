<template>
  <div class="messageList">
    <div class="commonHeader">
      <Row :gutter="24">
        <Col span="14" offset="5" class="title-col">
          消息
        </Col>
      </Row>
    </div>
    <div :class="$style.entryLists">
      <Row :gutter="24" :class="$style.entry" >
        <div :class="$style.entryContainer" @click="changeUrl('/users/mycomments')">
          <Col span="4" :class="$style.entryIcon">
            <div :class="$style.commentIcon">
              <CommentIcon height="30" width="30" color="#fff" />
            </div>
          </Col>
          <Col span="15">
            <h4 style="font-weight: 400;">评论的</h4>
            <div v-if="commentCount" style="color: #999;">{{ commentLists }} <span v-show="userCount > 3">等人</span>评论了我</div>
            <div v-if="!commentCount" style="color: #999">还没有人评论我</div>
          </Col>
          <Col span="5" v-if="commentCount">
            <timeago :class=$style.time :since="commentTime" locale="zh-CN" :auto-update="60"></timeago>
            <i :class="$style.messageCount">{{commentCount}}</i>
          </Col>
        </div>
      </Row>
      <Row :gutter="24" :class="$style.entry">
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
          <Col span="5" v-if="diggsCount">
            <timeago :class=$style.time :since="diggTime" locale="zh-CN" :auto-update="60"></timeago>
            <i :class="$style.messageCount">{{diggsCount}}</i>
          </Col>
        </div>
      </Row>
      <Row :gutter="24" :class="$style.entry" v-for="(message, index) in imMessageList" :key="index">
        <div :class="$style.entryContainer" @click="changeUrl( `/users/message/${message.user_id}/${message.cid}`)">
          <Col span="4" :class="$style.entryIcon">
            <div :class="$style.messageAvatar">
              <img :class="$style.avatar" :src="message.avatar" />
            </div>
          </Col>
          <Col span="15">
            <h4 style="font-weight: 400;">{{ message.name }}</h4>
            <div v-if="message.lists.length" style="color: #999;">
              {{ message.lists.length ?  message.lists[message.lists.length - 1].txt  : '' }}
            </div>
          </Col>
          <!-- <Col span="5" v-if="diggsCount">
            <timeago :class=$style.time :since="diggTime" locale="zh-CN" :auto-update="60"></timeago>
            <i :class="$style.messageCount">{{diggsCount}}</i>
          </Col> -->
        </div>
      </Row>
    </div>
    <ToolBar/>
  </div>
</template>
<script>
  import { NOTICE, TOTALMESSAGELISTS } from '../stores/types';
  import { createAPI, addAccessToken } from '../utils/request';
  import ToolBar from '../components/ToolBar';
  import localEvent from '../stores/localStorage';
  import { getUserInfo } from '../utils/user';
  import DiggIcon from '../icons/Digg';
  import CommentIcon from '../icons/Comment';
  import timers from '../utils/timer';
  import { changeUrl } from '../utils/changeUrl';
  import lodash from 'lodash';

  const MessageList = {
    components: {
      ToolBar,
      DiggIcon,
      CommentIcon
    },
    data: () => ({
      messages: {},
      currentUser: 0
    }),
    computed: {
      imMessageList () {
        let messageList = this.$store.getters[TOTALMESSAGELISTS];
        return messageList;
      },
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
          if(!lodash.keys(userLocalInfo).length) {
            getUserInfo(digg, 30).then(user => {
              const { name = '' } = user;
              users += name + '、';
            });
          } else {
            const { name = ''} = userLocalInfo;
            users += name + '、';
          }
          count ++;
        });
        // 删除最后一个 顿号
        users = users.substr(0, users.length - 1);
        return users;
      },
      commentTime() {
        const { comments: { time = new window.Date().getTime() } = {} } = this.messages;
        return time;
      },
      commentCount () {
        const { comments: { count = 0 } = {} } = this.messages;
        return count;
      },
      userCount () {
        const { comments: { userCount = 0 } = {} } = this.messages;
        return userCount;
      },
      commentLists () {
        const { comments: { uids = [] } = {} } = this.messages;
        let users = '';
        let count = 0;
        uids.forEach((comment, index) => {
          if(count == 3) return;
          let userLocalInfo = localEvent.getLocalItem(`user_${comment}`);
          if(!lodash.keys(userLocalInfo).length > 0) {
            getUserInfo(comment, 30).then(user => {
              const { name = '' } = user;
              users += name + '、';
            });
          } else {
            const { name = '' } = userLocalInfo;
            users += name + '、';
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
      let currentUser = localEvent.getLocalItem('UserLoginInfo');
      this.currentUser = currentUser.user_id;
      let types = 'diggs,comments';
      let time = 0;
      time = localEvent.getLocalItem('messageFlushTime');
      let nowtime = parseInt(new window.Date().getTime() / 1000);
      if(!time) {
        time = parseInt(new window.Date().getTime() / 1000) - 86400;
      }
      localEvent.setLocalItem('messageFlushTime', nowtime);
      let messages = {};
      addAccessToken().get(createAPI(`users/flushmessages?key=${types}&time=${time+1}`),{},
        {
          validateStatus: status => status === 200
        }
      )
      .then( response => {
        let datas = response.data.data;
        datas.forEach((data) => {
          let uids = new window.Array();
          if(data.uids.length) {
            uids = Array.from(new Set(data.uids.map( uid => parseInt(uid) )));
          }
          messages[data.key] = {
            count: data.count,
            max_id: data.max_id,
            uids: uids,
            time: this.timers(data.time, 8, false),
            userCount: uids.length
          }
        });
        this.messages = { ...this.messages, ...messages };
      })
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
          width: 100%;
          font-size: 12px;
          color: #999;
        }
        .messageCount {
          padding: 0px 6px;
          border-radius: 50px;
          background: #f00;
          color: #fff;
          text-align: center;
          float: right;
          font-style: normal;
          font-size: 12px;
          margin-right: 4px;
          margin-top: 1vh;
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
          .messageAvatar {
            .avatar {
              width: 100%;
              border-radius: 50%;
            }
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