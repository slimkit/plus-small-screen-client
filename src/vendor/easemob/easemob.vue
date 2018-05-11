<template>
  <div class="easemob"></div>
</template>
<script>
// import bus from "@/bus.js";
import WebIM from "./index.js";
import { mapState } from "vuex";
export default {
  name: "easemob-root",
  data() {
    return {
      connected: false
    };
  },
  computed: {
    ...mapState(["CURRENTUSER"])
  },

  methods: {
    async getEasemobPassword() {
      const {
        data: { im_pwd_hash } = { data: { im_pwd_hash: "" } }
      } = await this.$http.get(`easemob/password`);

      return im_pwd_hash;
    },

    openEasemob() {
      this.getEasemobPassword().then(password => {
        if (WebIM.conn.isOpened()) {
          WebIM.conn.close("logout");
        }
        WebIM.conn.open({
          pwd: password,
          accessToken: password,
          user: this.CURRENTUSER.id,

          apiUrl: WebIM.config.apiURL,
          appKey: WebIM.config.appkey,

          success(token) {
            console.log(token);
          },
          error(e) {
            console.log(e);
          }
        });
      });
    }
  },

  created() {
    /**
     * 发送文本消息
     * @Author   Wayne
     * @DateTime 2018-03-25
     * @Email    qiaobin@zhiyicx.com
     * @param    string   content [要发送的内容]
     * @param    number   cid     本地房间
     * @param    number   touid   要被发送到哪个房间/哪个用户
     * @param    string   type    当前会话类型个人/群组
     * @return   {[type]}                         [description]
     */
    // bus.$on(
    //   "sendTxt-easemob",
    //   ({ content, cid, touid, type = "chat", callback }) => {
    //     const id = this.conn.getUniqueId();
    //     const msg = getLocalId("txt", id);
    //     const time = new Date();
    //     msg.set({
    //       msg: content, // 消息内容
    //       to: touid, // 接收消息对象（用户id/群组id）
    //       roomType: false,
    //       chatType: type,
    //       ext: {
    //         avatar: this.me.avatar,
    //         name: this.me.name
    //       },
    //       success: id => {
    //         /* 消息入库 */
    //         var dbMsg = {};
    //         // 本地id
    //         dbMsg.id = id;
    //         // 发送时间
    //         dbMsg.time = time.valueOf();
    //         // 本地roomID
    //         dbMsg.cid = cid;
    //         // 聊天类型
    //         dbMsg.type = type;
    //         // 发送者
    //         dbMsg.mid = this.me.id;
    //         // 目标用户
    //         dbMsg.uid = dbMsg.touid = ~~touid;
    //         // 是否已读, 发送方默认已读
    //         dbMsg.read = 1;
    //         // 文本内容
    //         dbMsg.txt = content;
    //         // 是否送达
    //         dbMsg.status = 0;
    //         callback(dbMsg);
    //       },
    //       fail: function() {
    //         console.log("Send private text error");
    //       }
    //     });
    //     if (type === "chat") msg.body.chatType = "singleChat";
    //     if (type === "chatRoom") msg.setGroup("groupchat");
    //     // this.conn.send(msg.body);
    //   }
    // );
  }
};
</script>
