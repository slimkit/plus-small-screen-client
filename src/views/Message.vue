<template>
  <div class="messageList">
    <div class="commonHeader" v-if="!isWeiXin">
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
              <div style="width: 100%; border-radius: 100px; padding: 2vw">
                <CommentIcon height="100%" width="100%" color="#fff" />
              </div>
            </div>
          </Col>

          <Col span="15" style="padding: 0;" v-if="messageCount.comments.count">
            <h4 style="font-weight: 400;">评论的</h4>
            <div v-if="commentLists" style="color: #999; font-size: 12px">{{ commentsText }} <span v-show="messageCount.comments.count > 3">等人</span>评论了我</div>
            <div v-else style="color: #999; font-size: 12px;">还没有人评论我</div>
          </Col>

          <Col span="20" style="padding:0 12px 0 0;" v-else>
            <h4 style="font-weight: 400;">评论的</h4>
            <div v-if="commentLists" style="color: #999; font-size: 12px;">{{ commentsText }} <span v-show="messageCount.comments.count > 3">等人</span>评论过我</div>
            <div v-else style="color: #999; font-size: 12px;">还没有人评论我</div>
          </Col>

          <Col span="5" v-if="messageCount.comments.count">
            <timeago :class=$style.time :since="commentTime" locale="zh-CN" :auto-update="60"></timeago>
            <i :class="$style.messageCount">{{ messageCount.comments.count }}</i>
          </Col>
        </div>
      </Row>
      <Row :gutter="24" :class="$style.entry">
        <div :class="$style.entryContainer" @click="changeUrl('/users/diggs')">
          <Col span="4" :class="$style.entryIcon">
            <div :class="$style.diggIcon">
              <div style="width: 100%; border-radius: 100px; padding: 2vw">
                <DiggIcon height="100%" width="100%" color="#fff" />
              </div>
            </div>
          </Col>
          <Col span="15" style="padding: 0;" v-if="messageCount.diggs.count">
            <h4 style="font-weight: 400;">赞过的</h4>
            <div v-if="diggLists" style="color: #999; font-size: 12px;">{{ diggsText }} <span v-show="messageCount.diggs.count > 3">等人</span>赞了我</div>
            <div v-else style="color: #999; font-size: 12px;">还没有人赞我</div>
          </Col>
          <Col span="20" style="padding: 0 12px 0 0;" v-else>
            <h4 style="font-weight: 400;">赞过的</h4>
            <div v-if="diggLists" style="color: #999; font-size: 12px;">{{ diggsText }} <span v-show="messageCount.diggs.count > 3">等人</span>赞过我</div>
            <div v-else style="color: #999; font-size: 12px;">还没有人赞我</div>
          </Col>
          <Col span="5" v-if="messageCount.diggs.count">
            <timeago :class=$style.time :since="diggTime" locale="zh-CN" :auto-update="60"></timeago>
            <i :class="$style.messageCount">{{messageCount.diggs.count}}</i>
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
          <Col span="15" style="padding: 0;">
            <h4 style="font-weight: 400;">{{ message.name }}</h4>
            <div v-if="message.lists.length" :class="$style.messagePreview">
              {{ message.lists.length ?  message.lists[message.lists.length - 1].txt  : '' }}
            </div>
          </Col>
          <Col span="5" v-if="message.lists.length" style="padding-top: 4px">
            <timeago :class="$style.timer" :since="message.lists[message.lists.length - 1].time" locale="zh-CN" :auto-update="60"></timeago>
            <i v-if="message.count" :class="$style.messageCount">{{message.count || 0}}</i>
          </Col>
        </div>
      </Row>
    </div>
    <ToolBar/>
  </div>
</template>
<script>
  import { NOTICE, TOTALMESSAGELISTS, MESSAGENOTICE, MESSAGELISTS } from '../stores/types';
  import { createAPI, addAccessToken, createOldAPI } from '../utils/request';
  import ToolBar from '../components/ToolBar';
  import { getUserInfo } from '../utils/user';
  import DiggIcon from '../icons/Digg';
  import CommentIcon from '../icons/Comment';
  import timers from '../utils/timer';
  import { changeUrl } from '../utils/changeUrl';
  import lodash from 'lodash';
  import { mapState } from 'vuex';

  const MessageList = {
    components: {
      ToolBar,
      DiggIcon,
      CommentIcon
    },
    data: () => ({
      messages: {},
      isWeiXin: TS_WEB.isWeiXin,
      commentsText: '',
      diggsText: ''
    }),
    computed: {
      // 消息统计
      ...mapState({
        messageCount: state => state.messageCount.messageCount
      }),
      imMessageList () {
        // 获取会话列表
        let messageList = { ...this.$store.getters[TOTALMESSAGELISTS] };
        if(!lodash.keys(messageList).length > 0) return {};
        return messageList;
      },
      diggTime () {
        const { diggs: { time = new window.Date().getTime() } = {} } = this.messageCount;
        return time;
      },
      diggLists () {
        const { diggs: { uids = [] } = {} } = this.messageCount;
        let users = '';
        let count = 0;
        let newUids = [ ...uids ];

        if(!uids.length) {
          let oldIds = [];
          let count = {
            diggs: {}
          };
          window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.diggslist, () => {
            window.TS_WEB.dataBase.diggslist.where({user_id: window.TS_WEB.currentUserId}).limit(10).toArray().then( result => {
              if(result.length) {
                result.forEach( res => {
                  oldIds.push(res.uid);
                });
                count.diggs.count = 0;
                count.diggs.uids = Array.from(new Set(oldIds));
                this.$store.dispatch(MESSAGENOTICE, cb => {
                  cb(count);
                });
              }
            })
          })
          return 0;
        }

        Array.from(new Set(newUids)).slice(0, 3).forEach( (digg, index) => {
          count ++;
          if(count > 3) return;
          let user = this.$storeLocal.get(`user_${digg}`);
          if(user === undefined) {
            getUserInfo(digg, 30).then(user => {
              const { name = '' } = user;
              users += name + '、';
              this.diggsText = users.substr(0, users.length - 1);
            });
          } else {
            const { name = '' } = user;
            users += (name + '、');
            this.diggsText = users.substr(0, users.length - 1);
          }
        });
        return newUids.length;
      },
      commentTime() {
        const { comments: { time = new window.Date().getTime() } = {} } = this.messageCount;
        return time;
      },
      commentLists () {
        const { comments: { uids = [] } = {} } = this.messageCount;
        let users = '';
        let count = 0;
        if(!uids.length) {
          let oldIds = [];
          let count = {
            comments: {}
          };
          window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.commentslist, () => {
            window.TS_WEB.dataBase.commentslist.where({user_id: window.TS_WEB.currentUserId}).limit(10).toArray().then( result => {
              if(result.length) {
                result.forEach( res => {
                  oldIds.push(res.uid);
                });
                count.comments.count = 0;
                count.comments.uids = Array.from(new Set(oldIds));
                this.$store.dispatch(MESSAGENOTICE, cb => {
                  cb(count);
                });
              }
            })
          })
          return 0;
        }

        Array.from(new Set(uids)).slice(0,3).forEach((comment, index) => {
          count ++;
          
          if(count > 3) return;
          
          let user = this.$storeLocal.get(`user_${comment}`);
          if(user === undefined) {
            getUserInfo(comment, 30).then(user => {
              const { name = '' } = user;
              users += name + '、';
              this.commentsText = users.substr(0, users.length - 1);
            });
          } else {
            const { name = '' } = user;
            users += (name + '、');
            this.commentsText = users.substr(0, users.length - 1);
          }    
        });
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
      let time = 0;
      time = this.$storeLocal.get('messageFlushTime');
      let nowtime = parseInt(new window.Date().getTime() / 1000);
      if(!time) {
        time = nowtime - 86400;
      }
      this.$storeLocal.set('messageFlushTime', nowtime);

      // 获取新消息
      addAccessToken().get(createOldAPI(`users/flushmessages?key=${types}&time=${time+1}`),{},
        {
          validateStatus: status => status === 200
        }
      )
      .then( response => {
        let datas = response.data.data;
        let count = {};
        datas.forEach((data) => {
          // 消息数量不为空
          if(data.count) {
            // 组装数组 写入vuex
            if(data.key === "follows") {
              count.fans = data.count + this.messageCount[data.key];
            } else if( data.key === 'comments') {
              count[data.key] = {};
              count[data.key].count = data.count + this.messageCount[data.key].count;
              count[data.key].uids = Array.from(new Set([ ...this.messageCount[data.key].uids, ...data.uids ]));
              count[data.key].time = this.timers(data.time, 8, false);
            } else if( data.key === 'diggs') {
              count[data.key] = {};
              count[data.key].count = data.count + this.messageCount[data.key].count;
              count[data.key].uids = Array.from(new Set([ ...this.messageCount[data.key].uids, ...data.uids ]));
              count[data.key].time = this.timers(data.time, 8, false);
            }
          }
        });
        this.$store.dispatch(MESSAGENOTICE, cb => {
          cb(count)
        });
      });
      // 写入聊天对话
      window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.chatroom, window.TS_WEB.dataBase.messagebase, () => {
        // 查询当前用户的本地对话
        window.TS_WEB.dataBase.chatroom
          .orderBy('last_message_time')
          .filter( (item) => {
            return (item.owner === window.TS_WEB.currentUserId);
          })
          .limit(10)
          .reverse()
          .toArray( results => {
            if(results.length) {
              results.forEach( result => {
                let li = {};
                let uids = result.uids.split(',');
                let user_id = 0;
                if(uids[0] == window.TS_WEB.currentUserId) {
                  user_id = uids[1];
                } else {
                  user_id = uids[0];
                }
                window.TS_WEB.dataBase.messagebase
                .orderBy('seq')
                .filter( (item) => {
                  return (item.seq != -1 && item.cid === result.cid);
                })
                .limit(15)
                .reverse()
                .toArray( array => {
                  let messageList = [];
                  let messageBody = {};
                  if(array.length) {
                    array = array.reverse();
                    array.forEach( amessage => {
                      messageBody.user_id = amessage.uid;
                      messageBody.txt = amessage.txt;
                      messageBody.time = amessage.time;
                      messageBody.addCount = false;
                      messageList = [ ...messageList, messageBody ];
                      messageBody = {};
                    });
                  }
                  let item = this.$storeLocal.get(`user_${user_id}`);
                  if(!item) {
                    getUserInfo(user_id).then( user => {
                      li.name = user.name;
                      li.avatar = user.avatar;
                      li.lists = messageList;
                      li.cid = result.cid;
                      li.user_id = user_id;
                      this.$store.dispatch(MESSAGELISTS, cb => {
                        cb(li);
                      });
                      li = {};
                    });

                  } else {
                    li.name = item.name;
                    li.avatar = item.avatar;
                    li.lists = messageList;
                    li.cid = result.cid;
                    li.user_id = user_id;
                    // li.count = 0;
                    this.$store.dispatch(MESSAGELISTS, cb => {
                      cb(li);
                    });
                    // 
                    li = {};
                  }
                });
              });
            }
        })
      })
      .catch( e => {
        console.log(e);
      })
    }
  };
  export default MessageList;
</script>
<style lang="scss" module>
  .timer {
    font-size: 12px;
    float: right;
    color: #999;
    text-align: right;
    width: 100%;
  }
  .entryLists {
    padding-bottom: 56px;
    .entry {
      height: 70px;
      display: flex;
      align-items: center;
      background: #fff;
      border-bottom: 1px solid #ededed;
      .entryContainer {
        width: 100%;
        .messagePreview {
          color: #999;
          font-size: 12px;
          text-align: initial;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
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
          margin-top: 4px;
        }
        .entryIcon {
          display: flex;
          justify-content: center;
          align-items: center;
          .diggIcon {
            border-radius: 100px;
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
            border-radius: 100px;
          }
        }
      }
    }
  }
</style>