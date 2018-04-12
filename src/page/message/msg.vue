<template>
  <section></section>
</template>
<style lang="less">
</style>
<script>
import bus from "@/bus.js";
import { mapActions, mapState } from "vuex";
import { connect, getLocalId, getEasemobPassword } from "@/easemob/init.js";

export default {
  name: "easemob-component",
  data: () => ({
    conn: {}
  }),
  methods: {
    ...mapActions(["INIT_ROOMS"])
  },
  computed: {
    ...mapState({
      me: state => state.CURRENTUSER
    })
  },
  created() {
    bus.$on("connect-easemob", () => {
      // 获取环信登录密码
      getEasemobPassword().then(res => {
        if (res) {
          const conn = connect(res);
          this.conn = conn;
          this.INIT_ROOMS();
        }
      });
    });

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
    bus.$on(
      "sendTxt-easemob",
      ({ content, cid, touid, type = "chat", callback }) => {
        const id = this.conn.getUniqueId();
        const msg = getLocalId("txt", id);
        const time = new Date();
        msg.set({
          msg: content, // 消息内容
          to: touid, // 接收消息对象（用户id/群组id）
          roomType: false,
          chatType: type,
          ext: {
            avatar: this.me.avatar,
            name: this.me.name
          },
          success: id => {
            /*消息入库*/
            var dbMsg = {};
            // 本地id
            dbMsg.id = id;
            // 发送时间
            dbMsg.time = time.valueOf();
            // 本地roomID
            dbMsg.cid = cid;
            // 聊天类型
            dbMsg.type = type;
            // 发送者
            dbMsg.mid = this.me.id;
            // 目标用户
            dbMsg.uid = dbMsg.touid = ~~touid;
            // 是否已读, 发送方默认已读
            dbMsg.read = 1;
            // 文本内容
            dbMsg.txt = content;
            // 是否送达
            dbMsg.status = 0;
            callback(dbMsg);
          },
          fail: function() {
            console.log("Send private text error");
          }
        });
        if (type === "chat") msg.body.chatType = "singleChat";
        if (type === "chatRoom") msg.setGroup("groupchat");
        this.conn.send(msg.body);
      }
    );
  }
};
</script>
