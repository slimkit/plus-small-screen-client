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
	// console.log(data);
	if(messagetype == 3) {
		let user = localEvent.getLocalItem(`user_${currentUser.user_id}`);
		if(data[0] === 'convr.msg.sync' && data[1].length) {
			// data[1] = data[1].reverse();
			data[1].forEach( (value, index) => {
				let newData = ['convr.msg'];
				let formateData = {
					cid: value.cid,
					ext: {
						hash: value.ext.hash,
						time: value.ext.time,
						to_uid: value.ext.to_uid
					},
					mid: value.mid,
					name: '',
					seq: value.seq,
					txt: value.txt,
					type: value.type,
					uid: value.uid
				};
				newData.push(formateData);
				app.$store.dispatch(TOTALMESSAGELIST, cb => {
					cb(newData);
				});
				if(index == (data[1].length - 1)) {
					localEvent.setLocalItem(`room_${data[1][data[1].length - 1].cid}_last_message`, newData);
				}
			});
		}
	}
	if( messagetype == 2) {
		if(currentUser.user_id != data[1].uid) {
			let user = localEvent.getLocalItem(`user_${data[1].uid}`);
			if(!lodash.keys(user).length > 0) {
				getUserInfo(data[1].uid, 30).then( u => {
					data[1].avatar = u.avatar[30];
					data[1].name = u.name;
					app.$store.dispatch(TOTALMESSAGELIST, cb => {
						cb(data);
					});
					localEvent.setLocalItem(`room_${data[1].cid}_last_message`, data);
				});
			} else {
				data[1].avatar = user.avatar[30];
				data[1].name = user.name;
				// console.log(data);
				app.$store.dispatch(TOTALMESSAGELIST, cb => {
					cb(data);
				});
				localEvent.setLocalItem(`room_${data[1].cid}_last_message`, data);
			}
		}
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