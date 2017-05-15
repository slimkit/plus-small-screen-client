import { TOTALMESSAGELISTS, TOTALMESSAGELIST, SYNCIMMESSAGE } from '../stores/types';
import { app } from '../index';
import { getImMessageItem } from './localDatabase';
import localEvent from '../stores/localStorage';
import lodash from 'lodash';
import { getUserInfo } from './user';

const url = window.TS_WEB.socketUrl;
const im_token = window.TS_WEB.im_token;
const reg = /^\[\"(.*?);\",/;
const currentUser = localEvent.getLocalItem('UserLoginInfo');
function connect (url) {
	// let counter = 0;
	try {
		window.TS_WEB.webSocket = new window.WebSocket(url);
		// window.TS_WEB.webSocket.onopen = evt => {
		// 	onOpen(evt);
		// }
		window.TS_WEB.webSocket.onmessage = evt => {
			onMessage(evt);
		}
		// window.TS_WEB.webSocket.onerror = evt => {
		// 	onError(evt);
		// }
	} catch (e) {
		window.console.log(e);
	}
};

function onMessage (message) { 
	let msg = message;
	let messagetype = msg.data.substr(0, 1); // 获取消息第一位判断消息类型
	let data = JSON.parse(msg.data.substr(1)); // 数据转换

	// }
	if(messagetype == 3) {
		let user = localEvent.getLocalItem(`user_${currentUser.user_id}`);
		if(data[0] === 'convr.msg.sync') {
			data[1].forEach( value => {
				if(user.user_id != value.uid) {
					app.$store.dispatch(SYNCIMMESSAGE, cb => {
						cb(value);
					});
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
				});
			} else {
				data[1].avatar = user.avatar[30];
				data[1].name = user.name;
			}
		}
		app.$store.dispatch(TOTALMESSAGELIST, cb => {
			cb(data);
		})
	}
};

function onError (error) {

};

function onOpen (evt) {
	window.TS_WEB.webSocket.send('2["convr.get"]');
};

function sendMessage (message) {
	if(window.TS_WEB.webSocket.readyState) {
		window.TS_WEB.socketUrl.send(message);
	} else {
		connect(`${url}?token=${im_token}`);
		sendMessage(message);
	}
}

export {
	connect,
	sendMessage
}