<template>
  <div class="p-chat-room m-box-model">
    <header class="m-box m-aln-center m-head-top m-main m-bb1 m-flex-grow0 m-flex-shrink0">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-shrink1 m-flex-base0">
        <svg class="m-style-svg m-svg-def" @click="goBack">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-box m-aln-center m-flex-grow2 m-flex-shrink2 m-flex-base0 m-justify-center m-head-top-title">
        <span class="m-text-cut">{{ name }}</span>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-shrink1 m-flex-base0"></div>
    </header>
    <main 
      ref="main"
      class="m-box-model p-chat-room-main m-flex-grow1 m-flex-shrink1 m-main">
      <bubble 
        v-for="msg in messages"
        :msg="msg"
        :key="msg.id"
        ></bubble>
    </main>

    <footer
    ref='footer'
    class="m-box m-aln-end m-main p-chat-room-foot m-flex-grow0 m-flex-shrink0 m-bt1">
      <form
        action="#"
        class="m-box-model m-aln-center m-justify-center m-flex-grow1 m-flex-shrink1 m-main p-chat-input">      
        <textarea 
          v-model='body'
          ref='textarea'
          @focus="onFocus"
          placeholder="随便说说~"
          @keyup.enter.prevent="sendMessage"
          :style="{ height: `${scrollHeight}px` }"></textarea>
        <textarea 
          rows="1"
          v-model='shadowText' class="shadow-input" ref='shadow'></textarea>
      </form>
      <button 
      class="m-flex-grow0 m-flex-shrink0 p-chat-button"
      @click="sendMessage"
      :disabled="disabled">发送</button>
    </footer>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

import WebIM, { sendTextMessage } from "@/vendor/easemob/WebIM.js";
import WebIMDB from "@/vendor/easemob/WebIMDB.js";

import $Message from "@/plugins/message-box";

import bubble from "./message-bubble.vue";
export default {
  name: "chat-room",
  components: {
    bubble
  },
  data() {
    return {
      chat: {},
      chatID: 0,
      body: "",
      scrollHeight: 0,
      paddingBottom: 0
    };
  },
  computed: {
    ...mapState({
      status: state => state.EASEMOB.status,
      messages: state => state.EASEMOB.currentChatRoomMessages
    }),
    type() {
      return this.chat.type;
    },
    info() {
      return (this.type === "chat" ? this.chat.user : this.chat.group) || {};
    },
    name() {
      return this.info.name || "";
    },
    shadowText() {
      return "圈" + this.body;
    },
    disabled() {
      return !this.body.length > 0;
    }
  },
  watch: {
    body(val, old) {
      if (val !== old) {
        this.$lstore.setData(`H5_CHAT_INPUT_${this.chat.from}`, val);
        this.$nextTick(() => {
          this.$refs.shadow &&
            (this.scrollHeight = this.$refs.shadow.scrollHeight);
        });
      }
    },
    messages(val) {
      this.$nextTick(() => {
        const scrollTop =
          this.$refs.main.scrollHeight - this.$refs.main.offsetHeight;
        this.$refs.main.scrollTop = scrollTop;
      });
    }
  },
  methods: {
    ...mapActions(["getCurrentChatMessages", "setCurrentChatRoom"]),
    init(chat) {
      this.chat = chat;
      this.$nextTick(() => {
        /**
         * 提取临时输入
         */
        this.$lstore.hasData(`H5_CHAT_INPUT_${this.chat.from}`) &&
          (this.body = this.$lstore.getData(`H5_CHAT_INPUT_${this.chat.from}`));

        /**
         * 设置输入框的高度
         */
        this.$refs.shadow &&
          (this.scrollHeight = this.$refs.shadow.scrollHeight);
        /**
         * 设置页面高度
         * @type {[type]}
         */
        this.$el.style.height = window.innerHeight + "px";

        /**
         * 设置当前操作 聊天室
         */
        this.setCurrentChatRoom(chat);
      });
    },
    bodyInput(e) {},
    sendMessage() {
      if (this.disabled) return;
      this.body.length > 0 &&
        sendTextMessage(this.body, this.chatID, this.type).then(data => {
          this.body = "";
        });
    },
    onFocus() {
      /**
       * 兼容 IOS 键盘弹起
       * @author jsonleex <jsonlseex@163.com>
       */
      setTimeout(() => {
        const wH2 = window.innerHeight;
        window.scrollTo(0, wH2 - 70);
      }, 350);
    }
  },
  mounted() {
    const chatID = this.$route.params.chatID;
    this.chatID = chatID;

    WebIMDB.getChatById(chatID).then(chat => {
      chat && chat.from === chatID
        ? this.init(chat)
        : ($Message.error("无效的会话列表"),
          this.$router.push("/message/chats"));
    });
  },
  destoryed() {
    this.setCurrentChatRoom(null);
  }
};
</script>
<style lang="less">
.p-chat-room {
  .p-chat-button {
    width: 100px;
    height: 26 * 1.5 + 20px;
    border-radius: 10px;
    line-height: normal;
    color: #fff;
    font-size: 24px;
    background-color: @primary;

    &[disabled] {
      background-color: #ccc;
    }
  }
}
.p-chat-room-main {
  padding: 20px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  .message-item {
    + .message-item {
      margin-top: 30px;
    }
  }
}
.p-chat-room-foot {
  line-height: 1;
  overflow: hidden;
  padding: 10px;
}
.p-chat-input {
  position: relative;
  overflow: hidden;
  padding: 10px;
  margin-right: 30px;
  border-radius: 10px;
  border: 1px solid @border-color; /* no */
  textarea {
    font-size: 26px;
    line-height: 1.5;
    width: 100%;
    resize: none;
    max-height: 26 * 1.5 * 4 + 20px;
    -webkit-overflow-scrolling: touch;
  }
  .shadow-input {
    border-radius: 0;
    padding: 0;
    position: absolute;
    width: 100%;
    z-index: -9999;
    visibility: hidden;
  }
}
</style>
