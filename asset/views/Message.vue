<template>
  <div class="messageList">
    <div :class="$style.messageHeader">
      <Row type="flex" align="middle" :gutter="16" :class="$style.headerRow">
        <Col span="16" offset="4" :class="$style.ColCenter">
          消息
        </Col>
        <Col span="4">
          
        </Col>
      </Row>
    </div>
    <div v-if="!hasMsg" :class="$style.defaultNothing">
      <img :src="`http://localhost:8080/${defaultImg}`" alt="">
    </div>
    <ToolBar/>
  </div>
</template>
<script>
  import { NOTICE } from '../stores/types';
  import { createAPI, addAccessToken } from '../utils/request';
  import defaultNothingImg from '../statics/images/defaultNothingx3.png';
  import ToolBar from '../components/ToolBar';
  import localEvent from '../stores/localStorage';

  const currentUser = localEvent.getLocalItem('UserLoginInfo');
  const MessageList = {
    components: {
      ToolBar
    },
    data: () => ({
      messages: {},
      currentUser: currentUser.user_id
    }),
    computed: {
      // 查看是否有消息
      hasMsg () {
        const { comments: { count: defaultCommentCount = 0 } = {} } = this.messages;
        const { diggs: { count = defaultCommentCount } = {} } = this.messages;
        return count;
      },
      defaultImg () {
        console.log(defaultNothingImg);
        return defaultNothingImg;
      }
    },
    methods: {
      removeByValue (arr, val) {
        for(var i=0; i<arr.length; i++) {
          if(arr[i] == val) {
            arr.splice(i, 1);
            break;
          }
        }
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
            uids = data.uids.split(',');
            this.removeByValue(uids, currentUser);

          }
          messages[data.key] = {
            count: data.count,
            max_id: data.max_id,
            uids: uids
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
  .messageHeader {
    height: 55px;
    background-color: #fff;
    border-bottom: 1px solid #e2e3e3;
    .headerRow {
      height: 100%;
      .ColCenter {
        display: flex;
        justify-content: center;
        font-size: 18px;
      }
    }
  }
  .defaultNothing {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 55px;
    left: 0;
    right: 0;
    bottom: 0;
    img {
      width: 60%;
    }
  }
</style>