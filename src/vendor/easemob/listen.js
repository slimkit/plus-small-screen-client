import bus from "@/bus.js";
import WebIM from "./WebIM.js";
import AppDB from "./AppDB.js";
import lstore from "@/plugins/lstore";

import { generateMessage } from "./index.js";

WebIM.conn.listen({
  /**
   * 监听连接事件
   * @author jsonleex <jsonlseex@163.com>
   */
  onOpened(msg) {
    console.log("聊天服务连接成功" /*, msg*/);
    try {
      /************** 连接成功后 **************/
      /**
       * c初始化 数据表
       */
      AppDB.init(lstore.getData("H5_CUR_USER").id);

      WebIM.conn.setPresence();
    } catch (e) {
      console.log(e);
    }
  },
  onClosed: msg => {
    console.info("与聊天服务器断开连接", msg);
  },
  /**
   * 错误捕获
   * @author jsonleex <jsonlseex@163.com>
   */
  onError: err => {
    console.error("聊天模块又双叒叕报错啦:", err);
  },
  /**
   * 纯文本信息
   * @author jsonleex <jsonlseex@163.com>
   */
  onTextMessage: message => {
    console.log("onTextMessage:", message);
    generateMessage(message).then(({ msg, room }) => {
      /**
       * 存 $_MESSAGES
       */
      AppDB.addMessage(msg).then(res => {
        AppDB.addChatRoom(room).then(res => {
          vuex.dispatch("initChatRooms");
          bus.$emit("UpdateRoomMessages");
        });
      });
    });
  },
  onPictureMessage: message => {
    console.log("onPictureMessage", message);
  },

  onReceivedMessage: message => {
    console.log(message);
  },

  onPresence: msg => {
    console.log(msg);
  }
});
