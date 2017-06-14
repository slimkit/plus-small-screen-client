import { TOTALMESSAGELISTS, TOTALMESSAGELIST, SYNCIMMESSAGE, IMSTATUS } from '../stores/types';
import { app } from '../index';
import { getImMessageItem } from './localDatabase';
import localEvent from '../stores/localStorage';
import lodash from 'lodash';
import { getUserInfo } from './user';
import { addAccessToken, createAPI } from './request';

const url = window.TS_WEB.socketUrl;
const im_token = window.TS_WEB.im_token;
const reg = /^\[\"(.*?);\",/;
const currentUser = localEvent.getLocalItem('UserLoginInfo');
function connect () {
	// 链接IM
	if(window.TS_WEB.socketUrl) { // 判断是否配置im聊天服务器,
		if(TS_WEB.webSocket && TS_WEB.webSocket.readyState != 1) { // 已经连接过,但是处于非链接状态
		    try {
				window.TS_WEB.webSocket = new window.WebSocket(TS_WEB.webSocket.url);
				window.TS_WEB.webSocket.onopen = evt => {
					onOpen(evt);
				}
				window.TS_WEB.webSocket.onmessage = evt => {
					onMessage(evt);
				}
				window.TS_WEB.webSocket.onclose = evt => {
					onClose(evt);
				}
			} catch (e) {
				window.console.log(e);
			}
	  } else if(TS_WEB.webSocket == null && TS_WEB.socketUrl) { // 还没有连接过, 直接新建链接
	    addAccessToken().get(createAPI('im/users'), {} , {
	      validateStatus: status => status === 200
	    })
	    .then( response => {
      	let data= response.data;
        window.TS_WEB.im_token = data.data.im_password; // 保存im口令
        if(window.TS_WEB.socketUrl) {
        	let socketUrl = `ws://${window.TS_WEB.socketUrl}?token=${data.data.im_password}`;
        	try {
						window.TS_WEB.webSocket = new window.WebSocket(socketUrl);
						window.TS_WEB.webSocket.onopen = evt => {
							onOpen(evt);
						}
						window.TS_WEB.webSocket.onmessage = evt => {
							onMessage(evt);
						}
						window.TS_WEB.webSocket.onclose = evt => {
							onClose(evt);
						}
					} catch (e) {
						window.console.log(e);
					}
      	}
	    });
	  }
	}
  
	
};

function onMessage (message) { 
	let msg = message;
	let messagetype = msg.data.substr(0, 1); // 获取消息第一位判断消息类型
	let data = JSON.parse(msg.data.substr(1)); // 数据转换
	if(messagetype == 3) {
		let user = localEvent.getLocalItem(`user_${currentUser.user_id}`);
		if(data[0] === 'convr.msg.sync' && data[1].length) {
			data[1].forEach( (value, index) => {
				if(value.uid !== currentUser.user_id) { // 非自己发送的消息
					let user = localEvent.getLocalItem(`user_${value.uid}`);
					if(!lodash.keys(user).length) {
						getUserInfo(value.uid, 30).then( u => {
							value.avatar = u.avatar[30];
							value.name = u.name;
							// app.$store.dispatch(TOTALMESSAGELIST, cb => {
							// 	cb([
							// 		'syncMessage',
							// 		value
							// 		]);
							// });
						});
					} else {
						value.avatar = user.avatar[30];
						value.name = user.name;
						// app.$store.dispatch(TOTALMESSAGELIST, cb => {
						// 	cb([
						// 		'syncMessage',
						// 		value
						// 		]);
						// });
					}
					if(index == (data[1].length - 1)) {
						localEvent.setLocalItem(`room_${value.cid}_lastseq`, value.seq);
					}
				} else { // 我的消息
					let user = localEvent.getLocalItem(`user_${currentUser.user_id}`);
					if(!lodash.keys(user).length) {
						getUserInfo(currentUser.user_id, 30).then( u => {
							value.avatar = u.avatar[30];
							value.name = u.name;
							value.me = true;
							// app.$store.dispatch(TOTALMESSAGELIST, cb => {
							// 	cb([
							// 		'syncMessage',
							// 		value
							// 		]);
							// });
						});
					} else {
						value.avatar = user.avatar[30];
						value.name = user.name;
						value.me = true;
						// app.$store.dispatch(TOTALMESSAGELIST, cb => {
						// 	cb([
						// 		'syncMessage',
						// 		value
						// 		]);
						// });
					}
				}
			});
		}

		// 登录后同步最近10条消息的操作
		if(data[0] === 'auth' && data[1].seqs.length) {
			data[1].seqs.forEach( seq => {
				let msg = '2';
				let message = [
					'convr.msg.sync',
					{
				    "cid": parseInt(seq.cid),
				    "limit": 10,
				    "order": 1 // 倒序获取最新10条消息
					}
				];
				msg += JSON.stringify(message);
				TS_WEB.webSocket.send(msg);
			});
		}

		if(data[0] === 'convr.msg') {
			let dbData = {
				seq: data[1].seq,
				mid: data[1].mid,
				time: data[1].mid / 8388608 + 1451577600000
			};
			window.TS_WEB.dataBase.transaction('rw', window.TS_WEB.dataBase.messagebase, () => {
				window.TS_WEB.dataBase.messagebase.where('hash').equals(data[2]).modify(dbData);
				window.TS_WEB.dataBase.messagebase.where('hash').equals(data[2]).first().then( results => {
					app.$store.dispatch(TOTALMESSAGELIST, cb => {
						cb(results);
					});
				});
			})
			.catch (window.TS_WEB.dataBase.ModifyError, function (e) {

		    // ModifyError did occur
		    console.error(e.failures.length + " items failed to modify");

			}).catch (function (e) {
		    console.error("Generic error: " + e);
			});
		}
	}
	if( messagetype == 2) {
		let dbMsg = data[1];
		delete dbMsg.type;
		dbMsg.time = dbMsg.mid / 8388608 + 1451577600000;
		dbMsg.hash = '';
		window.TS_WEB.dataBase.transaction('rw', window.TS_WEB.dataBase.messagebase, () => {
			window.TS_WEB.dataBase.messagebase.add(dbMsg);
		});
		app.$store.dispatch(TOTALMESSAGELIST, cb => {
			cb(dbMsg);
		});
	}
};

function onError (error) {

};

// 关闭事件
function onClose (evt) {
	app.$store.dispatch(IMSTATUS, cb => {
		cb({
			open: false
		})
	});
};

// 开启事件
function onOpen (evt) {
	// window.TS_WEB.webSocket.send('2["convr.get"]');
	app.$store.dispatch(IMSTATUS, cb => {
		cb({
			open: true
		})
	});
};

export {
	connect
}