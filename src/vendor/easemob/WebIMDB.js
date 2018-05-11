import Dexie from "dexie";
import WebIMConfig from "./WebIMConfig";
import { getUserInfoById } from "@/api/user.js";

import lstore from "@/plugins/lstore/lstore.js";
import { getGroupInfo } from "@/vendor/easemob/WebIM.js";

const DB_ENABLE = WebIMConfig.enableLocalStorage;

const DB_VERSION = 2;

/**
 * 消息列表
 */
const MESSAGE = "messages";
const MESSAGE_INDEX_KEYS = ["id", "from", "to", "type", "isUnread", "status"];

const CHATS = "chats";
const CHATS_INDEX_KEYS = ["id", "from", "to", "type", "unreadCount", "latest"];

const AppDB = {
  // init db
  init(UID) {
    if (!DB_ENABLE || this.db) {
      return;
    }
    const db = new Dexie(`TSP_${UID}`);
    db.version(DB_VERSION).stores({
      [CHATS]: CHATS_INDEX_KEYS.join(","),
      [MESSAGE]: MESSAGE_INDEX_KEYS.join(",")
    });

    this.db = db;
    this.$_CHATS = db.table(CHATS);
    this.$_MESSAGE = db.table(MESSAGE);
    console.log("AppDB created");
  },

  exec(cb1, cb2) {
    return new Promise((resolve, reject) => {
      if (DB_ENABLE) {
        cb1(resolve);
      } else {
        cb2 && cb2(reject);
      }
    });
  },

  // get unread messages
  getUnreadList() {
    const $_MESSAGE = this.$_MESSAGE;
    return this.exec(resolve => {
      $_MESSAGE
        .where("isUnread")
        .equals(1)
        .toArray()
        .then(res => resolve(res));
    });
  },
  /**
   * 获取会话列表
   * @author jsonleex <jsonlseex@163.com>
   */
  getChats() {
    const $_CHATS = this.$_CHATS;
    return $_CHATS
      .toCollection()
      .reverse()
      .sortBy("latest.time");
  },
  getChatById(id) {
    const $_CHATS = this.$_CHATS;
    return this.exec(resolve => {
      $_CHATS
        .where("from")
        .equals(id)
        .toArray()
        .then(res => {
          if (res.length === 0) {
            getUserInfoById(id).then(user => {
              user && user.id == id
                ? this.addChat({
                    from: lstore.getData("H5_CUR_USER").id,
                    type: "chat",
                    to: id,
                    bySelef: true
                  }).then(data => {
                    console.log(data);
                  })
                : resolve();
            });
          } else {
            resolve(res[0]);
          }
        });
    });
  },
  // get lastest mumber of message by start index
  fetchMessage(id, chatType = "chat", offset = 0, limit = 20) {
    const $_MESSAGE = this.$_MESSAGE;
    return this.exec(resolve => {
      $_MESSAGE
        .where("type")
        .equals(chatType)
        .filter(item => {
          if (item.error) {
            return false;
          }
          if (chatType === "chat") {
            return item.from == id || item.to == id;
          } else {
            return item.to == id;
          }
        })
        .reverse()
        .offset(offset)
        .limit(limit)
        .sortBy("time")
        .then(res => {
          resolve(res.reverse());
        });
    });
  },

  // read all messages of conversation
  readMessage(chatType, id) {
    const $_MESSAGE = this.$_MESSAGE;
    const key = chatType === "chat" ? "from" : "to";
    return this.exec(resolve => {
      $_MESSAGE
        .where({ type: chatType, [key]: id, isUnread: 1 })
        .modify({ isUnread: 0 })
        .then(res => {
          this.updateChat(id).then(res => resolve(res));
        });
    });
  },

  // update  message status
  updateMessageStatus: (id, status) => {
    const $_MESSAGE = this.$_MESSAGE;
    return this.exec(resolve => {
      $_MESSAGE
        .where("id")
        .equals(id)
        .modify({ status: status })
        .then(res => {
          resolve(res);
        });
    });
  },

  addChat(message) {
    const UID = lstore.getData("H5_CUR_USER").id;
    const { type, from, to } = message;
    const $_CHATS = this.$_CHATS;
    return this.exec(resolve => {
      if (message.bySelef) {
        if (type === "chat") {
          getUserInfoById(to).then(user => {
            $_CHATS
              .where("from")
              .equals(to)
              .count()
              .then(res => {
                if (res === 0) {
                  const chatItem = {
                    id: to,
                    to: from,
                    from: to,
                    type,
                    unreadCount: 0,
                    latest: message,
                    user
                  };
                  console.log("新增单聊:", to);
                  $_CHATS
                    .add(chatItem)
                    .then(res => resolve(res))
                    .catch(e => console.log("add chatItem: ", e));
                } else {
                  console.log("更新单聊:", to);
                  this.updateChat(message.to, message).then(res => {
                    resolve(res);
                  });
                }
              });
          });
        } else if (type === "groupchat") {
          $_CHATS
            .where("from")
            .equals(to)
            .count()
            .then(res => {
              if (res === 0) {
                console.log("新增群聊: ", to);
                getGroupInfo(to).then(group => {
                  console.log("群组信息", group);
                  const chatItem = {
                    id: to,
                    from: to,
                    to: 0,
                    type,
                    unreadCount: 1,
                    latest: message,
                    group
                  };
                  $_CHATS
                    .add(chatItem)
                    .then(res => resolve(chatItem))
                    .catch(e => console.log("add chatItem: ", e));
                });
              } else {
                console.log("更新群聊: ", to);
                this.updateChat(to, message).then(res => {
                  resolve(res);
                });
              }
            });
        }
      } else {
        if (type === "chat") {
          getUserInfoById(from).then(user => {
            $_CHATS
              .where("from")
              .equals(from)
              .count()
              .then(res => {
                if (res === 0) {
                  const chatItem = {
                    id: from,
                    to,
                    from,
                    type,
                    unreadCount: 1,
                    latest: message,
                    user
                  };
                  console.log("新增单聊:", from);
                  $_CHATS
                    .add(chatItem)
                    .then(res => resolve(res))
                    .catch(e => console.log("add chatItem: ", e));
                } else {
                  console.log("更新单聊:", from);
                  this.updateChat(message.from, message).then(res => {
                    resolve(res);
                  });
                }
              });
          });
        } else if (type === "groupchat") {
          $_CHATS
            .where("from")
            .equals(to)
            .count()
            .then(res => {
              if (res === 0) {
                console.log("新增群聊: ", to);
                getGroupInfo(to).then(group => {
                  console.log("群组信息", group);
                  const chatItem = {
                    id: to,
                    from: to,
                    to: 0,
                    type,
                    unreadCount: 1,
                    latest: message,
                    group
                  };
                  $_CHATS
                    .add(chatItem)
                    .then(res => resolve(res))
                    .catch(e => console.log("add chatItem: ", e));
                });
              } else {
                console.log("更新群聊: ", to);
                this.updateChat(to, message).then(res => {
                  resolve(res);
                });
              }
            });
        }
      }
    });
  },

  updateChat(from, message) {
    const $_CHATS = this.$_CHATS;
    return this.exec(resolve => {
      $_CHATS
        .where("from")
        .equals(from)
        .modify(chat => {
          message
            ? (!message.bySelef && (chat.unreadCount += 1),
              (chat.latest = message))
            : (chat.unreadCount = 0);
          return chat;
        })
        .then(res => resolve(res))
        .catch(e => console.error("update chat:", e));
    });
  },
  // add a message to the database
  addMessage(message, isUnread = 0) {
    const $_MESSAGE = this.$_MESSAGE;
    if (!message.error) {
      return this.exec(resolve => {
        $_MESSAGE
          .where("id")
          .equals(message.id)
          .count()
          .then(res => {
            if (res === 0) {
              message.isUnread = isUnread;
              $_MESSAGE
                .add(message)
                .then(messageId => {
                  this.addChat(message).then(chatId => {
                    resolve({ messageId, chatId });
                  });
                })
                .catch(e => console.log("add messag:", e));
            }
          });
      });
    }
  },

  // clear all messages of specified conversation
  clearMessage(chatType, id) {
    const $_MESSAGE = this.$_MESSAGE;
    return this.exec(resolve => {
      $_MESSAGE
        .where("type")
        .equals(chatType)
        .filter(item => {
          if (chatType === "chat") {
            return item.from == id || item.to == id;
          } else {
            return item.to == id;
          }
        })
        .delete()
        .then(res => resolve(res));
    });
  }
};

// in order to test in browser, will be removed
window.AppDB = AppDB;

lstore.hasData("H5_CUR_USER") && AppDB.init(lstore.getData("H5_CUR_USER").id);

export default AppDB;
