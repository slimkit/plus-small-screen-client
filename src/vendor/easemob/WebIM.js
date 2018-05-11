import vuex from "@/stores";
import Api from "@/api/api.js";

import websdk from "easemob-websdk";
import WebIMConfig from "./WebIMConfig";

import WebIMDB from "./WebIMDB.js";

import lstore from "@/plugins/lstore/lstore.js";
const WebIM = window.WebIM || {};
WebIM.config = WebIMConfig;
WebIM.conn = new websdk.connection({
  isAutoLogin: false,
  https: WebIM.config.https,
  url: WebIM.config.xmppURL,
  apiUrl: WebIM.config.apiURL,
  delivery: WebIM.config.delivery,
  isStropheLog: WebIM.config.isStropheLog,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  autoReconnectInterval: WebIM.config.autoReconnectInterval
});

WebIM.conn.listen({
  onOpened(msg) {
    console.log("open", msg);
    try {
      const UID = lstore.getData("H5_CUR_USER").id;
      /**
       * 创建 数据表
       */
      WebIMDB.init(UID);

      /**
       * 初始化 对话列表
       */
      vuex.dispatch("initChats");

      /**
       * 更新 连接状态
       */
      vuex.commit("EASEMOB_STATUS", 1);
      vuex.commit("EASEMOB_CONNECTING", "已连接");

      WebIM.conn.setPresence();
    } catch (e) {
      console.log(e);
    }
  },

  onPresence: msg => {
    console.log(msg);
  },

  onError: err => {
    console.error(err);
  },

  onClosed: msg => {
    console.log("断开连接", msg);
    vuex.commit("EASEMOB_STATUS", 0);
    vuex.commit("EASEMOB_CONNECTING", "断开连接");
  },

  onReceivedMessage: message => {
    console.log(message);
  },

  onTextMessage: message => {
    console.log("onTextMessage:", message);
    vuex.dispatch("addTextMessage", message);
  },

  onPictureMessage: message => {
    console.log("onPictureMessage", message);
    console.log(message);
  },

  // onFileMessage

  onAudioMessage: message => {
    console.log(message);
  },

  onVideoMessage: message => {
    console.log(message);
  }
});

/**
 * 获取群组信息
 * @author jsonleex <jsonlseex@163.com>
 * @param  {Number} gid
 */
export function getGroupInfo(gid) {
  return new Promise((resolve, reject) => {
    /**
     * 环信接口
     */
    // WebIM.conn.getGroupInfo({
    //   groupId: gid,
    //   success: resolve,
    //   err: reject
    // });

    /**
     * TS+ 接口
     */
    Api.get(`/easemob/group?im_group_id=${gid}`)
      .then(({ data: [group] = [{}] }) => {
        resolve(group);
      })
      .catch(err => {
        console.log("获取群组信息失败");
        resolve({});
      });
  });
}

export function sendTextMessage(body, to, type = "chat") {
  return new Promise(resolve => {
    const UID = lstore.getData("H5_CUR_USER").id;

    /**
     * 生成 消息 ID
     */
    const id = WebIM.conn.getUniqueId();
    /**
     * 创建文本消息
     */
    const message = new WebIM.message("txt", id); // 创建文本消息

    message.set({
      to,
      msg: body,
      chatType: "chatRoom",
      roomType: false,
      success(id, serverMsgId) {
        const msg = {
          id: serverMsgId,
          type,
          to,
          from: UID,
          sourceMsg: body,
          data: body,
          error: false
        };
        vuex.dispatch("addTextMessage", msg).then(data => {
          resolve(data);
        });
      },
      fail(e) {
        console.log("Send private text error");
      }
    });

    type === "chat" && (message.body.chatType = "singleChat");
    type === "groupchat" && message.setGroup("groupchat");

    WebIM.conn.send(message.body);
  });
}

export default WebIM;
